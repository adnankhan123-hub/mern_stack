import "../styles/BookForm.css";
import { useState } from "react";

export default function BookForm({ onBookAdded }) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [year, setYear] = useState("");

    const addBook = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    author: author,
                    year: Number(year)
                })
            });

            const data = await response.json();
            console.log(data);

            // Backend sends { message, book } -> pass data.book to parent
            if (onBookAdded && data.book) {
                onBookAdded(data.book);
            }

            // Clear form inputs
            setTitle("");
            setAuthor("");
            setYear("");

        } catch (error) {
            console.log("Error adding book:", error);
        }
    };

    return (
        <form onSubmit={addBook}>
            <input
                type="text"
                placeholder="Book title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
            />

            <input
                type="number"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
            />

            <button type="submit">
                Add Book
            </button>
        </form>
    );
}