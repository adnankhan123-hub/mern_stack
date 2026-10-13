import "../styles/BookList.css";
export default function BookList({ books, onBookDeleted }) {

    const deleteBook = async (id) => {

        try {

            const response = await fetch(
                `http://localhost:8080/books/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            console.log(data);

            onBookDeleted(id);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="books-container">

            {books.map((book) => (

                <div className="book-card" key={book._id}>

                    <h2>{book.title}</h2>

                    <p>
                        <strong>Author:</strong> {book.author}
                    </p>

                    <p>
                        <strong>Year:</strong> {book.year}
                    </p>

                    <button onClick={() => deleteBook(book._id)}>
                        Delete
                    </button>

                </div>

            ))}

        </div>
    );
}