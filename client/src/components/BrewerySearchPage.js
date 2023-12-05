import React, { useState, useEffect } from "react";
import axios from "axios";
import bgImage from "./bg.jpg";
import { Link, useNavigate } from "react-router-dom";

function BrewerySearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSearchOption, setSelectedSearchOption] = useState("city");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [username, setUsername] = useState("");
  const resultsPerPage = 3; // Number of results per page

  useEffect(() => {
    setSelectedSearchOption("city"); // Reset selected search option to 'city' when the page reloads
  }, []);

  // Function to retrieve the username from local storage on component mount
  useEffect(() => {
    const loggedInUsername = localStorage.getItem("username");
    if (loggedInUsername) {
      setUsername(loggedInUsername);
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Field is empty"); // Set error message when the search field is empty
      setSearchResults([]);
      return;
    }

    try {
      let apiUrl = `http://localhost:3001/api/breweries?`;

      if (searchQuery) {
        apiUrl += `by_${selectedSearchOption}=${searchQuery}`;
      }

      const response = await axios.get(apiUrl);
      setSearchResults(response.data);
      setCurrentPage(1); // Reset current page to 1 after new search
      setError(""); // Clear the error if the search is successful

      if (response.data.length === 0) {
        setError(`Data not found. Please type again`);
        setSearchResults([]);
      }

      console.log("API called successfully:", response.data);
    } catch (error) {
      console.error("Error fetching breweries:", error);
      setError(`Invalid ${selectedSearchOption}. Please enter again`);
      setSearchResults([]);
      console.error(
        `Invalid ${selectedSearchOption}. Please enter again`,
        error
      );
    }
  };

  //Handle logout & Home
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from local storage upon logout
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    // Redirect to the login page and prevent going back
    navigate("/", { replace: true });
  };

  const handleHome = () => {
    setSearchQuery("");
    setSearchResults([]);

    // Redirect to the home page
    navigate("/brewery");
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setError(""); // Clear the error when there is input in the search field
  };

  // pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

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
      <div className="absolute inset-0 bg-black opacity-60">
        <div className="flex justify-between items-center p-4 text-white">
          <div>
            {username && (
              <button className="ml-4 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                Hello {username}!!
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
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Brewery Search
          </h2>
          <p className="mt-2 text-center text-sm text-gray-700">
            Navigate Breweries: Explore by City, Name, and Type - Your Way, Your
            Taste!
          </p>
        </div>
        <div className="mt-8">
          <div className="search-container">
            <div className="flex items-center border-b border-gray-200">
              <select
                value={selectedSearchOption}
                onChange={(e) => setSelectedSearchOption(e.target.value)}
                className="bg-white border border-gray-300 rounded px-3 py-1 mr-3 focus:outline-none focus:border-indigo-500"
              >
                <option value="city" className="text-gray-800">
                  Search by city
                </option>
                <option value="name" className="text-gray-800">
                  Search by name
                </option>
                <option value="type" className="text-gray-800">
                  Search by type
                </option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder={`Search by ${selectedSearchOption}...`}
                className="appearance-none bg-transparent border-none w-full text-gray-900 mr-3 py-1 px-2 leading-tight focus:outline-none placeholder-gray-700"
                style={{ "::placeholder": { color: "darkgray" } }}
              />
              <button
                onClick={handleSearch}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Search
              </button>
            </div>
            {error && (
              <div className="text-red-700 text-sm mb-4 text-center">
                {error}
              </div>
            )}
          </div>
          <div className="search-results mt-4 grid grid-cols-1 gap-4">
            {currentResults.map((brewery, index) => (
              <Link to={`/brewery/${brewery.id}`} key={brewery.id}>
                <div className="bg-gray-100 rounded-md p-4">
                  <h3 className="font-bold text-sm truncate">
                    {(currentPage - 1) * resultsPerPage + index + 1}.{" "}
                    {brewery.name}
                  </h3>
                  <p className="text-xs truncate">
                    Address: {brewery.street || "NA"}, {brewery.city || "NA"},{" "}
                    {brewery.state || "NA"}, {brewery.postal_code || "NA"}
                  </p>
                  <p className="text-xs truncate">
                    Phone: {brewery.phone || "NA"}
                  </p>
                  <p className="text-xs truncate">
                    Website:{" "}
                    <a href={brewery.website_url}>
                      {brewery.website_url || "NA"}
                    </a>
                  </p>
                  <p className="text-xs truncate">
                    City: {brewery.city || "NA"} <br />
                  </p>
                  <p className="text-xs truncate">
                    State: {brewery.state_province || "NA"}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`border rounded-md px-3 py-1 ${
                    currentPage === index + 1
                      ? "bg-gray-500 text-white"
                      : "bg-white text-gray-500"
                  }`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="absolute bottom-0 left-0 right-0 text-center text-white font-semibold text-xs p-2 bg-black bg-opacity-75">
        &copy;2023 Debasish Vishal. All rights reserved.
      </p>
    </div>
  );
}

export default BrewerySearchPage;
