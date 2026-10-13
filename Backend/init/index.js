const mongoose = require("mongoose");
const Book = require("../models/Book");
const User = require("../models/User");
const { data } = require("./data");

require("dotenv").config({
    path: "../.env"
});

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
}

main()
    .then(async () => {
        console.log("Database connected");

        await Book.deleteMany({});
        console.log("Old books deleted");

        await Book.insertMany(data);
        console.log("Sample data inserted");

        await mongoose.connection.close();
        console.log("Connection closed");
    })
    .catch((err) => {
        console.log(err);
    });