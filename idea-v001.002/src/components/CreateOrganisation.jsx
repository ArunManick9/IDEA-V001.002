import React, { useState } from 'react';
import { useLocations } from '../context/LocationContext';
import { addlocationtodb } from '../services/supported_api';
import axios from 'axios'; // Import axios for API request

const CreateOrganization = (user_id) => {
  //console.log(user_id.user_id)
  const [currentStep, setCurrentStep] = useState(0); // 0: Image & Name, 1: Address & Contact, 2: Menus & Categories
  const [formData, setFormData] = useState({
    image: null,
    name: '',
    address: '',
    contactNumber: '',
    customerId: '',
    user_id: user_id.user_id,
  });
  const [imagePreview, setImagePreview] = useState('');
  const [menuInput, setMenuInput] = useState('');
  const [menuList, setMenuList] = useState([]);
  const [categories, setCategories] = useState({});
  const { updateLocations, triggerLocationUpdate } = useLocations();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show the image preview to the user
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Create FormData object for the image upload
      const formData = new FormData();
      formData.append('image', file);
      formData.append('expiration', '0');

      try {
        // Send a POST request to the imgbb API
        const response = await axios.post(
          'https://api.imgbb.com/1/upload?expiration=600&key=eba7a098c00b0b6007f4820231498515',
          formData
        );
        
        console.log('Image upload response:', response.data);

        // Update formData with the image URL returned by imgbb
        setFormData((prevData) => ({
          ...prevData,
          image: response.data.data.url, // URL of the uploaded image
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  // Rest of your form logic remains the same
  const handleAddMenu = () => {
    if (menuInput) {
      setMenuList((prevList) => [
        ...prevList,
        { menuType: menuInput, categories: [] }
      ]);
      setMenuInput('');
    }
  };

  const handleDeleteMenu = (index) => {
    setMenuList((prevList) => prevList.filter((_, i) => i !== index));
    setCategories((prevCategories) => {
      const newCategories = { ...prevCategories };
      delete newCategories[index];
      return newCategories;
    });
  };

  const handleAddCategory = (menuIndex) => {
    setCategories((prevCategories) => {
      const newCategories = { ...prevCategories };
      if (!newCategories[menuIndex]) {
        newCategories[menuIndex] = [''];
      } else {
        newCategories[menuIndex] = [...newCategories[menuIndex], ''];
      }
      return newCategories;
    });
  };

  const handleCategoryChange = (menuIndex, categoryIndex, value) => {
    setCategories((prevCategories) => {
      const newCategories = { ...prevCategories };
      newCategories[menuIndex][categoryIndex] = value;
      return newCategories;
    });
  };

  const handleCategoryDelete = (menuIndex, categoryIndex) => {
    setCategories((prevCategories) => {
      const newCategories = { ...prevCategories };
      newCategories[menuIndex].splice(categoryIndex, 1);
      return newCategories;
    });
  };

  const generateLocId = (name, prevLocId = 'ABC_XXX_000A') => {
    const prefix = `ABC_${name.slice(0, 3).toUpperCase()}`;
    const suffix = prevLocId.slice(-4);
    let numPart = parseInt(suffix.slice(0, 3), 10);
    let charPart = suffix.slice(3);

    numPart += 1;
    if (numPart > 999) {
      numPart = 1;
      charPart = String.fromCharCode(charPart.charCodeAt(0) + 1);
    }

    const numPartStr = numPart.toString().padStart(3, '0');
    return `${prefix}_${numPartStr}${charPart}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === 2 && menuList.length === 0) {
      alert('Please add at least one menu.');
      return;
    }

    if (currentStep === 2) {
      const loc_id = generateLocId(formData.name);
      const menus = menuList.map((menu, index) => ({
        menu_type: menu.menuType,
        categories: categories[index]?.map((category, idx) => ({
          category_id: `CAT${(index + 1) * 100 + (idx + 1).toString().padStart(3, '0')}`,
          category_name: category,
        })) || [],
      }));

      const submittedData = { ...formData, loc_id, menus };

      try {
        await addlocationtodb(submittedData);
        triggerLocationUpdate();
      } catch (error) {
        console.error('Error adding location:', error);
      }

      setFormData({
        image: null,
        name: '',
        address: '',
        contactNumber: '',
        customerId: '',
        user_id: user_id
      });
      setMenuList([]);
      setCategories({});
      setImagePreview('');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 overflow-auto z-50">
      <div className="relative bg-gray-900 text-white p-8 rounded-lg shadow-lg w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl backdrop-blur-md bg-opacity-70 border border-gray-700 overflow-y-auto max-h-screen z-50">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Organization</h2>

        <form onSubmit={handleSubmit}>
          {currentStep === 0 && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-black file:bg-blue-600 file:text-white file:border-0 file:rounded-md file:py-2 file:px-4 hover:file:bg-blue-700 transition-colors duration-300"
                  required
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="w-48 h-48 mt-4 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border text-black border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
            </>
          )}

          {currentStep === 1 && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border text-black border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border text-black border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Customer ID</label>
                <input
                  type="text"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border text-black border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium">Menus</label>
                {menuList.map((menu, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between items-center">
                      <span>{menu.menuType}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteMenu(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>

                    {categories[index]?.map((category, categoryIndex) => (
                      <div key={categoryIndex} className="flex justify-between items-center mt-1">
                        <input
                          type="text"
                          value={category}
                          onChange={(e) =>
                            handleCategoryChange(index, categoryIndex, e.target.value)
                          }
                          className="mt-1 block w-full border text-black border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => handleCategoryDelete(index, categoryIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddCategory(index)}
                      className="text-blue-600 hover:text-blue-800 mt-2"
                    >
                      Add Category
                    </button>
                  </div>
                ))}

                <input
                  type="text"
                  value={menuInput}
                  onChange={(e) => setMenuInput(e.target.value)}
                  placeholder="Enter new menu"
                  className="mt-1 block w-full border text-black border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                <button
                  type="button"
                  onClick={handleAddMenu}
                  className="mt-2 text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Menu
                </button>
              </div>
            </>
          )}

          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="text-white bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Back
              </button>
            )}
            {currentStep < 2 ? (
              <button
                type="submit"
                className="text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="text-white bg-green-600 px-4 py-2 rounded-md hover:bg-green-700"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrganization;
