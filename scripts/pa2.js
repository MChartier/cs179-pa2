// globals ----------------

// only show favorited books?
favoritesSelected = false;

// ------------------------

function clearBookForm() {
  $("#bookform").children("input").val("");
}

function getBook(bookId) {
  return $("#book" + bookId);
}

function getComments(bookId) {
  return $("#comments" + bookId);
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
    loadBooks();

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
    //loadBooks();
    getBook(bookId).remove();
    $("#selections").listview("refresh");
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
// function toggleComments(bookId)
// {
//   var comments = $("#book" + bookId).children(".comments");
//   comments.slideToggle("fast");
// }

function isFavorite(bookId)
{
  return localStorage.getItem(bookId);
}

function toggleFavorite(bookId)
{
  var bookDiv = getBook(bookId);

  if(isFavorite(bookId)) {
    localStorage.removeItem(bookId);
    bookDiv.attr("data-favorite", "false");
    bookDiv.attr("data-theme", "c");
  }
  else {
    localStorage.setItem(bookId, "true");
    bookDiv.attr("data-favorite", "true");
    bookDiv.attr("data-theme", "e");
  }
}

// asynchronously load books from the database
// and display them on the page
function loadBooks()
{
  $(".commentslist").remove();
  $('[data-role=page]').not("#main").remove();
  $('[data-type=search]').val("");

  $("#selections").empty();

  var data = {
    opcode: 1
  };

  var temp = $("<div/>");

  $.ajax({
    url: "handler.php",
    type: "POST",
    data: data
  }).done(function(msg) {
    $(".book").remove();

    var books = JSON.parse(msg);

    for(i in books) {
      loadBook(books[i].uid, 
	       books[i].title, 
	       books[i].author, 
	       books[i].image_url);
    }
    
    $("#selections").listview('refresh');

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
    class: "book",
    "data-theme": "c"
  }).appendTo('#selections');

  if(isFavorite(bookId))
    book.attr("data-theme", "e");

  if(!isFavorite(bookId) && favoritesSelected)
    book.hide();

  // book info div containing title, author, cover, comments toggle, remover
  var bookInfo = $('<a/>', {
    class: "bookinfo"
  }).appendTo(book);

  $("<a/>").appendTo(book).click(function() {
    toggleFavorite(bookId);
    loadBooks();
  });

  // book cover div
  var cover = $('<div/>', {
    class: "bookcover",
  }).appendTo(bookInfo);

  var defaultImage = $('<img/>', {
    src: "http://lib.mnsu.edu/collections/newarrivals/BookCoverGeneric.png",
    width: 60,
    alt: bookTitle
  });

  defaultImage.appendTo(cover)

  var coverImage = $('<img/>', {
    src: bookCover
  }).load(function() {
    defaultImage.attr('src', bookCover);
  });

  // title and author
  var bookHeader = $('<h3/>', {
    class: "bookheader"
  }).appendTo(bookInfo);

  $('<div/>', {
    class: "booktitle",
    html: "",
    text: bookTitle + " "
  }).appendTo(bookHeader);

  if(bookAuthor != "")
    var authorString = "by " + bookAuthor;
  else
    authorString = bookAuthor;

  $('<div/>', {
    class: "bookauthor",
    html: "",
    text: authorString
  }).appendTo(bookHeader);

  var commentsBubble = $("<span/>", {
    id: "bubble" + bookId,
    class: "ui-li-count",
    html: "loading comments..."
  }).appendTo(book);

  var commentsList = $("<ul/>", {
    id: "comments" + bookId,
    class: "commentslist",
    "data-role": "listview"
    }).appendTo(book);

  $("#selections").listview("refresh");

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
    var bookDiv = getBook(bookId);
    var commentsList = getComments(bookId);

    // remove all old comments and set up initial listview
    commentsList.empty();

    var deleteItem = $("<button/>", {
      html: "Delete this Book"
    });

    deleteItem.click(function() {
      $.mobile.changePage("#main");
      removeBook(bookId);
    });

    deleteItem.appendTo(commentsList);
    deleteItem.button();

    // place each comment on page
    for(i in comments) {
      var commentId = comments[i].uid;

      var commentText = comments[i].comment;

      var commentItem = $("<li/>", {
      	class: "comment"
      }).appendTo(commentsList);

      commentItem.css("overflow", "auto");

      // var deleteElement = $("<div/>", {
      // 	class: "commentdeleter",
      // 	"data-id": commentId,
      // 	"data-bookId": comments[i].book_uid
      // }).appendTo(commentItem);

      // $("<img/>", {
      // 	src: "images/x.png",
      // 	width: "20px"
      // }).appendTo(deleteElement);

      // deleteElement.click(function() {
      // 	removeComment((this).getAttribute("data-bookId"), (this).getAttribute("data-id"));
      // });

      // deleteElement.css("float", "right");

      var commentElement = $("<span/>", {
        class: "comment",
      	html: "",
        text: commentText
      }).appendTo(commentItem);
    } 

    if(comments.length == 0) {
      $("<li/>", {
	html: "No comments yet!"
      }).appendTo(commentsList);
    }

    var commentForm = $("<li/>", {
      id: "commentform" + bookId,
      "data-role": "fieldcontain"
    }).appendTo(commentsList);

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
      if(commentTextArea.val() == "")
	commentTextArea.css("border", "2px red solid");
      else {
	commentTextArea.css("border", "");
	addComment(bookId);
      }
    });

    commentsubmit.button();

    // update toggle for these comments
    if(comments.length == 1)
      var bubbleString = comments.length + " comment";
    else
      var bubbleString = comments.length + " comments";

    bookDiv.find("#bubble" + bookId).html(bubbleString);

    commentsList.listview("refresh");
  });
}

function filterBooks(onlyFavorites) {
  // if(onlyFavorites) {
  //   $('[data-favorite=false]').hide();
  // }
  // else {
  //   $('[data-favorite=false]').show();
  // }

  favoritesSelected = onlyFavorites;
  loadBooks(onlyFavorites);
}

// execute when document is ready
//$(document).ready(function() {
$('#main').live('pagecreate',function(event){

  $("input#bookformsubmit").click(function(event) {
    event.preventDefault();

    var titleInput = $("input#bookformtitle");
    var authorInput = $("input#bookformauthor");

    if(titleInput.val() != "" && authorInput.val() != "") {
      addBook();
      titleInput.css("border","");
      authorInput.css("border","");
    }
    else {
      if(titleInput.val() == "")
	titleInput.css("border", "2px solid red"); 
      else
	titleInput.css("border", ""); 
      if(authorInput.val() == "")
	authorInput.css("border", "2px solid red");
      else
	authorInput.css("border", ""); 
    }
  });

  $("#alltab").click(function(event) {
    event.preventDefault();
    filterBooks(false);
  });

  $("#favoritestab").click(function(event) {
    event.preventDefault();
    filterBooks(true);
  });

  loadBooks();
});