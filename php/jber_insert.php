<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
	printf("Connect failed: %s\n", $link->connect_error);
	exit();
}

mysqli_set_charset($link, "utf8");

$id = $_POST["id"];
settype($id, "integer");
$user = $_POST["user"];
$time = date('Y-m-d H:i:s');

$Querystring = 'INSERT INTO tblJBer (ApArtId, MutWann, MutWer) VALUES ('.mysqli_real_escape_string($link, $id).', "'.mysqli_real_escape_string($link, $time).'", "'.mysqli_real_escape_string($link, $user).'")';	//muss die neue PopId erhalten!

//SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

print mysqli_insert_id($link);

// Verbindung schliessen
mysqli_close($link);
?>