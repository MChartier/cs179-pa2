// globals ----------------

// only show favorited books?
favoritesSelected = false;

// ------------------------

function clearBookForm() {
  $("#bookform").children("input").val("");
}

// asynchronously add a book to the database
// and reload books on the page
function addBook()
{
  var newTitle = $("input#bookformtitle").val();
  var newAuthor = $("input#bookformauthor").val();
  var newImage = $("input#bookformimage").val();

  var data = {
    opcode: 2,
    title: newTitle,
    author: newAuthor,
    image: newImage
  };

  // asynchronously add book to the database
  $.ajax({
    url: "handler.php",
    type: "POST",
    data: data
  }).done(function(msg) {
    var response = $.parseJSON(msg);

    // asynchronously refresh all books on page
    loadBooks(false);

    if(response.exists == "true") {
      alert("book already exists!");
    }

    clearBookForm();
  });
}

// asynchronously remove a book from the database
// and reload books on the page
function removeBook(bookId)
{
  var data = {
    opcode: 3,
    bookId: bookId
  };

  $.ajax({
    url: "handler.php",
    type: "POST",
    data: data
  }).done(function(msg) {
    loadBooks(false);
  });
}

// asynchronously add a comment about a book
// and reload comments on that book
function addComment(bookId)
{
  var commentForm = $("#commentform" + bookId).children("#textarea");
  var newComment = commentForm.val();
  var data = {
    opcode: 5,
    bookId: bookId,
    comment: newComment
  };

  // send ajax request
  $.ajax({
    url: "handler.php",
    type: "POST",
    data: data
  }).done(function(msg) {
    loadComments(bookId);
    commentForm.val("");
  });
}

// asynchronously remove a comment from the database
// and reload comments on that book
function removeComment(bookId, commentId)
{
  var data = {
    opcode: 6,
    commentId: commentId
  };

  $.ajax({
    url: "handler.php",
    type: "POST",
    data: data
  }).done(function(msg) {
    loadComments(bookId);
  });
}

// toggle whether or not comments on a
// particular book are displayed on the page
function toggleComments(bookId)
{
  var comments = $("#book" + bookId).children(".comments");
  comments.slideToggle("fast");
}

function toggleFavorite(bookId)
{
  var bookDiv = $("#book" + bookId);

  var favoriter = bookDiv.children(".bookinfo").children(".bookfavoriter");

  if(localStorage.getItem(bookId)) {
    localStorage.removeItem(bookId);
    favoriter.attr("src", "images/notfavoritestar.png");
    bookDiv.attr("data-favorite", "false");
  }
  else {
    localStorage.setItem(bookId, "true");
    favoriter.attr("src", "images/favoritestar.png");
    bookDiv.attr("data-favorite", "true");
  }

  filterBooks(favoritesSelected);
}

// asynchronously load books from the database
// and display them on the page
function loadBooks(favoritesOnly)
{
  var data = {
    opcode: 1
  };

  $.ajax({
    url: "handler.php",
    type: "POST",
    data: data
  }).done(function(msg) {
    $(".book").remove();

    var books = JSON.parse(msg);

    for(i in books) {
      if(!favoritesOnly || localStorage.getItem(books[i].uid))
	loadBook(books[i].uid, 
		 books[i].title, 
		 books[i].author, 
		 books[i].image_url);
    }

    $(".commentsubmit").click(function(event) {
      event.preventDefault();
    });
  });
}

// create an element for the book described by the
// parameters on the page
function loadBook(bookId, bookTitle, bookAuthor, bookCover) {
  
  // main book div
  var book = $('<li/>', {
    id: "book" + bookId,
    class: "book"
  }).appendTo('#selections');

  // book info div containing title, author, cover, comments toggle, remover
  var bookInfo = $('<div/>', {
    class: "bookinfo"
  }).appendTo(book);

  // book cover div
  var cover = $('<div/>', {
    class: "bookcover",
  }).appendTo(bookInfo);

  var defaultImage = $('<img/>', {
    src: "http://lib.mnsu.edu/collections/newarrivals/BookCoverGeneric.png",
    width: 100,
    alt: bookTitle
  });

  defaultImage.appendTo(cover)

  var coverImage = $('<img/>', {
    src: bookCover
  }).load(function() {
    defaultImage.attr('src', bookCover);
  });

  // book remover div (clicking removes book from database)
  var remover = $('<div/>', {
    class: "bookremover"
  }).appendTo(bookInfo);

  $("<img/>", {
    src:"images/x.png",
    width:"40px"
  }).appendTo(remover);

  remover.click(function() {
    removeBook(bookId);
  });

  // book favoriter div (clicking marks book as a favorite)
  var favoriter = $('<img/>', {
    class: "bookfavoriter",
    src:"images/notfavoritestar.png",
    width:"40px"
  }).appendTo(bookInfo);

  favoriter.click(function() {
    toggleFavorite(bookId);
  });

  if(localStorage.getItem(bookId)) {
    favoriter.attr("src", "images/favoritestar.png");
    book.attr("data-favorite", "true");
  }
  else {
    book.attr("data-favorite", "false");
  }

  // title and author
  $('<div/>', {
    class: "booktitle",
    html: "",
    text: bookTitle
  }).appendTo(bookInfo);
  $('<div/>', {
    class: "bookauthor",
    html: "",
    text: "by " + bookAuthor
  }).appendTo(bookInfo);

  // comment toggle (clicking displays or hides comments)
  var commentToggle = $('<button/>', {
    class: "commenttoggle",
    html: "Comments",
    "data-inline": "true"
  }).appendTo(book);

  commentToggle.click(function(event) {
    event.preventDefault();
    toggleComments(bookId);
  });

  commentToggle.button();

  var commentsDiv = $('<div/>', {
    class: "comments"
  }).css("display", "none").appendTo(book);

  var commentsList = $("<ul/>", {
      class: "commentslist"
    }).appendTo(commentsDiv);

  var commentForm = $("<div/>", {
    id: "commentform" + bookId,
    "data-role": "fieldcontain"
  }).appendTo(commentsDiv);

  var commentTextArea = $("<textarea/>", {
    cols: 40,
    rows: 8,
    name: "textarea",
    id: "textarea"
  }).appendTo(commentForm);

  commentTextArea.textinput();

  var commentsubmit = $("<input/>", {
     type: "submit",
     value: "save"
  }).appendTo(commentForm);

  commentsubmit.click(function(event) {
    event.preventDefault();

    addComment(bookId);
  });

  commentsubmit.button();

  // load comments asynchronously on book load
  loadComments(bookId);
}

// asynchronously load comments on a particular book
// from the database and reload comments on that book
// on the page
function loadComments(bookId)
{
  var data = {
    opcode: 4,
    bookId: bookId
  };

  $.ajax({
    url: "handler.php",
    type: "POST",
    data: data
  }).done(function(msg) {

    var comments = $.parseJSON(msg);
    var bookDiv = $("#book" + bookId);
    var commentsList = bookDiv.children(".comments").children(".commentslist")

    // remove all old comments and set up initial listview
    commentsList.children(".comment").remove();

    // place each comment on page
    for(i in comments) {
      var commentId = comments[i].uid;

      var commentText = comments[i].comment;

      var commentItem = $("<li/>", {
	class: "comment"
      }).appendTo(commentsList);

      commentItem.css("overflow", "auto");

      var deleteElement = $("<div/>", {
      	class: "commentdeleter",
      	"data-id": commentId,
      	"data-bookId": comments[i].book_uid
      }).appendTo(commentItem);

      $("<img/>", {
      	src: "images/x.png",
      	width: "20px"
      }).appendTo(deleteElement);

      deleteElement.click(function() {
      	removeComment((this).getAttribute("data-bookId"), (this).getAttribute("data-id"));
      });

      deleteElement.css("float", "right");

      var commentElement = $("<span/>", {
        class: "comment",
	html: "",
        text: commentText
      }).appendTo(commentItem);
    } 

    // update toggle for these comments
    bookDiv.find("button").html(comments.length + " comments");
    bookDiv.find("button").button("refresh");

  }).complete(function() {
  });
}

function filterBooks(onlyFavorites) {
  if(onlyFavorites)
    $("#selections").children('[data-favorite=false]').hide();
  else
    $("#selections").children(".book").show();

  favoritesSelected = onlyFavorites;
}

// execute when document is ready
$(document).ready(function() {

  $("input#bookformsubmit").click(function(event) {
    event.preventDefault();
    addBook();
  });

  $("#alltab").click(function(event) {
    event.preventDefault();
    filterBooks(false);
  });

  $("#favoritestab").click(function(event) {
    event.preventDefault();
    filterBooks(true);
  });

  $("#nopebutton").button();
  $("#surebutton").button();

  loadBooks(false);
});