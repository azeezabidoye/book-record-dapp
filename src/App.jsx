import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import "./App.css";
import BookRecordAbi from "./artifacts/contracts/BookRecord.sol/BookRecord.json"; // Import the ABI of the contract

const BookRecordAddress = "0x01615160e8f6e362B5a3a9bC22670a3aa59C2421"; // Replace with your contract address

const BookRecord = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [author, setAuthor] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await web3Provider.getSigner();
        const contract = new ethers.Contract(
          BookRecordAddress,
          BookRecordAbi.abi,
          signer
        );

        setProvider(web3Provider);
        setSigner(signer);
        setContract(contract);
      }
    };

    init();
  }, []);

  const fetchBooks = async () => {
    try {
      const completedBooks = await contract.getCompletedBooks();
      const uncompletedBooks = await contract.getUncompletedBooks();
      setBooks([...completedBooks, ...uncompletedBooks]);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const addBook = async () => {
    try {
      const tx = await contract.addBook(title, year, author, completed);
      await tx.wait();
      fetchBooks();
      setTitle("");
      setYear("");
      setAuthor("");
      setCompleted(false);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const markAsCompleted = async (bookId) => {
    try {
      const tx = await contract.setCompleted(bookId, true);
      await tx.wait();
      fetchBooks();
    } catch (error) {
      console.error("Error marking book as completed:", error);
    }
  };

  return (
    <div className="container">
      <h1>Book Record</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <label>
          Completed:
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
        </label>
        <button onClick={addBook}>Add Book</button>
      </div>
      <h2>Book List</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author}: {book.year.toString()}
            {book.completed ? "Completed" : "Not Completed"}
            {!book.completed && (
              <button onClick={() => markAsCompleted(book.id)}>
                Mark as Completed
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookRecord;
