import React, { useEffect, useState } from "react";
import supabase from "../../services/supabase";
import { updateOrderStatus } from "../../services/supported_api";

export default function OrdersPage() {
	const [buckets, setBuckets] = useState({
		newOrders: [],
		acceptedOrders: [],
		fulfilledOrders: [],
	});
	const [activeTab, setActiveTab] = useState("newOrders");
	const [showNotification, setShowNotification] = useState(false);
	const [highlightedOrderId, setHighlightedOrderId] = useState(null);
	const locid = "ABC_SUN_001A";

	// Fetch orders and subscribe to real-time changes
	useEffect(() => {
		const fetchOrders = async () => {
			const { data, error } = await supabase
				.from("ORDER_DB")
				.select("*")
				.eq("loc_id", locid);

			if (error) {
				console.error("Error fetching orders:", error);
			} else {
				console.log("Fetched Orders:", data);

				// Categorize orders based on their status
				const newOrders = [];
				const acceptedOrders = [];
				const fulfilledOrders = [];

				data.forEach((order) => {
					if (order.status === "New") {
						newOrders.push(order);
					} else if (order.status === "Accepted") {
						acceptedOrders.push(order);
					} else if (order.status === "Fulfilled") {
						fulfilledOrders.push(order);
					}
				});

				setBuckets({
					newOrders,
					acceptedOrders,
					fulfilledOrders,
				});
			}
		};

		fetchOrders();

		const channel = supabase
			.channel("custom-filter-channel")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "ORDER_DB",
					filter: `loc_id=eq.${locid}`,
				},
				(payload) => {
					setBuckets((prev) => ({
						...prev,
						newOrders: [payload.new, ...prev.newOrders],
					}));

					setShowNotification(true);
					setTimeout(() => setShowNotification(false), 3000);

					setHighlightedOrderId(payload.new.id);
					setTimeout(() => setHighlightedOrderId(null), 5000);
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	const parseOrderList = (orderList) => {
		try {
			return typeof orderList === "string" ? JSON.parse(orderList) : orderList;
		} catch (error) {
			console.error("Error parsing order_list:", error);
			return [];
		}
	};

	// Move order to the next bucket and update the status using the external API
	const moveOrder = async (orderId, fromBucket, toBucket, newStatus) => {
		const orderToMove = buckets[fromBucket].find(
			(order) => order.order_id === orderId
		);
		if (!orderToMove) return;

		setBuckets((prev) => ({
			...prev,
			[fromBucket]: prev[fromBucket].filter(
				(order) => order.order_id !== orderId
			),
			[toBucket]: [orderToMove, ...prev[toBucket]],
		}));

		await updateOrderStatus(orderId, newStatus);
	};

	// Render orders in each bucket
	const renderOrders = (bucket, fromBucket, toBucket, newStatus) => (
		<ul>
			{buckets[bucket].length === 0 ? (
				<li className="text-center text-gray-600">
					No orders in this bucket...
				</li>
			) : (
				buckets[bucket].map((order) => (
					<li
						key={order.order_id}
						className={`relative mb-4 p-4 border rounded-lg transition-transform transform hover:shadow-lg bg-white ${
							highlightedOrderId === order.order_id
								? "border-blue-500"
								: "border-gray-300"
						}`}
					>
						<div className="flex flex-col space-y-1">
							<div className="flex justify-between items-center">
								<p className="text-md font-semibold text-gray-800">
									Order ID: {order.order_id}
								</p>
								<div className="text-gray-700 font-semibold">
									Table: {order.table_id}
								</div>
							</div>
							<div className="text-gray-600">
								<p className="font-medium">Order Items:</p>
								<ul className="list-disc list-inside pl-4">
									{order.order_list ? (
										parseOrderList(order.order_list).map((item, index) => (
											<li key={index} className="text-sm">
												{item.item_name} -{" "}
												<span className="font-semibold">
													Qty: {item.quantity}
												</span>
											</li>
										))
									) : (
										<li>No items in order</li>
									)}
								</ul>
							</div>
						</div>
						{toBucket && (
							<button
								className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
								onClick={() =>
									moveOrder(order.order_id, fromBucket, toBucket, newStatus)
								}
							>
								Move to{" "}
								{toBucket.charAt(0).toUpperCase() +
									toBucket.slice(1).replace("Orders", "")}
							</button>
						)}
					</li>
				))
			)}
		</ul>
	);

	return (
		<div className="min-h-screen bg-gray-100 p-4">
			<h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
				Orders for Location: {locid}
			</h1>

			{showNotification && (
				<div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center p-2 rounded-md shadow-lg">
					New order received!
				</div>
			)}

			{/* Tab Navigation */}
			<div className="flex justify-around mb-4">
				{["newOrders", "acceptedOrders", "fulfilledOrders"].map((tab) => (
					<button
						key={tab}
						className={`flex-1 p-2 text-center ${
							activeTab === tab
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700"
						}`}
						onClick={() => setActiveTab(tab)}
					>
						{tab.charAt(0).toUpperCase() +
							tab.slice(1).replace("Orders", " Orders")}
					</button>
				))}
			</div>

			{/* Render Active Tab Content */}
			<div className="bg-white p-4 rounded-lg shadow-md">
				<h2 className="text-lg font-semibold mb-2 text-gray-800">
					{activeTab.charAt(0).toUpperCase() +
						activeTab.slice(1).replace("Orders", " Orders")}
				</h2>
				{renderOrders(
					activeTab,
					activeTab,
					activeTab === "newOrders"
						? "acceptedOrders"
						: activeTab === "acceptedOrders"
						? "fulfilledOrders"
						: null,
					activeTab === "newOrders"
						? "Accepted"
						: activeTab === "acceptedOrders"
						? "Fulfilled"
						: null
				)}
			</div>
		</div>
	);
}
