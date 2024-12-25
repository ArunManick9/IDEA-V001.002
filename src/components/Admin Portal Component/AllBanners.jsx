import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEnhanceTableRows } from '../../services/supported_api'; // Import the get function to fetch banners
import { handleToggleStatus } from '../../services/supported_api'; // Import the external function

export default function AllBanners() {
  const { loc_id } = useParams(); // Access loc_id from the URL params
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState(""); // To show popup message

  // Fetch banners when the component mounts
  useEffect(() => {
    const fetchBanners = async () => {
      const data = await getEnhanceTableRows(loc_id); // Pass loc_id to the API function
      setBanners(data || []); // Ensure banners is an empty array if no data
      setLoading(false);
    };

    fetchBanners();
  }, [loc_id]); // Dependency array ensures the fetch is triggered when loc_id changes

  // Now use the imported handleToggleStatus function to handle status change
  const onToggleStatus = async (bannerId, currentStatus) => {
    const updatedBanner = await handleToggleStatus(bannerId, currentStatus, setBanners);

    if (updatedBanner) {
      const newStatus = !currentStatus;
      setPopupMessage(`Banner is now ${newStatus ? 'active' : 'inactive'}`);
      console.log(`Banner ID: ${bannerId}, New Status: ${newStatus ? 'active' : 'inactive'}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Banners</h1>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Banner Name</th>
              <th className="border border-gray-300 px-4 py-2">Banner Type</th>
              <th className="border border-gray-300 px-4 py-2">Item Count</th>
              <th className="border border-gray-300 px-4 py-2">Associate Items</th>
              <th className="border border-gray-300 px-4 py-2">Is Active</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50`}
              >
                <td className="border border-gray-300 px-4 py-2">{banner.banner_name}</td>
                <td className="border border-gray-300 px-4 py-2">{banner.banner_type}</td>
                <td className="border border-gray-300 px-4 py-2">{banner.item_count}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flexbox flex-wrap gap-2">
                    {banner.associate_item ? (
                      // Parse the stringified JSON into an array
                      JSON.parse(banner.associate_item).map((item, idx) => (
                        <div
                          key={idx}
                          className="border border-gray-300 p-2 rounded-md shadow-md flexbox flex-col items-center"
                        >
                          <img
                            src={item.image } // Directly load the image from the URL
                            alt={item.name}
                            className="w-12 h-12 rounded-full object-cover mb-2"
                          />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                      ))
                    ) : (
                      <div>No associated items</div>
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flexbox items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={banner.isActive === true} // Check if active status is true
                        onChange={() => onToggleStatus(banner.id, banner.isActive)}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 rounded-full transition-colors duration-300 ease-in-out ${banner.isActive ? 'bg-green-500' : 'bg-gray-200'}`}>
                        <span
                          className={`${
                            banner.isActive ? "translate-x-4" : "translate-x-0"
                          } inline-block w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out`}/>
                      </div>
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {popupMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg">
          <p>{popupMessage}</p>
        </div>
      )}
    </div>
  );
}
