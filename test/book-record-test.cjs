const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BookRecord", function () {
  let BookRecord, bookRecord, owner, addr1;

  beforeEach(async function () {
    BookRecord = await ethers.getContractFactory("BookRecord");
    [owner, addr1] = await ethers.getSigners();
    bookRecord = await BookRecord.deploy();
    await bookRecord.waitForDeployment();
  });

  describe("Add Book", function () {
    it("should add a new book and emit and AddBook event", async function () {
      await expect(
        bookRecord.addBook(
          "The Great Gatsby",
          1925,
          "F. Scott Fitzgerald",
          false
        )
      )
        .to.emit(bookRecord, "AddBook")
        .withArgs(owner.getAddress(), 0);

      const books = await bookRecord.getUncompletedBooks();
      expect(books.length).to.equal(1);
      expect(books[0].title).to.equal("The Great Gatsby");
    });
  });

  describe("Set Completed", function () {
    it("should mark a book as completed and emit a SetCompleted event", async function () {
      await bookRecord.addBook("1984", 1949, "George Orwell", false);

      await expect(bookRecord.setCompleted(0, true))
        .to.emit(bookRecord, "SetCompleted")
        .withArgs(0, true);

      const completedBooks = await bookRecord.getCompletedBooks();
      expect(completedBooks.length).to.equal(1);
      expect(completedBooks[0].completed).to.be.true;
    });
  });

  describe("Get Book Lists", function () {
    it("should return the correct list of completed and uncompleted books", async function () {
      await bookRecord.addBook("Book 1", 2000, "Author 1", false);
      await bookRecord.addBook("Book 2", 2001, "Author 2", true);

      const uncompletedBooks = await bookRecord.getUncompletedBooks();
      const completedBooks = await bookRecord.getCompletedBooks();

      expect(uncompletedBooks.length).to.equal(1);
      expect(uncompletedBooks[0].title).to.equal("Book 1");

      expect(completedBooks.length).to.equal(1);
      expect(completedBooks[0].title).to.equal("Book 2");
    });

    it("should only return books added by the caller", async function () {
      await bookRecord.addBook("Owner's Book", 2002, "Owner Author", false);
      await bookRecord
        .connect(addr1)
        .addBook("Addr1's Book", 2003, "Addr1 Author", true);

      const ownerBooks = await bookRecord.getUncompletedBooks();
      const addr1Books = await bookRecord.connect(addr1).getCompletedBooks();

      expect(ownerBooks.length).to.equal(1);
      expect(ownerBooks[0].title).to.equal("Owner's Book");

      expect(addr1Books.length).to.equal(1);
      expect(addr1Books[0].title).to.equal("Addr1's Book");
    });
  });
});
