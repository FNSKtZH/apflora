<?php
// Verbindung aufbauen, Datenbank auswählen
$link = new mysqli("barbalex.ch", "alexande", "excalibu", "alexande_apflora");
//$link = new mysqli("127.0.0.1", "root", "admin", "apflora");

/* check connection */
if ($link->connect_errno) {
	printf("Connect failed: %s\n", $link->connect_error);
	exit();
}

mysqli_set_charset($link, "utf8");

//in diesem Array sammeln wir alle upzudatenden Felder
$Felderarray = $_GET;
//id wird nur für die WHERE-Klausel benutzt, nicht speichern
$id = $_GET["id"];
settype($id, "integer");
unset($Felderarray["id"]);
//user soll als MutWer gespeichert werden
$user = $_GET["user"];
unset($Felderarray["user"]);
//Zeit wird in MutWann gespeichert
$time = date('Y-m-d H:i:s');

//zunächst mal Daten ins richtige Format bringen
foreach ($Felderarray as $key => $value) {
    if ($key == "TPopKontrDatum") {
		$value = date("Y-m-d H:i:s", strtotime($value));
	} 
}

//jetzt den Querystring aufbauen
$Querystring = 'UPDATE tblTeilPopFeldkontrolle SET MutWann="'.$time.'", MutWer="'.$user.'"';
//jetzt Querystring entwickeln
foreach ($Felderarray as $key => $value) {
	$Querystring .= ','.$key.'="'.$value.'"';
}
//MutWann, MutWer und Where ergänzen
$Querystring .= ' WHERE TPopKontrId='.$id;

//SQL-Anfrage ausführen
$result = mysqli_query($link, $Querystring);

print($result);

// Verbindung schliessen
mysqli_close($link);
?>