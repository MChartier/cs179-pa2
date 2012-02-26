<?
require_once('includes/common.php');

function displayComments($bookId) {
  $sql = "SELECT * FROM comments WHERE bookId=" . $bookId .
          " ORDER BY commentId ASC";

  $result = mysql_query($sql);
  while($row = mysql_fetch_array($result)) {
    echo('<div class="comment">' . 
         '<div class="commenttext">' . $row["text"] . '</div>' .
         '</div>');
  }
}

function displayBooks() {
  $sql = "SELECT * FROM books ORDER BY bookId DESC";
  $result = mysql_query($sql);

  while($row = mysql_fetch_array($result)) {

    echo('<div class="book">'); // start book

    echo('<div class="bookinfo">'); // start book info

    echo('<div class="bookremover" ' .
              'onclick="(function(bookId){removeBook(bookId);})(' . 
              $row["bookId"] . ')">X</div>');

    echo('<div class="booktitle">' . $row["title"] . '</div>');
    echo('<div class="bookauthor">' . $row["author"] . '</div>');
    echo('<img src="' . $row["image"] . '" class="bookcover">');
    echo('<div class="booksynopsis">' . $row["synopsis"] . '</div>');
    echo('</div>'); // end book info

    echo('<hr>');

    echo('<form>' .
         '<textarea id="commenttext' . $row["bookId"] . '" cols=50 rows=5>' . 
	 '</textarea><br>' .
         '<input class="commentsubmit" id="commentsubmit' . $row["bookId"] . 
	 '" type="submit" ' .
	 'onclick="(function(bookId){addComment(bookId);})(' . 
	 $row["bookId"] . ')"' . 
	 'value="save">' .
         '</form>');

    echo('<div id="comments' . $row["bookId"] . '">');

    displayComments($row["bookId"]);

    echo('</div></div>'); // end book
  }
}

function addBook() {
  // get input from 'POST' message
  $title = mysql_real_escape_string($_POST["title"]);
  $author = mysql_real_escape_string($_POST["author"]);
  $synopsis = mysql_real_escape_string($_POST["synopsis"]);
  $image = mysql_real_escape_string($_POST["image"]);

  $sql = "INSERT INTO books(title, author, synopsis, image) " . 
         "VALUES('$title', '$author', '$synopsis', '$image')";
  
  $result = mysql_query($sql);
}

function removeBook() {
  $bookId = mysql_real_escape_string($_POST["bookId"]);
  $sql = "DELETE FROM books WHERE bookId = " . $bookId;
  $result = mysql_query($sql);
}

function addComment() {
  // get input from 'POST' message
  $bookId = mysql_real_escape_string($_POST["bookId"]);
  $text = mysql_real_escape_string($_POST["text"]);

  $sql = "INSERT INTO comments(bookId, text) VALUES('$bookId', '$text')";
  
  $result = mysql_query($sql);
}

// handler
$opcode = $_POST["opcode"];

switch($opcode) {
case $GETBOOKS:
  displayBooks();  
  break;
case $ADDBOOK:
  addBook();
  break;
case $REMOVEBOOK:
  removeBook();
  break;
case $GETCOMMENTS:
  displayComments($_POST["bookId"]);
  break;
case $ADDCOMMENT;
  addComment();
  break;
default:
}

?>