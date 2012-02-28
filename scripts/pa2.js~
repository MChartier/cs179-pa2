function addBook()
{
    var newTitle = $("input#bookformtitle").val();
    var newAuthor = $("input#bookformauthor").val();
    var newSynopsis = $("#bookformsynopsis").val();
    var newImage = $("input#bookformimage").val();

    var dataString = "opcode=2&title=" + newTitle + "&author=" + newAuthor + "&synopsis=" + newSynopsis + "&image=" + newImage;

    // send ajax request
    $.ajax({
        url: "handler.php",
    	type: "POST",
    	data: dataString
    }).done(function(msg) {
    	refreshBooks();
    });
}

function removeBook(bookId)
{
    $.ajax({
	url: "handler.php",
	type: "POST",
	data: "opcode=3&bookId=" + bookId
    }).done(function(msg) {
	    refreshBooks();
    });
}

function refreshBooks()
{
  $.ajax({
    url: "handler.php",
    type: "POST",
    data: "opcode=1"
  }).done(function(msg) {
    $(".book").remove();

    var books = JSON.parse(msg);

    for(i in books) {
      displayBook(books[i].uid, books[i].title, books[i].author, books[i].image_url);
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

function displayBook(bookId, bookTitle, bookAuthor, bookCover) {
  var divId = "book" + bookId;
  var book = $('<div/>', {
    id: divId,
    class: "book"
  }).appendTo('#selections');

  var bookInfo = $('<div/>', {
    class: "bookinfo"
  }).appendTo(book);

  var cover = $('<div/>', {
    class: "bookcover",
  }).appendTo(bookInfo);

  $('<img/>', {
    src: bookCover,
    width: 100,
    alt: bookTitle
  }).appendTo(cover);

  var remover = $('<div/>', {
    class: "bookremover",
    html: "X"
  }).appendTo(bookInfo);

  remover.click(function() {
    removeBook(bookId);
  });

  $('<div/>', {
    class: "booktitle",
    html: bookTitle
  }).appendTo(bookInfo);

  $('<div/>', {
    class: "bookauthor",
    html: "by " + bookAuthor
  }).appendTo(bookInfo);

  $('<div/>', {
    class: "commenttoggle",
    html: "Loading comments..."
  }).appendTo(book);

  var commentsDiv = $('<div/>', {
    class: "comments",
  }).css("display", "none").appendTo(book);

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
  refreshComments(bookId);
}

function refreshComments(bookId)
{
  $.ajax({
    url: "handler.php",
    type: "POST",
    data: "opcode=4&bookId=" + bookId
  }).done(function(msg) {



    var comments = $.parseJSON(msg);

    var bookDiv = $("#book" + bookId);

    var commentsDiv = bookDiv.children(".comments");



    // remove all old comments
    commentsDiv.children(".comment").remove();

    // place each comment on page
    for(i in comments) {
      var comment = $("<div/>", {
        class: "comment",
        html: comments[i].comment
      }).appendTo(commentsDiv);
    } 

    // update toggle for these comments
    bookDiv.children(".commenttoggle").html(comments.length + " comments");
    bookDiv.children(".commenttoggle").click(
      function() {
        toggleComments(bookId);
      });
  });
}

function displayComment(bookId, commentText)
{
  var bookDivId = "book" + bookId;
  var comments = $("#" + bookDivId).children(".comment");
  $('<div/>', {
    class: "comment",
    html: commentText
  }).appendTo(comments)
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
    refreshComments(bookId);
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

$(document).ready(function() {
  $.expander.defaults.slicePoint = 120;

  $(".field").click(function() {
    $(this).val("");
  });

  $("input#bookformsubmit").click(function(event) {
    event.preventDefault();
    addBook();
  });

  refreshBooks();
});