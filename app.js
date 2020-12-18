class Book {
    constructor(title, author, isbn, edition){
        this.title=title;
        this.author=author;
        this.isbn=isbn;
        this.edition=edition;
    }
}

class UI {
    static displayBooks(){
        
        const books = Store.getbooks();

        books.forEach((book) => UI.addBookToList(book));

    }

    static addBookToList(book){
           const list = document.querySelector('#book-list');//I have the List, taken from the DOM, i have created a Row that has all the stuffs like title, author, isbn and edition and i have appended the row to the list.  
           const row = document.createElement('tr'); //create a table row element by inserting <tr> tag
           row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.edition}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
           `;

           list.appendChild(row);
    }

    //delete book
    static deleteBook(element){
        if(element.classList.contains('delete')){
            element.parentElement.parentElement.remove();// ek parentElement <td> ke liye lekin hamai td nahi eska bhi parentelement ko delete karna hai jo hai pura row i.e.. <tr> esliye two parentElement hai baadmai simply remove() method ko DOM se call kiya hai..
        }
    }

    //Show Alert Method (in bootstrap it is simillar to <div className="alert alert-success"> Mssg </div> and from scratch in JS we can do it by...)
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form); //insert div before the form

        // vaniah in sec
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 1000)
    }

    // values daalke add karne ke baad for se elements jane ke liye hai yeh method
    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
        document.querySelector('#edition').value = '';

    }
}

// Store class: handle Storage
class Store {
    static getbooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));//without JSON.parse it is stored as string and by running JSON.parse we can actually used it as a regular JavaScript array of objects 
        }

        return books;
    }

    static addBook(book){
        const books = Store.getbooks();
        books.push(book);
        localStoragesetItem('books', JSON.stringify(book));
    }

    static removeBook(){
        const books = Store.getbooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                book.splice(index,1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks)//call displayBooks by: event we want to listen here is DOmContentLoaded and as soon as the DOM loads then we wanna call UI.displayBooks
// Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {

    //Prevent actual Submit
    e.preventDefault();

    //Get Form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    const edition = document.querySelector('#edition').value;

    //Validate
    if(title === ''|| author === ''|| isbn === ''|| edition === ''){
        UI.showAlert('Please Enter All The Fields', 'success');
    } else {

        //Instantiate book
        const book = new Book(author, title, isbn, edition);
        console.log(book);

        // add book to UI
        UI.addBookToList(book);

        //Add book to store/localstorage
        Store.addBook(book);

        //Success Message
        UI.showAlert('Congrats you have added Books Successfully','primary');

        //clear Fields 
        UI.clearFields();
    }
})
// Event: Delete a book (yahan pe evenet propagation kiye hai where we have targeted the actual bool-list)
document.querySelector('#book-list').addEventListener('click', (e) => {
    //remove book from UI
    UI.deleteBook(e.target);

    //remove book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Success Message after deletion
    UI.showAlert(' Book Deleted Successfully','primary');
})