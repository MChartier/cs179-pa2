<?
  // establish connection to database
  require_once('includes/common.php');

  // get input from 'POST' message
  $bookId = mysql_real_escape_string($_POST["bookId"]);
  $name = mysql_real_escape_string($_POST["name"]);
  $text = mysql_real_escape_string($_POST["text"]);

  $sql = "INSERT INTO comments (bookId, name, text, image)" .
         "VALUES($bookId, $name, $text, $image)";
  
  $result = mysql_query($sql);
?>