import React, { useState, useEffect } from "react";
import {
	addmenuitem,
	getdetailedmenu,
	loadlocation,
} from "../services/supported_api";
import { useParams } from "react-router-dom";
import "../scss/AddItem.scss";

const AddItemForm = () => {
	const [data, setData] = useState(null);
	const [menus, setMenus] = useState([]);
	const [form, setForm] = useState({
		menu_id: "",
		image: "",
		name: "",
		description: "",
		ingredients: "",
		price: "",
		veg_or_nonveg: "Veg",
		inmenu: "",
		incategory: "",
		inlocation: "",
	});
	const [availableCategories, setAvailableCategories] = useState([]);
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState("");
	const [submissionCount, setSubmissionCount] = useState(0);
	const { loc_id } = useParams();

	useEffect(
		() => {
			const fetchData = async () => {
				try {
					const result = await loadlocation(loc_id);
					const neededData = result[0];
					setData(neededData);
					const menulist = await getdetailedmenu(loc_id);
					setSubmissionCount(menulist.length);

					const parsedMenus =
						typeof neededData.menus === "string"
							? JSON.parse(neededData.menus)
							: neededData.menus;
					setMenus(parsedMenus);
					setForm((prevForm) => ({
						...prevForm,
						inmenu: parsedMenus[0]?.menu_type || "",
						inlocation: neededData.loc_id,
					}));
					console.log(result);
				} catch (error) {
					console.error("Error loading location:", error);
				}
			};

			fetchData();
		},
		[loc_id],
		submissionCount
	);

	useEffect(() => {
		if (menus.length > 0 && form.inmenu) {
			const selectedMenu = menus.find((menu) => menu.menu_type === form.inmenu);
			if (selectedMenu) {
				setAvailableCategories(selectedMenu.categories);
				setForm((prevForm) => ({
					...prevForm,
					incategory: selectedMenu.categories[0]?.category_name || "",
				}));
			}
		}
	}, [form.inmenu, menus]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result.split(",")[1]);
			reader.onerror = (error) => reject(error);
		});
	};

	const uploadImageToImgbb = async (base64Image) => {
		const formData = new FormData();
		formData.append("image", base64Image);
		formData.append("expiration", "0");

		const response = await fetch(
			"https://api.imgbb.com/1/upload?key=eba7a098c00b0b6007f4820231498515",
			{
				method: "POST",
				body: formData,
			}
		);

		const data = await response.json();
		return data.data.url;
	};

	const generateMenuId = () => {
		const locationId = form.inlocation;
		const menuType = form.inmenu.substring(0, 3).toUpperCase();
		const categoryName = form.incategory.substring(0, 3).toUpperCase();
		let alphaSequence = Math.floor(submissionCount / 1000);
		let numericSequence = (submissionCount % 1000) + 1;
		let alpha = String.fromCharCode(65 + alphaSequence);
		let numeric = numericSequence.toString().padStart(3, "0");

		return `${locationId}_${menuType}${categoryName}${alpha}${numeric}`;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		let imageUrl = form.image;

		if (imageFile) {
			const base64Image = await getBase64(imageFile);
			imageUrl = await uploadImageToImgbb(base64Image);
		}

		const updatedForm = { ...form, image: imageUrl, menu_id: generateMenuId() };
		console.log("Form submitted:", updatedForm);

		addmenuitem(updatedForm);
		setSubmissionCount(submissionCount + 1);
	};

	if (!data || menus.length === 0) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex justify-center items-start min-h-screen bg-gray-100">
			<div className="container mx-auto max-w-4xl px-4 py-6">
				<h1 className="text-2xl font-semibold text-gray-800 text-center mb-8">
					Add Your Menus
				</h1>
				<div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto overflow-y-auto max-h-[80vh] custom-scrollbar">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Upload Image
							</label>
							<input
								type="file"
								name="image"
								accept="image/*"
								onChange={handleImageChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg"
							/>
						</div>

						{imagePreview && (
							<div className="mt-4">
								<img
									src={imagePreview}
									alt="Selected item"
									className="w-full h-64 object-scale-down rounded-lg"
								/>
							</div>
						)}

						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Name
							</label>
							<input
								type="text"
								name="name"
								value={form.name}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg"
							/>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Description
							</label>
							<textarea
								name="description"
								value={form.description}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg"
							/>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Ingredients
							</label>
							<input
								type="text"
								name="ingredients"
								value={form.ingredients}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg"
							/>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Price
							</label>
							<input
								type="number"
								name="price"
								value={form.price}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg"
							/>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Vegetarian or Non-Vegetarian
							</label>
							<select
								name="veg_or_nonveg"
								value={form.veg_or_nonveg}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg"
							>
								<option value="Veg">Veg</option>
								<option value="Non-Veg">Non-Veg</option>
							</select>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Menu
							</label>
							<select
								name="inmenu"
								value={form.inmenu}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg"
							>
								{menus.map((menu, index) => (
									<option key={index} value={menu.menu_type}>
										{menu.menu_type}
									</option>
								))}
							</select>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Category
							</label>
							<select
								name="incategory"
								value={form.incategory}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg"
							>
								{availableCategories.map((category, index) => (
									<option key={index} value={category.category_name}>
										{category.category_name}
									</option>
								))}
							</select>
						</div>

						<button
							type="submit"
							className="w-full bg-purple-600 text-white py-2 rounded-lg shadow-lg hover:bg-purple-500 transition duration-300"
						>
							Add Item
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddItemForm;
