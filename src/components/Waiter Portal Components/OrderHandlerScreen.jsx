import React, { useEffect, useState } from "react";
import supabase from "../../services/supabase";

export default function OrdersHandlerScreen({ loc_id, onCountChange }) {
  const [orders, setOrders] = useState([]);

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
      onCountChange(data.length); // Update counter
    }
  };

  useEffect(() => {
    fetchOrders();

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
          setOrders((prev) => [payload.new, ...prev]);
          onCountChange(prev.length + 1); // Increment counter
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loc_id, onCountChange]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.order_id} className="bg-white p-4 rounded shadow-md">
            Table: {order.table_id}
          </div>
        ))
      ) : (
        <p>No new orders.</p>
      )}
    </div>
  );
}
