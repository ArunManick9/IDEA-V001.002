import React, { useState, useEffect } from "react";
import { editmenulist } from "../../services/supported_api";

const CategoryList = ({ data, menus, selectedMenu, loc_id }) => {
	const [categories, setCategories] = useState(data.categories || []);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [showAddModal, setShowAddModal] = useState(false);
	const [showSaveButton, setShowSaveButton] = useState(false);

	// Update categories when data prop changes
	useEffect(() => {
		setCategories(data.categories || []);
	}, [data]);

	// Track changes to categories to determine if save button should be shown
	useEffect(() => {
		if (JSON.stringify(categories) !== JSON.stringify(data.categories)) {
			setShowSaveButton(true);
		} else {
			setShowSaveButton(false);
		}
	}, [categories, data.categories]);

	const handleAddCategory = () => {
		setShowAddModal(true);
	};

	const handleAddCategoryConfirm = () => {
		if (newCategoryName) {
			const newCategory = {
				category_id: `CAT${categories.length + 1}`, // Generate new category ID
				category_name: newCategoryName,
			};
			setCategories([...categories, newCategory]);
			setNewCategoryName("");
		}
		setShowAddModal(false);
	};

	const handleDeleteCategory = (index) => {
		const updatedCategories = categories.filter((_, i) => i !== index);
		setCategories(updatedCategories);
	};

	const handleSaveCategories = () => {
		// Find the index of the menu to update
		const updatedMenus = menus.map((menu) => {
			if (menu.menu_type === selectedMenu) {
				return {
					...menu,
					categories: categories, // Update the categories for the selected menu
				};
			}
			return menu; // Return unmodified menu
		});

		console.log("Updated menus:", updatedMenus);

		// Implement save logic here, e.g., making an API call to save the updatedMenus
		editmenulist(JSON.stringify(updatedMenus), loc_id)
			.then(() => {
				console.log("Categories saved successfully.");
			})
			.catch((error) => {
				console.error("Error saving categories:", error);
			});

		// Optionally, you can reset showSaveButton to false if you want to hide the button after saving
		setShowSaveButton(false);
	};

	return (
		<div className="p-4 bg-white shadow-lg rounded-lg">
			<h2 className="text-xl font-light mb-4">Categories</h2>
			<ul className="mb-4">
				{categories.map((category, index) => (
					<li
						key={category.category_id} // Use category_id as key
						className="p-2 bg-gray-100 rounded-lg mb-2 flex justify-between items-center"
					>
						<span>{category.category_name}</span>
						<button
							className="text-red-500 hover:text-red-700"
							onClick={() => handleDeleteCategory(index)}
						>
							&#10005; {/* Cross icon for delete */}
						</button>
					</li>
				))}
			</ul>
			<button
				className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition mb-4"
				onClick={handleAddCategory}
			>
				Add Category
			</button>

			{showAddModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h2 className="text-lg font-bold mb-4">Add a New Category</h2>
						<input
							type="text"
							className="w-full p-2 border border-gray-300 rounded-lg mb-4"
							placeholder="Enter category name"
							value={newCategoryName}
							onChange={(e) => setNewCategoryName(e.target.value)}
						/>
						<div className="flex justify-end space-x-4">
							<button
								className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
								onClick={() => setShowAddModal(false)}
							>
								Cancel
							</button>
							<button
								className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
								onClick={handleAddCategoryConfirm}
							>
								Add Category
							</button>
						</div>
					</div>
				</div>
			)}

			{showSaveButton && (
				<button
					className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition w-full"
					onClick={handleSaveCategories}
				>
					Save Categories
				</button>
			)}
		</div>
	);
};

export default CategoryList;
