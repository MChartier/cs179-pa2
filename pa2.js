function addBook()
{
    var newTitle = $("input#bookformtitle").val();
    var newAuthor = $("input#bookformauthor").val();
    var newSynopsis = $("#bookformsynopsis").val();
    var newImage = $("input#bookformimage").val();

    var dataString = "title=" + newTitle + "&author=" + newAuthor + "&synopsis=" + newSynopsis + "&image=" + newImage;
I
    // send ajax request
    $.ajax({
        url: "addbook.php",
	type: "POST",
	data: dataString
    }).done(function(msg) {
	// add to page
    });
}

function addComment(bookId)
{
    var newName = "matt";
    var newText = "comment";

    var dataString = "bookId=" + bookId + "&name=" + newName + "&text=" + newText;

    // send ajax request
    $.ajax({
        url: "addcomment.php",
	type: "POST",
	data: dataString
    }).done(function(msg) {
	// add to page
    });
}


$.expander.defaults.slicePoint = 120;

$(document).ready(function() {
    $(".booksynopsis").expander({
	slicePoint: 400,
        expandPrefix: '',
        expandText: '>>>',
        userCollapseText: '<<<'
    });

    $("input#bookformsubmit").click(function(event) {
	event.preventDefault();
        addBook();
    });
});