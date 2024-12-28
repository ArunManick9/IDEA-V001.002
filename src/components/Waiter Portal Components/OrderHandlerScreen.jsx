import React, { useEffect, useState } from "react";
import supabase from "../../services/supabase";
import { useNavigate } from "react-router-dom";

export default function OrdersHandlerScreen({ loc_id, onCountChange }) {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("New"); // Current tab state
	const navigate = useNavigate();

	// Fetch initial orders
	const fetchOrders = async () => {
		const { data, error } = await supabase
			.from("ORDER_DB")
			.select("order_id, table_id, status")
			.eq("loc_id", loc_id);

		if (error) {
			console.error("Error fetching orders:", error);
		} else {
			setOrders(data);
			onCountChange(data.length); // Update the counter
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchOrders();

		// Subscribe to INSERT events for new orders
		const channel = supabase
			.channel("orders-channel")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "ORDER_DB",
					filter: `loc_id=eq.${loc_id}`,
				},
				(payload) => {
					setOrders((prevOrders) => [payload.new, ...prevOrders]);
					onCountChange((prevCount) => prevCount + 1); // Increment the counter
					showOrderNotification(payload.new);
				}
			)
			.subscribe();

		// Cleanup subscription on unmount
		return () => {
			supabase.removeChannel(channel);
		};
	}, [loc_id, onCountChange]);

	// Show a desktop notification for new orders
	const showOrderNotification = (order) => {
		if (Notification.permission === "granted") {
			new Notification("New Order Received!", {
				body: `Order ID: ${order.order_id}, Table: ${order.table_id}`,
				icon: "/notification-icon.png",
			});
		}
	};

	// Handle navigation to order details
	const handleViewOrder = (order) => {
		navigate(`/location/${loc_id}/orders/${order.order_id}`);
	};

	// Filter orders by status
	const filteredOrders = orders.filter((order) => order.status === activeTab);

	if (loading) {
		return <p className="text-center mt-10">Loading orders...</p>;
	}

	return (
		<div className="min-h-screen orders-page p-4">
			<h1 className="text-2xl font-bold text-center mb-6 confirmation-table--header">
				Orders for Location: {loc_id}
			</h1>

			{/* Tabs for different statuses */}
			<div className="flexbox justify-center space-x-4 mb-6">
				{["New", "Verified", "Accepted", "Fulfilled"].map((status) => (
					<button
						key={status}
						className={`px-4 py-2 rounded-md ${
							activeTab === status
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700"
						} hover:bg-blue-600 transition-colors`}
						onClick={() => setActiveTab(status)}
					>
						{status}
					</button>
				))}
			</div>

			{/* Orders List */}
			<div className="space-y-4">
				{filteredOrders.length === 0 ? (
					<p className="text-center text-gray-500">
						No orders under "{activeTab}" status.
					</p>
				) : (
					filteredOrders.map((order) => (
						<div
							key={order.order_id}
							className="flexbox items-center justify-between p-4 order-card rounded-md shadow-md"
						>
							<p className="text-lg font-semibold">
								Table ID: {order.table_id}
							</p>
							<button
								className="btn px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
								onClick={() => handleViewOrder(order)}
							>
								View Order
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
}
