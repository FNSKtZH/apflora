<?php
// Verbindung aufbauen, Datenbank auswählen
//$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
    printf("Connect failed: %s\n", $link->connect_error);
    exit();
}

$PopId = $_GET["pop_id"];
settype($PopId, "integer");
$TPopId = $_GET["tpop_id"];
settype($TPopId, "integer");
$user = $_GET["user"];
$time = date('Y-m-d H:i:s');

$Querystring = 'UPDATE tblTeilpopulation SET PopId="'.$PopId.'", MutWann="'.$time.'", MutWer="'.$user.'" WHERE TPopId='.$TPopId;

// SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

if (!$result) {
	print "Fehler: Die Teilpopulation wurde nicht verschoben";
}

// Verbindung schliessen
mysqli_close($link);
?>