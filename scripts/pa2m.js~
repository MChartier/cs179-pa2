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
    $("#selections").html(msg);
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

function refreshComments(bookId)
{
  $.ajax({
    url: "handler.php",
    type: "POST",
    data: "opcode=4&bookId=" + bookId
  }).done(function(msg) {
      $("#comments" + bookId).html(msg);
  });
}

function addComment(bookId)
{
  var newText = $("#commenttext" + bookId).val();
  var dataString = "opcode=5&bookId=" + bookId + "&text=" + newText;

  // send ajax request
  $.ajax({
    url: "handler.php",
    type: "POST",
    data: dataString
  }).done(function(msg) {
    refreshComments(bookId);
  });
}

$.expander.defaults.slicePoint = 120;

$(document).ready(function() {
  $("input#bookformsubmit").click(function(event) {
    event.preventDefault();
    addBook();
  });

  refreshBooks();
});