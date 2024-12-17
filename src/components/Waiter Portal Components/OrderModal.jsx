import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../services/supabase";

export default function OrderModal() {
	const { loc_id, order_id } = useParams();
	const navigate = useNavigate();
	const [orderDetails, setOrderDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const [fadeIn, setFadeIn] = useState(false);
	const [isVerified, setIsVerified] = useState(false);

	useEffect(() => {
		const fetchOrderDetails = async () => {
			const { data, error } = await supabase
				.from("ORDER_DB")
				.select("*")
				.eq("loc_id", loc_id)
				.eq("order_id", order_id);

			if (error) {
				console.error("Error fetching order details:", error);
			} else if (data.length > 0) {
				const order = data[0];
				if (order.order_list && typeof order.order_list === "string") {
					try {
						order.order_list = JSON.parse(order.order_list);
					} catch (parseError) {
						console.error("Error parsing order_list:", parseError);
						order.order_list = [];
					}
				}
				setOrderDetails(order);
				setIsVerified(order.status === "Verified"); // Check if order is already verified
			}
			setLoading(false);
			setFadeIn(true);
		};

		fetchOrderDetails();
	}, [loc_id, order_id]);

	const verifyOrder = async () => {
		const { data, error } = await supabase
			.from("ORDER_DB")
			.update({ status: "Verified" })
			.eq("order_id", order_id)
			.select();

		if (error) {
			console.error("Error updating order status:", error);
		} else {
			setIsVerified(true); // Update the button state to Verified
		}
	};

	const handleClose = () => {
		setFadeIn(false);
		navigate(-1); // Go back one step in navigation history
	};

	if (loading) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30 order-modal-alt">
				<div className="bg-white p-6 rounded-md shadow-md w-1/3 text-center">
					<p>Loading order details...</p>
				</div>
			</div>
		);
	}

	if (!orderDetails || !Array.isArray(orderDetails.order_list)) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 order-modal-alt">
				<div className="bg-white p-6 rounded-md shadow-md w-1/3 text-center">
					<p>Error loading order details or no items available.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center z-50 order-modal-container">
			<div className="relative w-11/12 md:w-2/3 lg:w-1/2 rounded-lg shadow-lg p-8 order-modal">
				<button
					className="absolute top-4 right-4 fg-white hover:text-gray-900"
					onClick={handleClose}
				>
					<AiOutlineClose size={24} />
				</button>

				<h2 className="text-2xl font-bold mb-6 text-center fg-contrast">
					Order Details
				</h2>

				<div className="space-y-4 mb-6">
					<p>
						<strong>Location ID:</strong> {orderDetails.loc_id}
					</p>
					<p>
						<strong>Order ID:</strong> {orderDetails.order_id}
					</p>
					<p>
						<strong>Table ID:</strong> {orderDetails.table_id}
					</p>
				</div>

				<div className="space-y-4 ">
					<h3 className="text-xl font-semibold mb-4">Items</h3>
					{orderDetails.order_list.map((item) => (
						<div
							key={item.item_id}
							className="flex items-center justify-between p-4 rounded-md order-item-card"
						>
							<div>
								<p className="text-lg font-medium">{item.item_name}</p>
								<p className="order-detail-line">
									Price: ₹{item.price} | Quantity: {item.quantity}
								</p>
							</div>
							<button
								className="order-edit-icon"
								onClick={() => console.log(`Editing item ${item.item_id}`)}
							>
								<AiOutlineEdit size={20} />
							</button>
						</div>
					))}
				</div>

				<div className="flexbox justify-between mt-8">
					<button
						className="btn btn--submit px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
						onClick={() => console.log("Add items clicked")}
					>
						Add Items
					</button>
					<button
						className={`btn ${
							isVerified ? "btn--add" : "btn--submit"
						}  px-4 py-2 rounded-md transition-colors ${
							isVerified ? "" : "hover:bg-green-600"
						}`}
						onClick={verifyOrder}
						disabled={isVerified}
					>
						{isVerified ? "Verified" : "Verify Order"}
					</button>
				</div>
			</div>
		</div>
	);
}
