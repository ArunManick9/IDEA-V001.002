import React from 'react'
import MenuList from './components/MenuList';

const data = {
  "address": "Kuvempu Nagar Bus Stand, BTM Stage 2",
  "contactNumber": 987654321,
  "created_at": "2024-08-22T19:12:04.31996+00:00",
  "customerId": 1234,
  "id": 1,
  "image": "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "loc_id": "ABC_LOCBAS_001A",
  "menus": [
      {
          "menu_type": "Food",
          "categories": [
              {
                  "category_id": "CAT001",
                  "category_name": "Breakfast"
              },
              {
                  "category_id": "CAT002",
                  "category_name": "Lunch"
              },
              {
                  "category_id": "CAT003",
                  "category_name": "Dinner"
              }
          ]
      },
      {
          "menu_type": "Beverages",
          "categories": [
              {
                  "category_id": "CAT004",
                  "category_name": "Coffee"
              },
              {
                  "category_id": "CAT005",
                  "category_name": "Tea"
              }
          ]
      },
      {
          "menu_type": "Drinks",
          "categories": [
              {
                  "category_id": "CAT006",
                  "category_name": "Soft Drinks"
              },
              {
                  "category_id": "CAT007",
                  "category_name": "Juices"
              }
          ]
      },
      {
          "menu_type": "Snacks",
          "categories": [
              {
                  "category_id": "CAT008",
                  "category_name": "Chips"
              },
              {
                  "category_id": "CAT009",
                  "category_name": "Cookies"
              }
          ]
      }
  ],
  "name": "Ambal Mess",
  "user_id": null
};


export default function App() {
  return (
    <div>
        <MenuList data={data}/>
    </div>
  )
}
