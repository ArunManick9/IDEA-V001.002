import React, { useState } from "react";

const AddonsModal = ({ form, onAddonsSaved, onClose }) => {
  const [addons, setAddons] = useState([]);

  const handleAddAddon = () => {
    setAddons([...addons, ""]);
  };

  const handleRemoveAddon = (index) => {
    setAddons(addons.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, value) => {
    const updatedAddons = [...addons];
    updatedAddons[index] = value;
    setAddons(updatedAddons);
  };

  const handleSave = () => {
    const updatedForm = {
      ...form,
      addons_list: addons,
    };
    onAddonsSaved(updatedForm);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flexbox justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 md:w-2/3 p-6">
        <h2 className="text-xl font-bold mb-4">Enter Your List of Addons</h2>
        <div className="space-y-4">
          {addons.map((addon, index) => (
            <div key={index} className="flexbox items-center gap-4">
              <input
                type="text"
                placeholder={`Addon ${index + 1}`}
                value={addon}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={() => handleRemoveAddon(index)}
                className="text-red-500 hover:text-red-700"
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 flexbox justify-between">
          <button
            onClick={handleAddAddon}
            type="button"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Addon
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

export default AddonsModal;
