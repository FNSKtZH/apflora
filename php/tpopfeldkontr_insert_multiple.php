<?php
// Verbindung aufbauen, Datenbank auswählen

$link = new mysqli("localhost", "alexande", "y3oYksFsQL49es9x", "alexande_apflora");

/* check connection */
if ($link->connect_errno) {
	printf("Connect failed: %s\n", $link->connect_error);
	exit();
}

mysqli_set_charset($link, "utf8");

// in diesem Array sammeln wir alle upzudatenden Felder
$Felderarray = $_POST;

$Keystring = implode(',', array_keys($_POST));
$Valuestring = implode('","', array_values($_POST));

// jetzt den Querystring aufbauen
$Querystring = 'INSERT INTO tblTeilPopFeldkontrolle ('.$Keystring.') VALUES ("'.$Valuestring.'")';

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

print($result);

// Verbindung schliessen
mysqli_close($link);
?>