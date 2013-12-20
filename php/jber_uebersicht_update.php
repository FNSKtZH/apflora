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
$Feld = $_POST["Feld"];
$Wert = $_POST["Wert"];
$user = $_POST["user"];
$time = date('Y-m-d H:i:s');

if ($Wert == NULL) {
	//Null speichern, sonst werden aus Nullwerten in Zahlenfeldern 0 gemacht
	$Querystring = 'UPDATE tblJBerUebersicht SET '.mysqli_real_escape_string($link, $Feld).'= NULL, MutWann="'.mysqli_real_escape_string($link, $time).'", MutWer="'.mysqli_real_escape_string($link, $user).'" WHERE JbuJahr = '.mysqli_real_escape_string($link, $id);
} else {
	$Querystring = 'UPDATE tblJBerUebersicht SET '.mysqli_real_escape_string($link, $Feld).'="'.mysqli_real_escape_string($link, $Wert).'", MutWann="'.mysqli_real_escape_string($link, $time).'", MutWer="'.mysqli_real_escape_string($link, $user).'" WHERE JbuJahr = '.mysqli_real_escape_string($link, $id);
}

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

if (!$result) {
	print "Fehler: Wert ".mysqli_real_escape_string($link, $Wert)." konnte nicht im Feld ".mysqli_real_escape_string($link, $Feld)." gespeichert werden";
}

// Verbindung schliessen
mysqli_close($link);
?>