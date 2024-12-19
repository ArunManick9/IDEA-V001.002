import React from "react";

const ThankYouScreen = () => {
	return (
		<div className="flexbox flex-col items-center justify-center h-screen bg-gray-50 thank-you-screen">
			<h1 className="text-3xl font-bold fg-rich-black mb-4 header">
				Thank You!
			</h1>
			<div className="statement-container">
				<p className="statement text-lg mb-6">
					Your order has been placed successfully.
				</p>
				<p className="statement mb-8">
					To order again, please scan the QR code displayed on your table.
				</p>
			</div>
			<button
				className="neu-button neu-button--submit"
				onClick={() => {
					window.location.reload(); // Reloads to clear any state or restart the app
				}}
			>
				Reload
			</button>
		</div>
	);
};

export default ThankYouScreen;
