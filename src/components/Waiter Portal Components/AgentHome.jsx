// src/AgentHome.js
import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import OrdersHandlerScreen from './OrderHandlerScreen';
import ProfileScreen from './ProfileScreen';
import ConfirmTableScreen from './ConfirmationTable';
import { useParams } from 'react-router-dom';

export default function AgentHome() {
  const [currentPage, setCurrentPage] = useState(0);
  const {loc_id,agent_id} = useParams()

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentPage((prev) => Math.min(prev + 1, 2)),
    onSwipedRight: () => setCurrentPage((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
  });

  return (
    <div {...handlers} className="overflow-hidden w-screen h-screen">
      <div
        className="flex transition-transform duration-300"
        style={{ transform: `translateX(-${currentPage * 100}%)` }}
      >
        <div className="w-screen h-screen flex-shrink-0">
          <ConfirmTableScreen />
        </div>
        <div className="w-screen h-screen flex-shrink-0">
          <OrdersHandlerScreen loc_id={loc_id}/>
        </div>
        <div className="w-screen h-screen flex-shrink-0">
          <ProfileScreen agent_id={agent_id} loc_id={loc_id}/>
        </div>
      </div>
    </div>
  );
}
