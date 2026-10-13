
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Book = require("./models/Book.js");
const User = require("./models/User.js");

require("dotenv").config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });


// Port
const port = 8080;


// Home route
app.get("/", (req, res) => {
    res.send("Book Manager API is running");
});
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
};


// ==========================
// BOOK ROUTES
// ==========================

// GET all books
app.get("/books", async (req, res) => {

    try {

        const books = await Book.find();

        res.json(books);

    } catch (err) {

        res.status(500).json({
            error: "Failed to fetch books"
        });

    }

});


// POST new book
app.post("/books", async (req, res) => {

    try {

        const { title, author, year } = req.body;

        const newBook = new Book({
            title: title,
            author: author,
            year: year
        });

        await newBook.save();

        res.status(201).json({
            message: "Book added successfully!",
            book: newBook
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Failed to save the book"
        });

    }

});


// DELETE book
app.delete("/books/:id", async (req, res) => {

    try {

        const { id } = req.params;

        await Book.findByIdAndDelete(id);

        res.json({
            message: "Book deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Failed to delete book"
        });

    }

});


// // ==========================
// // AUTH ROUTES
// // ==========================

// // SIGNUP
// app.post("/signup", async (req, res) => {

//     try {

//         const { username, email, password } = req.body;

//         // Check existing user
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {

//             return res.status(400).json({
//                 message: "User already exists"
//             });

//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create user
//         const newUser = new User({
//             username: username,
//             email: email,
//             password: hashedPassword
//         });

//         await newUser.save();

//         res.status(201).json({
//             message: "Signup successful"
//         });

//     } catch (error) {

//         console.log(error);

//         res.status(500).json({
//             message: "Signup failed"
//         });

//     }

// });


// // LOGIN
// app.post("/login", async (req, res) => {
//     console.log("LOGIN ROUTE HIT");
//     try {
//         const { email, password } = req.body;

//         // Find user
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found"
//             });
//         }

//         // Compare password
//         const passwordMatch = await bcrypt.compare(
//             password,
//             user.password
//         );

//         if (!passwordMatch) {
//             return res.status(401).json({
//                 message: "Invalid password"
//             });
//         }

//         // Create JWT
//         const token = jwt.sign(
//             {
//                 userId: user._id,
//                 email: user.email
//             },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: "1h"
//             }
//         );

//         res.json({
//             message: "Login successful",
//             token: token
//         });

//     } catch (error) {
//         console.log(error);

//         res.status(500).json({
//             message: "Login failed"
//         });
//     }
// });
// app.get("/test", (req, res) => {
//     res.json({
//         message: "Backend is working"
//     });
// });

app.listen(port, () => { console.log(`Port listening at ${port}`); });

