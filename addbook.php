<?
  // establish connection to database
  require_once('includes/common.php');

  // get input from 'POST' message
  $title = mysql_real_escape_string($_POST["title"]);
  $author = mysql_real_escape_string($_POST["author"]);
  $synopsis = mysql_real_escape_string($_POST["synopsis"]);
  $image = mysql_real_escape_string($_POST["image"]);

  $sql = "INSERT INTO books(title, author, synopsis, image) " . 
         "VALUES('$title', '$author', '$synopsis', '$image')";
  
  $result = mysql_query($sql);
?>