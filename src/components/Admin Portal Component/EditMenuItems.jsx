import React, { useState } from "react";

const EditMenuItemModal = ({ menuItem, onClose, onSave }) => {
  const [editedItem, setEditedItem] = useState({ ...menuItem });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedItem); // Trigger save action in parent
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg w-[90%] max-w-lg max-h-screen overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Edit Menu Item</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {/* Image Preview */}
          <div className="flex justify-center mb-4">
            <img
              src={editedItem.image}
              alt="Menu Item"
              className="w-40 h-40 object-cover rounded-md shadow-md"
            />
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="name"
              value={editedItem.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={editedItem.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={editedItem.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Menu Field (Disabled) */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Menu</label>
            <input
              type="text"
              name="inmenu"
              value={editedItem.inmenu}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="text-sm text-gray-500 mt-1">
              Editing the menu is not allowed. Please delete and create a new
              menu instead.
            </p>
          </div>

          {/* Category Field (Disabled) */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <input
              type="text"
              name="incategory"
              value={editedItem.incategory}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="text-sm text-gray-500 mt-1">
              Editing the category is not allowed. Please delete and create a
              new menu instead.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMenuItemModal;
