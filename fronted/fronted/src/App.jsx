import { useEffect, useState } from "react";

import BookList from "./components/BookList";
import BookForm from "./components/BookForm";

export default function App() {

    const [books, setBooks] = useState([]);


    // Get books from backend
    useEffect(() => {

        fetch("http://localhost:8080/books")

            .then(response => response.json())

            .then(data => {
                setBooks(data);
            })

            .catch(error => {
                console.log(error);
            });

    }, []);

const handleBookDeleted = (id) => {
    setBooks((oldBooks) =>
        oldBooks.filter((book) => book._id !== id)
    );
};


    // Add new book to the screen
    const handleBookAdded = (newBook) => {

        setBooks([...books, newBook]);

    };


    return (
        <div>
            

            <h1>Book Manager</h1>

            <BookForm onBookAdded={handleBookAdded} />
              <BookList
                books={books}
                 onBookDeleted={handleBookDeleted}
             />

        </div>
    );
}