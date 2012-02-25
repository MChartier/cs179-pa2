<?
  // include credentials for database
  require_once('constants.php');

  // establish connection with database
  $connection = mysql_connect($host, $username, $password);

  if(!$connection) 
    die('Failed to connect to mysql database.');

  // select book club table for queries
  if(!mysql_select_db($table, $connection))
    die('Failed to select database!');

?>