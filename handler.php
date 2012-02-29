<?
// establish connection with database and define constants
require_once('includes/common.php');

// generate JSON object consisting of books stored in database
function getBooks() {
  $sql = "SELECT * FROM books ORDER BY uid DESC";
  $result = mysql_query($sql);

  $rows = array();
  while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
  }
  print json_encode($rows);
}

// generate JSON object consisting of comments on a particular book stored in database
function getComments($bookId) {
  $sql = "SELECT * FROM comments WHERE book_uid=" . $bookId . " ORDER BY uid ASC";
  $result = mysql_query($sql);

  $rows = array();
  while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
  }
  print json_encode($rows);
}

// add a book to the database
function addBook() {
  // get input from 'POST' message
  $title = mysql_real_escape_string($_POST["title"]);
  $author = mysql_real_escape_string($_POST["author"]);
  $image = mysql_real_escape_string($_POST["image"]);

  $sql = "INSERT INTO books(title, author, image_url) " . 
         "VALUES('$title', '$author', '$image')";
  
  $result = mysql_query($sql);
}

// remove a book from the database
function removeBook() {
  $bookId = mysql_real_escape_string($_POST["bookId"]);
  $sql = "DELETE FROM books WHERE uid = " . $bookId;
  $result = mysql_query($sql);
}

// add a comment on a book to the database
function addComment() {
  // get input from 'POST' message
  $bookId = mysql_real_escape_string($_POST["bookId"]);
  $text = mysql_real_escape_string($_POST["text"]);

  $sql = "INSERT INTO comments(book_uid, comment) VALUES('$bookId', '$text')";
  
  $result = mysql_query($sql);

  echo $sql;
}

// main handler code
// given operation code, dispatch to appropriate function
$opcode = $_POST["opcode"];

switch($opcode) {
case $GETBOOKS:
  getBooks();  
  break;
case $ADDBOOK:
  addBook();
  break;
case $REMOVEBOOK:
  removeBook();
  break;
case $GETCOMMENTS:
  getComments($_POST["bookId"]);
  break;
case $ADDCOMMENT:
  addComment();
  break;
default:
}

?>