import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import bgImage from "./bg.jpg";

function BreweryDetail() {
  const { id } = useParams();
  const [breweryDetails, setBreweryDetails] = useState({});
  const [reviews, setReviews] = useState({});
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  // Function to retrieve the username from local storage on component mount
  useEffect(() => {
    const loggedInUsername = localStorage.getItem("username");

    if (loggedInUsername) {
      setUsername(loggedInUsername);
    }
  }, []);

  useEffect(() => {
    const fetchBreweryDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/breweries/${id}`
        );
        setBreweryDetails(response.data);
        setError("");
      } catch (error) {
        console.error("Error fetching brewery details:", error);
        setError("Failed to fetch brewery details. Please try again.");
      }
    };

    const fetchAllReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/reviews/${id}`
        );
        setReviews(response.data);
        setError("");
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to fetch reviews. Please try again.");
      }
    };

    fetchBreweryDetails();
    fetchAllReviews();
  }, [id]);

  const updateReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/reviews/${id}`
      );
      setReviews(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to fetch reviews. Please try again.");
    }
  };

  //Handle logout & Home
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear the token from local storage upon logout
    localStorage.removeItem("token");
    // Redirect to the login page and prevent going back
    navigate("/", { replace: true });
  };

  const handleHome = () => {
    // Redirect to the home page
    navigate("/brewery");
  };

  return (
    <div
      className="min-h-screen relative flex justify-center items-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50">
        <div className="flex justify-between items-center p-4 text-white">
          <div>
            {username && (
              <button className="ml-4 px-4 py-2 bg-transparent rounded text-xl">
                Hello {username} !!
              </button>
            )}
          </div>
          <div>
            <button
              onClick={handleHome}
              className="px-4 py-2 bg-transparent rounded"
            >
              Home
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-transparent rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-5xl w-full space-y-8 p-6 rounded-lg bg-white bg-opacity-40 backdrop-filter backdrop-blur-md relative z-10">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Brewery Details
        </h2>
        {error && (
          <div className="text-red-700 text-sm mb-4 text-center">{error}</div>
        )}
        <div className="mt-8">
          <div className="bg-gray-100 rounded-md p-4">
            <h3 className="font-bold text-lg truncate mb-1">
              {breweryDetails.name || "NA"}
            </h3>
            <p className="text-xs mb-1">
              Address: {breweryDetails.street || "NA"},{" "}
              {breweryDetails.city || "NA"}, {breweryDetails.state || "NA"},{" "}
              {breweryDetails.postal_code || "NA"}
            </p>
            <p className="text-xs mb-1">
              Phone: {breweryDetails.phone || "NA"}
            </p>
            <p className="text-xs mb-1">
              Website:{" "}
              <a href={breweryDetails.website_url || "#"}>
                {breweryDetails.website_url || "NA"}
              </a>
            </p>
            <p className="text-xs mb-1">
              City: {breweryDetails.city || "NA"} <br />
            </p>
            <p className="text-xs mb-4">
              State: {breweryDetails.state_province || "NA"}
            </p>
            {/* Display reviews */}
            <div className="mt-4">
              <h4 className="text-sm font-bold mb-2">Reviews</h4>

              <div
                className="mt-4 border-b border-gray-300 pb-4"
                style={{ maxHeight: "200px", overflowY: "auto" }}
              >
                {Array.isArray(reviews) && reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="mt-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? "text-yellow-300"
                                : "text-gray-300"
                            }`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        ))}
                        {/* Display username near the rating */}
                        <span className="ml-2 text-xs text-gray-500">
                          by {review.username}
                        </span>
                      </div>
                      <p className="text-sm mt-2">{review.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm mt-4 text-gray-500">
                    No Reviews Yet. Be the First to Share Your Experience!
                  </p>
                )}
              </div>

              <ReviewForm
                breweryId={id}
                username={username}
                updateReviews={updateReviews}
              />
            </div>
          </div>
        </div>
      </div>
      <p className="absolute bottom-0 left-0 right-0 text-center text-white font-semibold text-xs p-2 bg-black bg-opacity-75">
        &copy;2023 Debasish Vishal. All rights reserved.
      </p>
    </div>
  );
}

export default BreweryDetail;
