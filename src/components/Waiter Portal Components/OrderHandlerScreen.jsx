import React, { useEffect, useState } from "react";
import supabase from "../../services/supabase";
import { useNavigate } from "react-router-dom";

export default function OrdersHandlerScreen({ loc_id }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial orders
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("ORDER_DB")
        .select("order_id, table_id, status")
        .eq("loc_id", loc_id)
        .eq("status", "New");

      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(data);
      }
      setLoading(false);
    };

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
          filter: `loc_id=eq.${loc_id}`
        },
        (payload) => {
          setOrders((prevOrders) => [payload.new, ...prevOrders]); // Add the new order to the state
          showOrderNotification(payload.new);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [loc_id]);

  // Show a desktop notification for new orders
  const showOrderNotification = (order) => {
    if (Notification.permission === "granted") {
      new Notification("New Order Received!", {
        body: `Order ID: ${order.order_id}, Table: ${order.table_id}`,
        icon: "/notification-icon.png",
      });
    }
  };

  // Handle the navigation to order details
  const handleViewOrder = (order) => {
    navigate(`/location/${loc_id}/orders/${order.order_id}`);
  };

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Orders for Location: {loc_id}
      </h1>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No new orders available...</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.order_id}
              className="flex items-center justify-between p-4 bg-white rounded-md shadow-md"
            >
              <p className="text-lg font-semibold">Table ID: {order.table_id}</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
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
