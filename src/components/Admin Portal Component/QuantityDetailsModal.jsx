import React, { useState } from "react";

const QuantityDetailsModal = ({ form, onQuantsDetailsSaved, onClose }) => {
  const [quantities, setQuantities] = useState([]);
  const [defaultIndex, setDefaultIndex] = useState(null);

  const handleAddRow = () => {
    setQuantities([...quantities, { size: "", price: "" }]);
  };

  const handleRemoveRow = (index) => {
    const updatedQuantities = quantities.filter((_, i) => i !== index);
    setQuantities(updatedQuantities);
    if (defaultIndex === index) setDefaultIndex(null); // Reset default if removed
  };

  const handleInputChange = (index, field, value) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index][field] = value;
    setQuantities(updatedQuantities);
  };

  const handleToggleDefault = (index) => {
    setDefaultIndex(index);
  };

  const handleSave = () => {
    const updatedForm = {
      ...form,
      quantity_component: quantities,
      price: defaultIndex !== null ? quantities[defaultIndex]?.price : form.price,
    };
    onQuantsDetailsSaved(updatedForm);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flexbox justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 md:w-2/3 p-6">
        <h2 className="text-xl font-bold mb-4">Quantity Details</h2>
        <div className="space-y-4">
          {quantities.map((row, index) => (
            <div key={index} className="flexbox items-center gap-4">
              <input
                type="text"
                placeholder="Size"
                value={row.size}
                onChange={(e) => handleInputChange(index, "size", e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Price"
                value={row.price}
                onChange={(e) => handleInputChange(index, "price", e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={() => handleToggleDefault(index)}
                type="button"
                className={`px-4 py-2 rounded-md ${
                  defaultIndex === index ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
              >
                {defaultIndex === index ? "Default" : "Set Default"}
              </button>
              <button
                onClick={() => handleRemoveRow(index)}
                type="button"
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 flexbox justify-between">
          <button
            onClick={handleAddRow}
            type="button"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Row
          </button>
          <div className="flexbox gap-4">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantityDetailsModal;
