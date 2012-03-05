<?
/*
 * handler.php
 * Matthew Chartier
 *
 * This script accepts requests and dispatches them to various handler
 * functions which output JSON strings in response.
 *
 */

// establish connection with database and define constants
require_once('includes/common.php');

// return information about books in database
function getBooks() {
  $sql = "SELECT * FROM books ORDER BY uid DESC";
  $result = mysql_query($sql);

  $rows = array();
  while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
  }
  print json_encode($rows);
}

// return information about comments on a particular book in database
function getComments($bookId) {
  $sql = "SELECT * FROM comments WHERE book_uid=" . 
         $bookId . " ORDER BY uid ASC";
  $result = mysql_query($sql);

  $rows = array();
  while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
  }
  print json_encode($rows);
}

// add a book to the database
function addBook() {
  $title = mysql_real_escape_string($_POST["title"]);
  $author = mysql_real_escape_string($_POST["author"]);
  $image = mysql_real_escape_string($_POST["image"]);

  $sql = "INSERT INTO books(title, author, image_url) " . 
         "VALUES('$title', '$author', '$image')";
  
  $result = mysql_query($sql);
}

// remove a book from the database
function removeBook() {
  // remove book
  $bookId = mysql_real_escape_string($_POST["bookId"]);
  $sql = "DELETE FROM books WHERE uid = " . $bookId;
  $result = mysql_query($sql);

  // remove comments
  $sql = "DELETE FROM comments WHERE book_uid = " . $bookId;
  $result = mysql_query($sql);
}

// add a comment to the database
function addComment() {
  $bookId = mysql_real_escape_string($_POST["bookId"]);
  $comment = mysql_real_escape_string($_POST["comment"]);

  $sql = "INSERT INTO comments(book_uid, comment) VALUES('$bookId', '$comment')";
  $result = mysql_query($sql);

  print $sql;
}

// remove a comment from the database
function removeComment() {
  $commentId = mysql_real_escape_string($_POST["commentId"]);
  $sql = "DELETE FROM comments WHERE uid = " . $commentId;
  $result = mysql_query($sql);
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
case $REMOVECOMMENT:
  removeComment($_POST["commentId"]);
  break;
default:
}

?>