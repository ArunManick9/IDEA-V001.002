import supabase from "./supabase";

const { data, error } = await supabase
  .from('MENU_LIST')
  .insert( [
    {
      "menu_id": "001",
      "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHNwYWdoZXR0aXxlbnwwfHx8fDE2NDU5NzQxMzA&ixlib=rb-1.2.1&q=80&w=400",
      "name": "Spaghetti Carbonara",
      "description": "Classic Italian pasta with creamy sauce and pancetta.",
      "ingredients": "Pasta, eggs, pancetta, parmesan cheese, pepper",
      "price": 12.99,
      "veg_or_nonveg": "Non-Veg",
      "inmenu": "Food",
      "incategory": "Dinner",
      "inlocation": "Location A"
    },
    {
      "menu_id": "002",
      "image": "https://images.unsplash.com/photo-1547592180-2c664d0434bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGJ1cmdlcnxlbnwwfHx8fDE2NDU5NzQxMzA&ixlib=rb-1.2.1&q=80&w=400",
      "name": "Cheeseburger",
      "description": "Juicy grilled burger with cheddar cheese and fresh vegetables.",
      "ingredients": "Beef, cheddar, lettuce, tomato, pickles, onion, burger bun",
      "price": 9.99,
      "veg_or_nonveg": "Non-Veg",
      "inmenu": "Food",
      "incategory": "Lunch",
      "inlocation": "Location B"
    },
    {
      "menu_id": "003",
      "image": "https://images.unsplash.com/photo-1594007650640-e1633467c3d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEyfHxwYW5jYWtlc3xlbnwwfHx8fDE2NDU5NzQxMzA&ixlib=rb-1.2.1&q=80&w=400",
      "name": "Pancakes",
      "description": "Fluffy pancakes served with syrup and fresh berries.",
      "ingredients": "Flour, eggs, milk, butter, syrup, berries",
      "price": 7.99,
      "veg_or_nonveg": "Veg",
      "inmenu": "Food",
      "incategory": "Breakfast",
      "inlocation": "Location C"
    },
    {
      "menu_id": "004",
      "image": "https://images.unsplash.com/photo-1564865888551-30c17a2a0e8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHNhbGFkfGVufDB8fHx8MTY0NTk3NDEzMA&ixlib=rb-1.2.1&q=80&w=400",
      "name": "Caesar Salad",
      "description": "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan.",
      "ingredients": "Romaine lettuce, croutons, parmesan, Caesar dressing",
      "price": 8.99,
      "veg_or_nonveg": "Veg",
      "inmenu": "Snacks",
      "incategory": "Lunch",
      "inlocation": "Location D"
    },
    {
      "menu_id": "005",
      "image": "https://images.unsplash.com/photo-1551024601-bec78aea704b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGVzcHJlc3NvfGVufDB8fHx8MTY0NTk3NDEzMA&ixlib=rb-1.2.1&q=80&w=400",
      "name": "Espresso",
      "description": "Rich and strong espresso, perfect for a quick pick-me-up.",
      "ingredients": "Espresso beans, water",
      "price": 3.50,
      "veg_or_nonveg": "Veg",
      "inmenu": "Drinks",
      "incategory": "Breakfast",
      "inlocation": "Location E"
    },
    {
      "menu_id": "006",
      "image": "https://images.unsplash.com/photo-1506812574058-fc75fa93fead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDE2fHxoYW1idXJnfGVufDB8fHx8MTY0NTk3NDEzMA&ixlib=rb-1.2.1&q=80&w=400",
      "name": "Hamburger",
      "description": "Classic hamburger with lettuce, tomato, and pickles.",
      "ingredients": "Beef, lettuce, tomato, pickles, burger bun",
      "price": 8.50,
      "veg_or_nonveg": "Non-Veg",
      "inmenu": "Food",
      "incategory": "Dinner",
      "inlocation": "Location F"
    },
    {
      "menu_id": "007",
      "image": "https://images.unsplash.com/photo-1546833999-17d1a0ed1b5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGZyYXBlc3xlbnwwfHx8fDE2NDU5NzQxMzA&ixlib=rb-1.2.1&q=80&w=400",
      "name": "Frappuccino",
      "description": "Cold and creamy coffee blended with ice.",
      "ingredients": "Coffee, milk, sugar, ice, whipped cream",
      "price": 5.00,
      "veg_or_nonveg": "Veg",
      "inmenu": "Drinks",
      "incategory": "Snacks",
      "inlocation": "Location G"
    },
    {
      "menu_id": "008",
      "image": "https://images.unsplash.com/photo-1604908177603-e4f8a6734165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fG1hY2hlcm9ufGVufDB8fHx8MTY0NTk3NDEzMA&ixlib=rb-1.2.1&q=80&w=400",
      "name": "Macarons",
      "description": "Delicate French macarons in assorted flavors.",
      "ingredients": "Almond flour, sugar, egg whites, filling",
      "price": 12.00,
      "veg_or_nonveg": "Veg",
      "inmenu": "Snacks",
      "incategory": "Lunch",
      "inlocation": "Location H"
    },
    {
      "menu_id": "009",
      "image": "https://images.unsplash.com/photo-1559056199-8f99d4b30c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGNva2t0YWlsfGVufDB8fHx8MTY0NTk3NDEzMA&ixlib=rb-1.2.1&q=80&w=400",
      "name": "Cocktail",
      "description": "Refreshing cocktail with a blend of fruity flavors.",
      "ingredients": "Rum, fruit juice, ice, garnish",
      "price": 7.50,
      "veg_or_nonveg": "Veg",
      "inmenu": "Drinks",
      "incategory": "Dinner",
      "inlocation": "Location I"
    },
    {
      "menu_id": "010",
      "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDIxfHxwaXp6YXxlbnwwfHx8fDE2NDU5NzQxMzA&ixlib=rb-1.2.1&q=80&w=400",
      "name": "Pizza Margherita",
      "description": "Classic Margherita pizza with tomatoes, mozzarella, and basil.",
      "ingredients": "Pizza dough, tomatoes, mozzarella, basil, olive oil",
      "price": 10.99,
      "veg_or_nonveg": "Veg",
      "inmenu": "Food",
      "incategory": "Dinner",
      "inlocation": "Location J"
    },
        {
          "menu_id": "011",
          "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGNodXJyb3N8ZW58MHx8fHwxNjQ1OTc0MTMw&ixlib=rb-1.2.1&q=80&w=400",
          "name": "Churros",
          "description": "Crispy fried dough with a cinnamon sugar coating.",
          "ingredients": "Flour, sugar, cinnamon, butter, oil",
          "price": 5.99,
          "veg_or_nonveg": "Veg",
          "inmenu": "Snacks",
          "incategory": "Dinner",
          "inlocation": "Location K"
        },
        {
          "menu_id": "012",
          "image": "https://images.unsplash.com/photo-1599974574647-d0f0069012f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fG9hdG1lYWx8ZW58MHx8fHwxNjQ1OTc0MTMw&ixlib=rb-1.2.1&q=80&w=400",
          "name": "Oatmeal Bowl",
          "description": "Hearty oatmeal topped with fresh fruits and nuts.",
          "ingredients": "Oats, milk, berries, nuts, honey",
          "price": 6.99,
          "veg_or_nonveg": "Veg",
          "inmenu": "Food",
          "incategory": "Breakfast",
          "inlocation": "Location L"
        },
        {
          "menu_id": "013",
          "image": "https://images.unsplash.com/photo-1543339308-43c0d0c52d57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHNoYWtlc2hha2V8ZW58MHx8fHwxNjQ1OTc0MTMw&ixlib=rb-1.2.1&q=80&w=400",
          "name": "Milkshake",
          "description": "Creamy milkshake with a variety of flavors.",
          "ingredients": "Milk, ice cream, flavoring, whipped cream",
          "price": 4.99,
          "veg_or_nonveg": "Veg",
          "inmenu": "Beverage",
          "incategory": "Snacks",
          "inlocation": "Location M"
        },
        {
          "menu_id": "014",
          "image": "https://images.unsplash.com/photo-1572441716172-1a23a52ad8ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fG1hY2hlcm9ufGVufDB8fHx8MTY0NTk3NDEzMA&ixlib=rb-1.2.1&q=80&w=400",
          "name": "Chocolate Macaron",
          "description": "French macaron filled with rich chocolate ganache.",
          "ingredients": "Almond flour, cocoa powder, sugar, egg whites, chocolate",
          "price": 2.99,
          "veg_or_nonveg": "Veg",
          "inmenu": "Snacks",
          "incategory": "Lunch",
          "inlocation": "Location N"
        },
        {
          "menu_id": "015",
          "image": "https://images.unsplash.com/photo-1516822003756-296fd9c7461e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGJldmVyYWdlfGVufDB8fHx8MTY0NTk3NDEzMA&ixlib=rb-1.2.1&q=80&w=400",
          "name": "Lemonade",
          "description": "Refreshing homemade lemonade with a zesty flavor.",
          "ingredients": "Lemon juice, water, sugar, ice",
          "price": 3.50,
          "veg_or_nonveg": "Veg",
          "inmenu": "Beverage",
          "incategory": "Lunch",
          "inlocation": "Location O"
        },
        {
          "menu_id": "016",
          "image": "https://images.unsplash.com/photo-1606760226467-3efb52b3ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGNoaWNvZ2F8ZW58MHx8fHwxNjQ1OTc0MTMw&ixlib=rb-1.2.1&q=80&w=400",
          "name": "Chicago Pizza",
          "description": "Deep-dish pizza with mozzarella and marinara sauce.",
          "ingredients": "Pizza dough, mozzarella, marinara sauce, toppings",
          "price": 13.99,
          "veg_or_nonveg": "Veg",
          "inmenu": "Food",
          "incategory": "Dinner",
          "inlocation": "Location P"
        },
        {
          "menu_id": "017",
          "image": "https://images.unsplash.com/photo-1562958171-becb74e2b2eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHNhbGFkfGVufDB8fHx8MTY0NTk3NDEzMA&ixlib=rb-1.2.1&q=80&w=400",
          "name": "Greek Salad",
          "description": "Crisp salad with feta cheese, olives, and a tangy dressing.",
          "ingredients": "Lettuce, cucumber, olives, feta cheese, olive oil",
          "price": 8.99,
          "veg_or_nonveg": "Veg",
          "inmenu": "Snacks",
          "incategory": "Lunch",
          "inlocation": "Location Q"
        },
        {
          "menu_id": "018",
          "image": "https://images.unsplash.com/photo-1556905055-8f358a4b25ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHNwYWdldHRpfGVufDB8fHx8MTY0NTk3NDEzMA&ixlib=rb-1.2.1&q=80&w=400",
          "name": "Spaghetti Bolognese",
          "description": "Italian pasta with a hearty meat sauce.",
          "ingredients": "Pasta, ground beef, tomato sauce, garlic, parmesan cheese",
          "price": 11.99,
          "veg_or_nonveg": "Non-Veg",
          "inmenu": "Food",
          "incategory": "Dinner",
          "inlocation": "Location R"
        },
        {
          "menu_id": "019",
          "image": "https://images.unsplash.com/photo-1506355682940-bad09fc03f8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGVnZyUyMGJlbmVkaWN0fGVufDB8fHx8MTY0NTk3NDEzMA&ixlib=rb-1.2.1&q=80&w=400",
          "name": "Eggs Benedict",
          "description": "Classic breakfast dish with poached eggs and hollandaise sauce.",
          "ingredients": "Eggs, English muffin, Canadian bacon, hollandaise sauce",
          "price": 9.99,
          "veg_or_nonveg": "Non-Veg",
          "inmenu": "Food",
          "incategory": "Breakfast",
          "inlocation": "Location S"
        },
        {
          "menu_id": "020",
          "image": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHBhdHR5JTIwbGVtb25zYWRlc3xlbnwwfHx8fDE2NDU5NzQxMzA&ixlib=rb-1.2.1&q=80&w=400",
          "name": "Patty Melt",
          "description": "Classic breakfast dish with poached eggs and hollandaise sauce.",
          "ingredients": "Eggs, English muffin, Canadian bacon, hollandaise sauce",
          "price": 9.99,
          "veg_or_nonveg": "Non-Veg",
          "inmenu": "Food",
          "incategory": "Breakfast",
          "inlocation": "Location S"
        }
      
  ])
  .select()
          

  if(error){
    console.log(error)
  }