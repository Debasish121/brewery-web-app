const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB setup
// Connect to MongoDB database
mongoose
  .connect(
    "mongodb+srv://brewery:fSQFRjdHGwjW2VPz@cluster0.ubxafho.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Mongoose model for users
const userSchema = new mongoose.Schema({
  username: String,
  password: String, // Password should be hashed
});

const User = mongoose.model("User", userSchema);

// Create a route to fetch user details by user ID
app.get("/api/users/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Send user details in the response
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details" });
  }
});

// Signup Route
// app.post("/auth/signup", async (req, res) => {
//   const { username, password } = req.body;

//   // Hash the password before saving it to the database
//   const hashedPassword = await bcrypt.hash(password, 10);

//   try {
//     // Save the user data to the database, including the hashed password
//     const user = new User({
//       username,
//       password: hashedPassword,
//     });

//     await user.save();
//     res.status(201).json({ message: "User created successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating user" });
//   }
// });

app.post("/auth/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists in the database
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ error: "Username already taken" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user data to the database, including the hashed password
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Error creating user" });
  }
});

// Login Route
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  // Fetch user data from the database based on username
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Compare the provided password with the hashed password stored in the database
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Create a JWT token
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    "your_secret_key",
    {
      expiresIn: "1h", // Token expiration time
    }
  );

  // Send the token to the client
  res.status(200).json({ token });
});

// Mongoose model for reviews
const reviewSchema = new mongoose.Schema({
  breweryId: String,
  username: String,
  rating: Number,
  description: String,
});

const Review = mongoose.model("Review", reviewSchema);

// API route to get details of a specific brewery by ID
app.get("/api/breweries/:id", async (req, res) => {
  const breweryId = req.params.id;
  const apiUrl = `https://api.openbrewerydb.org/breweries/${breweryId}`;

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching brewery details" });
  }
});

// API route to handle adding reviews for a brewery
app.post("/api/reviews", async (req, res) => {
  const { breweryId, username, rating, description } = req.body;

  try {
    const newReview = new Review({
      breweryId,
      username,
      rating,
      description,
    });

    await newReview.save();
    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding review" });
  }
});

// Endpoint to retrieve reviews for a specific brewery
app.get("/api/reviews/:breweryId", async (req, res) => {
  const breweryId = req.params.breweryId;

  try {
    // Assuming 'Review' is your Mongoose model for reviews
    const reviews = await Review.find({ breweryId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// Endpoint to retrieve all reviews
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().populate("userId", "username");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// Search breweries by city, name, and type
app.get("/api/breweries", async (req, res) => {
  const { by_city, by_name, by_type } = req.query;
  let apiUrl = "https://api.openbrewerydb.org/breweries?";

  if (by_city) {
    apiUrl += `by_city=${by_city}`;
  }

  if (by_name) {
    apiUrl += `${by_city || by_type ? "&" : ""}by_name=${by_name}`;
  }

  if (by_type) {
    apiUrl += `${by_city || by_name ? "&" : ""}by_type=${by_type}`;
  }

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching breweries" });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is Running`);
});
