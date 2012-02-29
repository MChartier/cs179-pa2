// asynchronously add a book to the database
// and reload books on the page
function addBook()
{
  
    var newTitle = $("input#bookformtitle").val();
    var newAuthor = $("input#bookformauthor").val();
    var newImage = $("input#bookformimage").val();

    var dataString = "opcode=2&title=" + newTitle + "&author=" + newAuthor + "&image=" + newImage;

    // send ajax request
    $.ajax({
        url: "handler.php",
      	type: "POST",
      	data: dataString
    }).done(function(msg) {
    	loadBooks();
    });
}

// asynchronously remove a book from the database
// and reload books on the page
function removeBook(bookId)
{
    $.ajax({
	url: "handler.php",
	type: "POST",
	data: "opcode=3&bookId=" + bookId
    }).done(function(msg) {
	    loadBooks();
    });
}

// asynchronously add a comment about a book
// and reload comments on that book
function addComment(bookId)
{
  var commentForm = $("#commentform" + bookId);
  var newText = commentForm.val();
  var dataString = "opcode=5&bookId=" + bookId + "&text=" + newText;

  // send ajax request
  $.ajax({
    url: "handler.php",
    type: "POST",
    data: dataString
  }).done(function(msg) {
    loadComments(bookId);
    commentForm.val("");
  });
}

// toggle whether or not comments on a
// particular book are displayed on the page
function toggleComments(bookId)
{
  var comments = $("#book" + bookId).children(".comments");
  if(comments.css("display") == "none")
    comments.show("fast");
  else
    comments.hide("fast");
}

// asynchronously load books from the database
// and display them on the page
function loadBooks()
{
  $.ajax({
    url: "handler.php",
    type: "POST",
    data: "opcode=1"
  }).done(function(msg) {
    $(".book").remove();

    var books = JSON.parse(msg);

    

    for(i in books) {
      loadBook(books[i].uid, 
	       books[i].title, 
	       books[i].author, 
	       books[i].image_url);
    }

    $(".booksynopsis").expander({
      slicePoint: 400,
      expandPrefix: '',
      expandText: '>>>',
      userCollapseText: '<<<'
    });

    $(".commentsubmit").click(function(event) {
      event.preventDefault();
    });
  });
}

// create an element for the book described by the
// parameters on the page
function loadBook(bookId, bookTitle, bookAuthor, bookCover) {
  
  // main book div
  var book = $('<div/>', {
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
  $('<img/>', {
    src: bookCover,
    width: 100,
    alt: bookTitle
  }).appendTo(cover);

  // book remover div (clicking removes book from database)
  var remover = $('<div/>', {
    class: "bookremover",
  }).appendTo(bookInfo);

  $("<img/>", {
    src:"images/x.png",
    width:"40px"
  }).appendTo(remover);

  remover.click(function() {
    removeBook(bookId);
  });

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
  var commentToggle = $('<div/>', {
    class: "commenttoggle",
    html: "Loading comments..."
  }).appendTo(book);

  commentToggle.click(function() {
    toggleComments(bookId);
  });

  var commentsDiv = $('<div/>', {
    class: "comments"
  }).css("display", "none").appendTo(book);

  var commentsList = $("<ul/>", {
      class: "commentslist",
      "data-role": "listview"
    }).appendTo(commentsDiv);

  var commentForm = $("<div/>", {
    class: "commentform"
  }).appendTo(commentsDiv);

  $("<textarea/>", {
    id: "commentform" + bookId,
    cols: 40,
    rows: 5
  }).appendTo(commentForm);

  commentForm.append("<br>");

  var commentsubmit = $("<input/>", {
     type: "submit",
     value: "save"
  }).appendTo(commentForm);

  commentsubmit.click(function(event) {
    event.preventDefault();

    addComment(bookId);
  });

  // load comments asynchronously on book load
  loadComments(bookId);
}

// asynchronously load comments on a particular book
// from the database and reload comments on that book
// on the page
function loadComments(bookId)
{
  $.ajax({
    url: "handler.php",
    type: "POST",
    data: "opcode=4&bookId=" + bookId
  }).done(function(msg) {

    var comments = $.parseJSON(msg);
    var bookDiv = $("#book" + bookId);
    var commentsList = bookDiv.children(".comments").children(".commentslist");

    // remove all old comments and set up initial listview
    commentsList.children(".comment").remove();
    commentsList.listview();

    // place each comment on page
    for(i in comments) {
	var commentText = comments[i].comment;
      $("<li/>", {
        class: "comment",
        html: "",
        text: commentText
      }).appendTo(commentsList);
    } 

    // refresh listview to format new entries
    commentsList.listview("refresh");

    // update toggle for these comments
    bookDiv.children(".commenttoggle").html(comments.length + " comments");
  }).complete(function() {
    var commentsList = bookDiv.children(".comments").children(".commentslist");
    commentsList.listview();
  });

}

// execute when document is ready
$(document).ready(function() {

  $("input#bookformsubmit").click(function(event) {
    event.preventDefault();
    addBook();
  });

  loadBooks();
});