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
      alert(msg);
    	loadBooks();
    });
}

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

function toggleComments(bookId)
{
  var comments = $("#book" + bookId).children(".comments");
  if(comments.css("display") == "none")
    comments.show("fast");
  else
    comments.hide("fast");
}

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
      loadBook(books[i].uid, books[i].title, books[i].author, books[i].image_url);
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
    html: "X"
  }).appendTo(bookInfo);

  remover.click(function() {
    removeBook(bookId);
  });

  // title and author
  $('<div/>', {
    class: "booktitle",
    html: bookTitle
  }).appendTo(bookInfo);
  $('<div/>', {
    class: "bookauthor",
    html: "by " + bookAuthor
  }).appendTo(bookInfo);

  // comment toggle (clicking displays or hides comments)
  $('<div/>', {
    class: "commenttoggle",
    html: "Loading comments..."
  }).appendTo(book);

  var commentsDiv = $('<div/>', {
    class: "comments"
  }).css("display", "none").appendTo(book);

  $("<ul/>", {
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

    // remove all old comments
    commentsList.children(".comment").remove();

    // place each comment on page
    for(i in comments) {
      $("<li/>", {
        class: "comment",
        html: comments[i].comment
      }).appendTo(commentsList);
    } 

    commentsList.listview();

    // update toggle for these comments
    bookDiv.children(".commenttoggle").html(comments.length + " comments");
    bookDiv.children(".commenttoggle").click(
      function() {
        toggleComments(bookId);
      });
  });
}

$(document).ready(function() {

  $(".field").click(function() {
    $(this).val("");
  });

  $("input#bookformsubmit").click(function(event) {
    event.preventDefault();
    addBook();
  });

  loadBooks();
});