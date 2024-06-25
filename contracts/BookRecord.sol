// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BookRecord {
    // Events
    event AddBook(address reader, uint256 id);
    event SetCompleted(uint256 bookId, bool completed);

    // The struct for new book
    struct Book {
        uint id;
        string title;
        uint year;
        string author;
        bool completed;
    }

    // Array of new books added by users
    Book[] private bookList;

    // Mapping of book Id to new users address adding new books under their names
    mapping (uint256 => address) bookToReader;

    function addBook(string memory title, uint256 year, string memory author, bool completed) external {
        // Define a variable for the bookId
        uint256 bookId = bookList.length;

        // Add new book to books-array
        bookList.push(Book(bookId, title, year, author, completed));

        // Map new user to new book added
        bookToReader[bookId] = msg.sender;

        // Emit event for adding new book
        emit AddBook(msg.sender, bookId);
    }

    function getBookList(bool completed) private view returns (Book[] memory) {
        // Create an array to save finished books
        Book[] memory temporary = new Book[](bookList.length);

        // Define a counter variable to compare bookList and temporaryBooks arrays
        uint256 counter = 0;

        // Loop through the bookList array to filter completed books
        for(uint256 i = 0; i < bookList.length; i++) {
            // Check if the user address and the Completed books matches
            if(bookToReader[i] == msg.sender && bookList[i].completed == completed) {
                temporary[counter] = bookList[i];
                counter++;
            }
        }

        // Create a new array to save the compared/matched results
        Book[] memory result = new Book[](counter);
        
        // Loop through the counter array to fetch matching results of reader and books
        for (uint256 i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    function getCompletedBooks() external view returns (Book[] memory) {
        return getBookList(true);
    }

    function getUncompletedBooks() external  view returns (Book[] memory) {
        return getBookList(false);
    }

    function setCompleted(uint256 bookId, bool completed) external {
        if (bookToReader[bookId] == msg.sender) {
            bookList[bookId].completed = completed;
        }
        emit SetCompleted(bookId, completed);
    }
}