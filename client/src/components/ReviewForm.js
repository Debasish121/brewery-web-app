import React, { useState } from "react";
import axios from "axios";

function ReviewForm({ breweryId, username, updateReviews }) {
  const [rating, setRating] = useState(1);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/reviews", {
        breweryId,
        username,
        rating: parseInt(rating), // Save rating as integer
        description,
      });
      updateReviews(); // Call the function to update reviews after submitting
      setRating(1); // Reset form fields after submission
      setDescription("");
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-center mb-1">
        <label htmlFor="description" className="text-sm font-semibold">
          Ratings :
        </label>
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${
              index < rating ? "text-yellow-300" : "text-gray-300"
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
            onClick={() => setRating(index + 1)}
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="description" className="text-sm font-semibold">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write your review..."
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500 h-20 resize-none"
        />
      </div>
      <button
        type="submit"
        className="bg-indigo-500 text-white font-semibold px-4 py-2 rounded-md mt-4 hover:bg-indigo-600 transition duration-300"
      >
        Submit Review
      </button>
    </form>
  );
}

export default ReviewForm;
