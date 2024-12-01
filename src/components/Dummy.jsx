import React from 'react'
import { fetchAllMenuCardData } from '../services/supported_api'


export default function Dummy() {
   function onClickHandler(){

    console.log("Button is cliekced")
    fetchAllMenuCardData("ABC_SUN_001A")

   } 
  return (
    <div>
      <button onClick={onClickHandler}>
        Test 
      </button>
    </div>
  )
}
