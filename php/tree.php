<?php
// Verbindung aufbauen, Datenbank auswählen
$link = mysql_connect("barbalex.ch", "alexande", "excalibu")
    or die("Keine Verbindung möglich: " . mysql_error());
//echo "Verbindung zum Datenbankserver erfolgreich";
mysql_select_db("alexande_apflora") or die("Auswahl der Datenbank fehlgeschlagen");

$ApArtId = $_GET["id"];
settype($id, "integer");

$child_dummy = array(0 => "dummy");
	
//pop dieses AP abfragen
$query_pop = "SELECT PopName, PopId, ApArtId FROM tblPopulation where ApArtId = $ApArtId ORDER BY PopName";
$result_pop = mysql_query($query_pop) or die("Anfrage fehlgeschlagen: " . mysql_error());
$anz_pop = mysql_num_rows($result_pop);
//Datenstruktur für pop aufbauen
$rows_pop = array();
while($r_pop = mysql_fetch_assoc($result_pop)) {
	$PopId = $r_pop['PopId'];
	settype($PopId, "integer");
	//TPop dieser Pop abfragen
	$query_tpop = "SELECT TPopFlurname, TPopId, PopId FROM tblTeilpopulation where PopId = $PopId ORDER BY TPopFlurname";
	$result_tpop = mysql_query($query_tpop) or die("Anfrage fehlgeschlagen: " . mysql_error());
	$anz_tpop = mysql_num_rows($result_tpop);
	//Datenstruktur für tpop aufbauen
	$rows_tpop = array();
	while($r_tpop = mysql_fetch_assoc($result_tpop)) {
		$TPopId = $r_tpop['TPopId'];
		settype($TPopId, "integer");
		//TPop setzen
		$attr_tpop = array("id" => $TPopId, "typ" => "tpop");
		$children_tpop = array(0 => "dummy");
		$tpop = array("data" => utf8_encode($r_tpop['TPopFlurname']), "attr" => $attr_tpop, "children" => $children_tpop);
		//tpop-Array um tpop ergänzen
	    $rows_tpop[] = $tpop;
	}
	mysql_free_result($result_tpop);
	
	//pop-ordner setzen
	//Teilpopulationen
	$pop_ordner_tpop_attr = array("id" => $PopId, "typ" => "ap_ordner_tpop");
	$pop_ordner_tpop = array("data" => $anz_tpop." Teilpopulationen", "attr" => $pop_ordner_tpop_attr, "children" => $rows_tpop);
	//Populations-Berichte
	$pop_ordner_popber_attr = array("id" => $PopId, "typ" => "pop_ordner_popber");
	$pop_ordner_popber = array("data" => "Populations-Berichte", "attr" => $pop_ordner_popber_attr, "children" => $child_dummy);
	//Massnahmen-Berichte
	$pop_ordner_massnber_attr = array("id" => $PopId, "typ" => "pop_ordner_massnber");
	$pop_ordner_massnber = array("data" => "Massnahmen-Berichte", "attr" => $pop_ordner_massnber_attr, "children" => $child_dummy);
	//zusammensetzen
	$pop_ordner = array(0 => $pop_ordner_tpop, 1 => $pop_ordner_popber, 2 => $pop_ordner_massnber);

	//Pop setzen
	$attr_pop = array("id" => $PopId, "typ" => "pop");
	$children_pop = $pop_ordner;
	$pop = array("data" => utf8_encode($r_pop['PopName']), "attr" => $attr_pop, "children" => $children_pop);
	//pop-Array um pop ergänzen
    $rows_pop[] = $pop;
}
mysql_free_result($result_pop);

//AP-Ziele
//Jahre
$query_apzielejahr = "SELECT ZielJahr FROM tblZiel where ApArtId = $ApArtId GROUP BY ZielJahr";
$result_apzielejahr = mysql_query($query_apzielejahr) or die("Anfrage fehlgeschlagen: " . mysql_error());
$anz_apzielejahr = 0;
//Datenstruktur apzielejahr aufbauen
$rows_apzielejahr = array();
while($r_apzielejahr = mysql_fetch_assoc($result_apzielejahr)) {
	$apzielejahr_jahr = $r_apzielejahr['ZielJahr'];
	settype($apzielejahr_jahr, "integer");

	//Typen
	$query_apziele = "SELECT ZielId, ZielTyp, ZielBezeichnung FROM tblZiel WHERE (ApArtId = $ApArtId) AND (ZielJahr = ".$r_apzielejahr['ZielJahr'].") ORDER BY ZielTyp, ZielBezeichnung";
	$result_apziele = mysql_query($query_apziele) or die("Anfrage fehlgeschlagen: " . mysql_error());
	$anz_apziele = mysql_num_rows($result_apziele);
	$anz_apzielejahr = $anz_apzielejahr + $anz_apziele;
	//Datenstruktur apzielejahr aufbauen
	$rows_apziele = array();
	while($r_apziele = mysql_fetch_assoc($result_apziele)) {
		//TPop setzen
		$ZielBezeichnung = utf8_encode($r_apziele['ZielBezeichnung']);
		$ZielTyp = utf8_encode($r_apziele['ZielTyp']);
		$attr_apziele = array("id" => $r_apziele['ZielId'], "typ" => "apziele");
		$children_apziele = array(0 => "dummy");
		$apziele = array("data" => $ZielBezeichnung, "attr" => $attr_apziele, "children" => $children_apziele);
		//Array um apziele ergänzen
	    $rows_apziele[] = $apziele;
	}
	mysql_free_result($result_apziele);

	//apzielejahr setzen
	$attr_apzielejahr = array("id" => $apzielejahr_jahr, "typ" => "apzielejahr");
	$data_apzielejahr = $apzielejahr_jahr.": ".$anz_apziele;
	$apzielejahr = array("data" => $data_apzielejahr, "attr" => $attr_apzielejahr, "children" => $rows_apziele);
	//tpop-Array um tpop ergänzen
    $rows_apzielejahr[] = $apzielejahr;
}
mysql_free_result($result_apzielejahr);
	

//AP-Ordner setzen
//Populationen
$ap_ordner_pop_attr = array("id" => $ApArtId, "typ" => "ap_ordner_pop");
$ap_ordner_pop = array("data" => $anz_pop." Populationen", "attr" => $ap_ordner_pop_attr, "children" => $rows_pop);
//AP-Ziele
$ap_ordner_apziele_attr = array("id" => $ApArtId, "typ" => "ap_ordner_apziele");
$ap_ordner_apziele = array("data" => $anz_apzielejahr." AP-Ziele", "attr" => $ap_ordner_apziele_attr, "children" => $rows_apzielejahr);
//Erfolgskriterien
$ap_ordner_erfkrit_attr = array("id" => $ApArtId, "typ" => "ap_ordner_erfkrit");
$ap_ordner_erfkrit = array("data" => "Erfolgskriterien", "attr" => $ap_ordner_erfkrit_attr, "children" => $child_dummy);
//AP-Berichte
$ap_ordner_apber_attr = array("id" => $ApArtId, "typ" => "ap_ordner_apber");
$ap_ordner_apber = array("data" => "AP-Berichte", "attr" => $ap_ordner_apber_attr, "children" => $child_dummy);
//Berichte
$ap_ordner_ber_attr = array("id" => $ApArtId, "typ" => "ap_ordner_ber");
$ap_ordner_ber = array("data" => "Berichte", "attr" => $ap_ordner_ber_attr, "children" => $child_dummy);
//zusammensetzen
$ap_ordner = array(0 => $ap_ordner_pop, 1 => $ap_ordner_apziele, 2 => $ap_ordner_erfkrit, 3 => $ap_ordner_apber, 4 => $ap_ordner_ber);

	
//in json verwandeln
$rows = json_encode($ap_ordner);

print($rows);

// Verbindung schliessen
if ($link) {
	mysql_close($link);
}
?>