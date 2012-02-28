<?
require_once('includes/common.php');

// function displayComments($bookId) {
//   $sql = "SELECT * FROM comments WHERE bookId=" . $bookId .
//           " ORDER BY commentId ASC";

//   $result = mysql_query($sql);
//   while($row = mysql_fetch_array($result)) {
//     echo('<div class="comment">' . 
//          '<div class="commenttext">' . $row["text"] . '</div>' .
//          '</div>');
//   }
// }

function getBooks() {
  $sql = "SELECT * FROM books ORDER BY bookId DESC";
  $result = mysql_query($sql);

  $rows = array();
  while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
  }
  print json_encode($rows);
}

function getComments($bookId) {
  $sql = "SELECT * FROM comments WHERE bookId=" . $bookId . " ORDER BY commentId ASC";
  $result = mysql_query($sql);

  $rows = array();
  while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
  }
  print json_encode($rows);
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

  echo $sql;
}

// handler
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