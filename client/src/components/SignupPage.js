import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/auth/signup", {
        username,
        password,
      });

      // Handle successful signup
      console.log("Signed up:", response.data);

      // Redirect to login page upon successful signup
      navigate("/"); // Replace '/' with the login page route
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("Username is already taken. Please try a different username.");
      } else {
        setError("Error signing up. Please try again.");
        console.error("Signup error:", error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 justify-center items-center">
      <div className="w-full max-w-xs">
        <form
          className="bg-white bg-opacity-40 backdrop-filter backdrop-blur-lg shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-bold mb-4 justify-center items-center">
            Sign Up
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Username"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password" // Change input type to 'password'
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="text-center mt-4 mb-4 text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                Login
              </Link>
            </p>
          </div>

          {error && (
            <div className="text-red-700 text-sm mb-4 mt-2 text-center">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Submit
            </button>
          </div>
        </form>
        <p className="absolute bottom-0 left-0 right-0 text-center text-white font-semibold text-xs p-2 bg-black bg-opacity-75">
          &copy;2023 Debasish Vishal. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
