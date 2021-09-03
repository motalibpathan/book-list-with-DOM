//Get the UI elements
let form = document.querySelector("#book-form");
let bookList = document.querySelector("#book-list");
//Book class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
// UI class
class UI {
  static addToBookList(book, sn) {
    let list = document.querySelector("#book-list");
    let row = document.createElement("tr");
    row.innerHTML = `
    <td>${sn}</td>
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><button class="btn btn-danger btn-sm">Remove</button></td>
    `;
    list.appendChild(row);
  }
  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  static showAlert(message, className) {
    let div = document.createElement("div");
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    document.querySelector(".alert-area").appendChild(div);

    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 2000);
  }

  static deleteFromBook(target) {
    if (target.innerText === "Remove") {
      // target.parentElement.parentElement.remove();
      Store.removeBook(
        target.parentElement.previousElementSibling.textContent.trim()
      );

      UI.updateBookToList();

      UI.showAlert("Book Removed", "alert-success");
    }
  }
  static updateBookToList() {
    bookList.innerHTML = "";
    let books = Store.getBooks();
    books.forEach((book, index) => {
      UI.addToBookList(book, index + 1);
    });
  }
}

// Local Storage Class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    let books = Store.getBooks();
    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    let books = this.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Add event listener
form.addEventListener("submit", newBook);
bookList.addEventListener("click", removeBook);
document.addEventListener("DOMContentLoaded", UI.updateBookToList());

// Define function

function newBook(e) {
  let title = document.querySelector("#title").value,
    author = document.querySelector("#author").value,
    isbn = document.querySelector("#isbn").value;

  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill all the fields", "alert-danger");
  } else {
    let book = new Book(title, author, isbn);

    Store.addBook(book);

    UI.updateBookToList();

    UI.clearFields();

    UI.showAlert("Book Added!", "alert-success");

    e.preventDefault();
  }
  e.preventDefault();
}

function removeBook(e) {
  UI.deleteFromBook(e.target);
  e.preventDefault();
}
