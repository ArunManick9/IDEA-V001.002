import React, { useEffect, useState } from 'react';
import supabase from '../../services/supabase';
import { updateOrderStatus } from '../../services/supported_api';

export default function Orders() {
  const [buckets, setBuckets] = useState({
    newOrders: [],
    acceptedOrders: [],
    fulfilledOrders: []
  });
  const [showNotification, setShowNotification] = useState(false);
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);
  const locid = 'ABC_SUN_001A';

  // Fetch orders and subscribe to real-time changes
  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('ORDER_DB')
        .select('*')
        .eq('loc_id', locid);

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        console.log("Fetched Orders:", data);

        // Categorize orders based on their status
        const newOrders = [];
        const acceptedOrders = [];
        const fulfilledOrders = [];

        data.forEach((order) => {
          if (order.status === 'New') {
            newOrders.push(order);
          } else if (order.status === 'Accepted') {
            acceptedOrders.push(order);
          } else if (order.status === 'Fulfilled') {
            fulfilledOrders.push(order);
          }
        });

        setBuckets({
          newOrders,
          acceptedOrders,
          fulfilledOrders
        });
      }
    };

    fetchOrders();

    const channel = supabase
      .channel('custom-filter-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ORDER_DB', filter: `loc_id=eq.${locid}` },
        (payload) => {
          setBuckets((prev) => ({
            ...prev,
            newOrders: [payload.new, ...prev.newOrders]
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
      return typeof orderList === 'string' ? JSON.parse(orderList) : orderList;
    } catch (error) {
      console.error('Error parsing order_list:', error);
      return [];
    }
  };

  // Move order to the next bucket and update the status using the external API
  const moveOrder = async (orderId, fromBucket, toBucket, newStatus) => {
    // Step 1: Move the order in frontend (immediate visual update)
    const orderToMove = buckets[fromBucket].find((order) => order.order_id === orderId);
    if (!orderToMove) return;

    setBuckets((prev) => ({
      ...prev,
      [fromBucket]: prev[fromBucket].filter((order) => order.order_id !== orderId),
      [toBucket]: [orderToMove, ...prev[toBucket]]
    }));

    // Step 2: Update order status in the backend after moving it visually
    await updateOrderStatus(orderId, newStatus);
  };

  // Render orders in each bucket
  const renderOrders = (bucket, fromBucket, toBucket, newStatus) => (
    <ul>
      {buckets[bucket].length === 0 ? (
        <li className="text-center text-gray-500">No orders in this bucket...</li>
      ) : (
        buckets[bucket].map((order) => (
          <li
            key={order.order_id}
            className={`relative mb-4 p-6 border rounded-md shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl bg-white ${
              highlightedOrderId === order.order_id ? 'bg-yellow-100' : 'bg-gray-50'
            }`}
          >
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <p className="text-lg font-semibold text-gray-700">Order ID: {order.order_id}</p>
                <div className="bg-blue-500 text-white font-bold text-lg px-4 py-2 rounded-md shadow-md">
                  Table: {order.table_id}
                </div>
              </div>
              <div className="text-gray-600">
                <p className="font-medium">Order Items:</p>
                <ul className="list-disc list-inside pl-4">
                  {order.order_list
                    ? parseOrderList(order.order_list).map((item, index) => (
                        <li key={index} className="text-sm">
                          {item.item_name} - <span className="font-semibold">Qty: {item.quantity}</span>
                        </li>
                      ))
                    : <li>No items in order</li>}
                </ul>
              </div>
            </div>
            {toBucket && (
              <button
                className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                onClick={() => moveOrder(order.order_id, fromBucket, toBucket, newStatus)}
              >
                Move to {toBucket.charAt(0).toUpperCase() + toBucket.slice(1).replace('Orders', '')}
              </button>
            )}
          </li>
        ))
      )}
    </ul>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Orders for Location: {locid}</h1>

      {showNotification && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center p-3 rounded-md shadow-lg">
          New order received!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">New Orders</h2>
          {renderOrders('newOrders', 'newOrders', 'acceptedOrders', 'Accepted')}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Accepted Orders</h2>
          {renderOrders('acceptedOrders', 'acceptedOrders', 'fulfilledOrders', 'Fulfilled')}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Fulfilled Orders</h2>
          {renderOrders('fulfilledOrders', 'fulfilledOrders', null, null)}
        </div>
      </div>
    </div>
  );
}
