<? require_once('includes/common.php'); ?>

<!doctype html>

<html>
  <head>
    <title>Book Club</title>
    <LINK rel="stylesheet" type="text/css" href="pa2.css">
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script type="text/javascript" src="jquery.expander.js"></script>
    <script type="text/javascript" src="pa2.js"></script>
  </head>
  <body>
    <div id="header">
      <img id="title-image" src="images/books.gif">
      <span id="title-text">Book Club</div>
    </div> <!-- end header -->
    
    <div id="container">
      <div id="sidebar">
	<form name="bookform" id="bookform">
	  <input    id="bookformtitle"     type="text"><br>
	  <input    id="bookformauthor"   type="text"><br>
	  <textarea id="bookformsynopsis"></textarea><br>
	  <input    id="bookformimage"    type="text"><br>
	  <input    id="bookformsubmit"   type="submit">
	</form>
      </div> <!-- end sidebar -->

      <div id="selections">
	<?
           $sql = "SELECT * FROM books ORDER BY bookId DESC";
           $result = mysql_query($sql);

           while($row = mysql_fetch_array($result)) {

           echo('<div class="book">'); // start book

	   echo('<div class="bookinfo">'); // start book info
           echo('<div class="booktitle">' . $row["title"] . '</div>');
           echo('<div class="bookauthor">' . $row["author"] . '</div>');
           echo('<img src="' . $row["image"] . '" class="bookcover">');
	   echo('<div class="booksynopsis">' . $row["synopsis"] . '</div>');
	   echo('</div>'); // end book info

	   echo('<hr>');

           echo('<div class="comments">'); // start comments
	   
           $sql2 = "SELECT * FROM comments WHERE bookId=" . $row["bookId"] .
	   " ORDER BY commentId ASC";

	   $result2 = mysql_query($sql2);
           while($row2 = mysql_fetch_array($result2)) {
	   echo('<div class="comment">' . 
           '<div class="commenttext">' . $row2["text"] . '</div>' .
           '<div class="commentauthor">' . $row2["name"] . 
           '</div></div>');
	   }

           echo('</div>'); // end comments

           echo('</div>'); // end book
           }
	   ?>

      </div> <!-- end selections -->
    </div> <!-- end container -->
  </body>
</html>
