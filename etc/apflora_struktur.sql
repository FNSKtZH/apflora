-- MySQL dump 10.13  Distrib 5.5.40, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: apflora
-- ------------------------------------------------------
-- Server version	5.5.40-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `apflora`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `apflora` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `apflora`;

--
-- Table structure for table `domApBearbeitungsstand`
--

DROP TABLE IF EXISTS `domApBearbeitungsstand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domApBearbeitungsstand` (
  `DomainCode` int(10) NOT NULL DEFAULT '0',
  `DomainTxt` varchar(50) DEFAULT NULL,
  `DomainOrd` smallint(5) DEFAULT NULL,
  `MutWann` datetime DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geaendert?',
  `MutWer` varchar(20) NOT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geaendert?',
  PRIMARY KEY (`DomainCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Domain: Bearbeitungsstand des APs';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domApErfKrit`
--

DROP TABLE IF EXISTS `domApErfKrit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domApErfKrit` (
  `BeurteilId` int(10) NOT NULL AUTO_INCREMENT,
  `BeurteilTxt` varchar(50) DEFAULT NULL COMMENT 'Wie werden die durchgefuehrten Massnahmen beurteilt?',
  `BeurteilOrd` smallint(5) DEFAULT NULL,
  `MutWann` datetime DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geaendert?',
  `MutWer` varchar(20) NOT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geaendert?',
  PRIMARY KEY (`BeurteilId`)
) ENGINE=InnoDB AUTO_INCREMENT=1168274205 DEFAULT CHARSET=utf8 COMMENT='Domain: Skala fuer die Beurteilung des Erfolgs des APs';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domApUmsetzung`
--

DROP TABLE IF EXISTS `domApUmsetzung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domApUmsetzung` (
  `DomainCode` int(10) NOT NULL,
  `DomainTxt` varchar(50) DEFAULT NULL,
  `DomainOrd` smallint(5) DEFAULT NULL,
  `MutWann` datetime DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geaendert?',
  `MutWer` varchar(20) NOT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geaendert?',
  PRIMARY KEY (`DomainCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Domain: Umsetzungsstand des APs';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domErfBeurtKrit`
--

DROP TABLE IF EXISTS `domErfBeurtKrit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domErfBeurtKrit` (
  `DomainCode` int(10) NOT NULL,
  `DomainTxt` varchar(50) DEFAULT NULL,
  `DomainOrd` smallint(5) DEFAULT NULL,
  `MutWann` datetime DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geaendert?',
  `MutWer` varchar(20) NOT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geaendert?',
  PRIMARY KEY (`DomainCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Domain: Kriterien fuer die Beurteilung des Erfolgs des APs';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domGemeinden`
--

DROP TABLE IF EXISTS `domGemeinden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domGemeinden` (
  `BfsNr` int(11) NOT NULL DEFAULT '0',
  `GmdName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`BfsNr`),
  KEY `GmdName` (`GmdName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Domain: Liste der Gemeinden des Kt. ZH';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domPopEntwicklung`
--

DROP TABLE IF EXISTS `domPopEntwicklung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domPopEntwicklung` (
  `EntwicklungId` int(10) NOT NULL AUTO_INCREMENT,
  `EntwicklungTxt` varchar(60) DEFAULT NULL,
  `EntwicklungOrd` smallint(5) DEFAULT NULL,
  `MutWann` datetime DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geaendert?',
  `MutWer` varchar(20) NOT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geaendert?',
  PRIMARY KEY (`EntwicklungId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='Domain fuer die Populationsentwicklung';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domPopHerkunft`
--

DROP TABLE IF EXISTS `domPopHerkunft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domPopHerkunft` (
  `HerkunftId` int(10) NOT NULL AUTO_INCREMENT,
  `HerkunftTxt` varchar(60) DEFAULT NULL COMMENT 'Beschreibung der Herkunft',
  `HerkunftOrd` smallint(5) DEFAULT NULL,
  `MutWann` datetime DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geaendert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geaendert?',
  `ZdsfVorhanden` text NOT NULL COMMENT 'Wert im Feld Vorhandensein beim ZDSF',
  `ZdsfHerkunft` text NOT NULL COMMENT 'Wert im Feld Herkunft beim ZDSF',
  PRIMARY KEY (`HerkunftId`)
) ENGINE=InnoDB AUTO_INCREMENT=301 DEFAULT CHARSET=utf8 COMMENT='Domain fuer die Charakterisierung der Population';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domTPopApBerichtRelevant`
--

DROP TABLE IF EXISTS `domTPopApBerichtRelevant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domTPopApBerichtRelevant` (
  `DomainCode` int(10) NOT NULL AUTO_INCREMENT,
  `DomainTxt` text,
  `MutWann` datetime DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geaendert?',
  `MutWer` varchar(20) NOT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geaendert?',
  PRIMARY KEY (`DomainCode`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COMMENT='Domain für TPopApBerichtRelevant';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domTPopEntwicklung`
--

DROP TABLE IF EXISTS `domTPopEntwicklung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domTPopEntwicklung` (
  `EntwicklungCode` int(10) NOT NULL,
  `EntwicklungTxt` varchar(50) DEFAULT NULL,
  `EntwicklungOrd` smallint(5) DEFAULT NULL,
  `MutWann` datetime DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geaendert?',
  `MutWer` varchar(20) NOT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geaendert?',
  PRIMARY KEY (`EntwicklungCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Domain fuer die Entwicklung einer Teilpopulation';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domTPopFeldkontrTyp`
--

DROP TABLE IF EXISTS `domTPopFeldkontrTyp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domTPopFeldkontrTyp` (
  `DomainCode` int(10) NOT NULL,
  `DomainTxt` varchar(50) DEFAULT NULL,
  `DomainOrd` smallint(5) DEFAULT NULL,
  `MutWann` datetime DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geaendert?',
  `MutWer` varchar(20) NOT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geaendert?',
  PRIMARY KEY (`DomainCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Domain fuer die Typisierung der Feldkontrolle einer Teilpop';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domTPopKontrIdBiotUebereinst`
--

DROP TABLE IF EXISTS `domTPopKontrIdBiotUebereinst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domTPopKontrIdBiotUebereinst` (
  `DomainCode` int(10) NOT NULL,
  `DomainTxt` varchar(50) DEFAULT NULL,
  `DomainOrd` smallint(5) DEFAULT NULL,
  `MutWann` datetime DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geaendert?',
  `MutWer` varchar(20) NOT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geaendert?',
  PRIMARY KEY (`DomainCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Domain: Kriterien fuer die Beurteilung des Erfolgs des APs';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domTPopKontrMethode`
--

DROP TABLE IF EXISTS `domTPopKontrMethode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domTPopKontrMethode` (
  `BeurteilCode` int(10) NOT NULL,
  `BeurteilTxt` varchar(50) DEFAULT NULL,
  `BeurteilOrd` smallint(5) DEFAULT NULL,
  `MutWann` datetime DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geaendert?',
  `MutWer` varchar(20) NOT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geaendert?',
  PRIMARY KEY (`BeurteilCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Domain fuer die Methode der Feldkontrolle einer Teilpop.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domTPopKontrZaehleinheit`
--

DROP TABLE IF EXISTS `domTPopKontrZaehleinheit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domTPopKontrZaehleinheit` (
  `ZaehleinheitCode` int(10) NOT NULL,
  `ZaehleinheitTxt` varchar(50) DEFAULT NULL,
  `ZaehleinheitOrd` smallint(5) DEFAULT NULL,
  `MutWann` datetime DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geaendert?',
  `MutWer` varchar(20) NOT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geaendert?',
  PRIMARY KEY (`ZaehleinheitCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Domain fuer Zähleinheiten einer Teilpopulation';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domTPopMassnErfolgsbeurteilung`
--

DROP TABLE IF EXISTS `domTPopMassnErfolgsbeurteilung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domTPopMassnErfolgsbeurteilung` (
  `BeurteilId` int(10) NOT NULL AUTO_INCREMENT,
  `BeurteilTxt` varchar(50) DEFAULT NULL COMMENT 'Wie werden die durchgefuehrten Massnahmen beurteilt?',
  `BeurteilOrd` smallint(5) DEFAULT NULL,
  `MutWann` datetime DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geaendert?',
  `MutWer` varchar(20) NOT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geaendert?',
  PRIMARY KEY (`BeurteilId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COMMENT='Domain fur die Erfolgsbeurteilung von Massnahmen einer TPop';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domTPopMassnTyp`
--

DROP TABLE IF EXISTS `domTPopMassnTyp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domTPopMassnTyp` (
  `MassnTypCode` int(10) NOT NULL,
  `MassnTypTxt` varchar(50) DEFAULT NULL,
  `MassnTypOrd` smallint(5) DEFAULT NULL,
  `MassnAnsiedlung` tinyint(1) NOT NULL COMMENT 'Handelt es sich um eine Ansiedlung?',
  `MutWann` datetime DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geaendert?',
  `MutWer` varchar(20) NOT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geaendert?',
  PRIMARY KEY (`MassnTypCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Domain fuer die Typisierung von Massnahmen einer Teilpop';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domZielTyp`
--

DROP TABLE IF EXISTS `domZielTyp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domZielTyp` (
  `ZieltypId` int(10) NOT NULL AUTO_INCREMENT,
  `ZieltypTxt` varchar(50) DEFAULT NULL COMMENT 'Beschreibung des Ziels',
  `ZieltypOrd` smallint(5) DEFAULT NULL,
  `MutWann` datetime DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geaendert?',
  `MutWer` varchar(20) NOT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geaendert?',
  PRIMARY KEY (`ZieltypId`)
) ENGINE=InnoDB AUTO_INCREMENT=1170775557 DEFAULT CHARSET=utf8 COMMENT='Domain fuer den Typ von Zielen eines APs';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblAdresse`
--

DROP TABLE IF EXISTS `tblAdresse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblAdresse` (
  `AdrId` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Primärschlüssel der Tabelle "tblAdresse"',
  `AdrName` varchar(255) DEFAULT NULL COMMENT 'Vor- und Nachname',
  `AdrAdresse` varchar(255) DEFAULT NULL COMMENT 'Strasse, PLZ und Ort',
  `AdrTel` varchar(255) DEFAULT NULL COMMENT 'Telefonnummer',
  `AdrEmail` varchar(255) DEFAULT NULL COMMENT 'Email',
  `freiwErfko` int(10) DEFAULT NULL COMMENT '-1 = freiwillige(r) Kontrolleur(in)',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`AdrId`)
) ENGINE=InnoDB AUTO_INCREMENT=2130770350 DEFAULT CHARSET=utf8 COMMENT='Adressdaten';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblAp`
--

DROP TABLE IF EXISTS `tblAp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblAp` (
  `ApArtId` int(10) NOT NULL COMMENT 'Primärschlüssel der Tabelle "tblAktionsplan". = SISF-Nr',
  `ApStatus` int(10) DEFAULT NULL COMMENT 'In welchem Bearbeitungsstand befindet sich der AP?',
  `ApJahr` smallint(5) DEFAULT NULL COMMENT 'Wann wurde mit der Umsetzung des Aktionsplans begonnen?',
  `ApUmsetzung` int(10) DEFAULT NULL COMMENT 'In welchem Umsetzungsstand befindet sich der AP?',
  `ApBearb` int(10) DEFAULT NULL COMMENT 'Verantwortliche(r) für die Art',
  `ApArtwert` int(11) DEFAULT NULL COMMENT 'redundant aber erspart viele Abfragen. Wird aktualisiert, wenn apfloraBeob.ArtenDb_Arteigenschaften aktualisiert wird',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`ApArtId`),
  KEY `ApStatus` (`ApStatus`),
  KEY `ApUmsetzung` (`ApUmsetzung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Angaben zu Aktionsplänen';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblAssozArten`
--

DROP TABLE IF EXISTS `tblAssozArten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblAssozArten` (
  `AaId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primärschlüssel der Tabelle "tblIbArtenAssoz"',
  `AaApArtId` int(11) NOT NULL COMMENT 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "tblAktionsplan"',
  `AaSisfNr` int(11) NOT NULL COMMENT 'SisfNr der assoziierten Art',
  `AaBem` text COMMENT 'Bemerkungen zur Assoziation',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Wer hat den Datensatz zuletzt geändert?',
  PRIMARY KEY (`AaId`),
  KEY `IbaassApArtId` (`AaApArtId`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COMMENT='Assoziierte Arten';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblBeobZuordnung`
--

DROP TABLE IF EXISTS `tblBeobZuordnung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblBeobZuordnung` (
  `NO_NOTE` varchar(38) DEFAULT NULL COMMENT 'Primärschlüssel: ID aus Info Spezies oder aus EvAB',
  `TPopId` int(10) DEFAULT NULL COMMENT 'Dieser Teilpopulation wurde die Beobachtung zugeordnet. Fremdschlüssel aus der Tabelle "tblTeilpopulation"',
  `BeobNichtZuordnen` tinyint(1) DEFAULT NULL COMMENT 'Ja oder nein. Wird ja gesetzt, wenn eine Beobachtung keiner Teilpopulation zugeordnet werden kann. Sollte im Bemerkungsfeld begründet werden. In der Regel ist die Artbestimmung zweifelhaft. Oder die Beobachtung ist nicht (genau genug) lokalisierbar',
  `BeobBemerkungen` longtext COMMENT 'Bemerkungen zur Zuordnung',
  `BeobMutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `BeobMutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  KEY `no_note` (`NO_NOTE`),
  KEY `tpopid` (`TPopId`),
  KEY `beobnichtzuordnen` (`BeobNichtZuordnen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Zuordnung von Beobachtungen zu Teilpopulationen';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblBer`
--

DROP TABLE IF EXISTS `tblBer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblBer` (
  `BerId` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Primärschlüssel der Tabelle "tblBer"',
  `ApArtId` int(10) DEFAULT NULL COMMENT 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "tblAktionsplan"',
  `BerAutor` varchar(150) DEFAULT NULL COMMENT 'Autor des Berichts',
  `BerJahr` smallint(5) DEFAULT NULL COMMENT 'Jahr der Publikation',
  `BerTitel` varchar(255) DEFAULT NULL COMMENT 'Titel des Berichts',
  `BerURL` varchar(255) DEFAULT NULL COMMENT 'Link zum Bericht',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`BerId`),
  KEY `ApArtId` (`ApArtId`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COMMENT='Berichte zu AP-Arten';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblErfKrit`
--

DROP TABLE IF EXISTS `tblErfKrit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblErfKrit` (
  `ErfkritId` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Primärschlüssel der Tabelle "tblErfKrit"',
  `ApArtId` int(10) DEFAULT NULL COMMENT 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "tblAktionsplan"',
  `ErfkritErreichungsgrad` int(10) DEFAULT NULL COMMENT 'Wie gut wurden die Ziele erreicht? Auswahl aus der Tabelle "DomainApErfKrit"',
  `ErfkritTxt` varchar(255) DEFAULT NULL COMMENT 'Beschreibung der Kriterien für den Erreichungsgrad',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`ErfkritId`),
  KEY `ApArtId` (`ApArtId`),
  KEY `ErfBeurtZielSkalaErreichungsgrad` (`ErfkritErreichungsgrad`)
) ENGINE=InnoDB AUTO_INCREMENT=1980375832 DEFAULT CHARSET=utf8 COMMENT='Kriterien, um den Erfolg eines AP zu beurteilen';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblIdealbiotop`
--

DROP TABLE IF EXISTS `tblIdealbiotop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblIdealbiotop` (
  `IbApArtId` int(11) NOT NULL COMMENT 'Primärschlüssel der Tabelle "tblIdealbiotop". Gleichzeitig Fremdschlüssel aus der Tabelle "tblAktionsplan" (1:1-Beziehung)',
  `IbErstelldatum` date DEFAULT NULL COMMENT 'Erstelldatum',
  `IbHoehenlage` text COMMENT 'Höhenlage',
  `IbRegion` text COMMENT 'Region',
  `IbExposition` text COMMENT 'Exposition',
  `IbBesonnung` text COMMENT 'Besonnung',
  `IbHangneigung` text COMMENT 'Hangneigung',
  `IbBodenTyp` text COMMENT 'Bodentyp',
  `IbBodenKalkgehalt` text COMMENT 'Kalkgehalt im Boden',
  `IbBodenDurchlaessigkeit` text COMMENT 'Bodendurchlässigkeit',
  `IbBodenHumus` text COMMENT 'Bodenhumusgehalt',
  `IbBodenNaehrstoffgehalt` text COMMENT 'Bodennährstoffgehalt',
  `IbWasserhaushalt` text COMMENT 'Wasserhaushalt',
  `IbKonkurrenz` text COMMENT 'Konkurrenz',
  `IbMoosschicht` text COMMENT 'Moosschicht',
  `IbKrautschicht` text COMMENT 'Krautschicht',
  `IbStrauchschicht` text COMMENT 'Strauchschicht',
  `IbBaumschicht` text COMMENT 'Baumschicht',
  `IbBemerkungen` text NOT NULL COMMENT 'Bemerkungen',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt verändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Wer hat den Datensatz zuletzt verändert?',
  PRIMARY KEY (`IbApArtId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Ideale Umweltfaktoren';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblJBer`
--

DROP TABLE IF EXISTS `tblJBer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblJBer` (
  `JBerId` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Primärschlüssel der Tabelle "tblJBer"',
  `ApArtId` int(10) DEFAULT NULL COMMENT 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabellle "tblAktionsplan"',
  `JBerJahr` smallint(5) DEFAULT NULL COMMENT 'Für welches Jahr gilt der Bericht?',
  `JBerSituation` longtext COMMENT 'Beschreibung der Situation im Berichtjahr',
  `JBerVergleichVorjahrGesamtziel` longtext COMMENT 'Vergleich zu Vorjahr und Ausblick auf das Gesamtziel',
  `JBerBeurteilung` int(10) DEFAULT NULL COMMENT 'Beurteilung des Erfolgs des Aktionsplans bisher',
  `JBerVeraenGegenVorjahr` varchar(2) DEFAULT NULL COMMENT 'Veränderung gegenüber dem Vorjahr: plus heisst aufgestiegen, minus heisst abgestiegen',
  `JBerAnalyse` varchar(255) DEFAULT NULL COMMENT 'Was sind die Ursachen fuer die beobachtete Entwicklung?',
  `JBerUmsetzung` longtext COMMENT 'Konsequenzen für die Umsetzung',
  `JBerErfko` longtext COMMENT 'Konsequenzen für die Erfolgskontrolle',
  `JBerATxt` longtext COMMENT 'Bemerkungen zum Aussagebereich A: Grundmengen und getroffene Massnahmen',
  `JBerBTxt` longtext COMMENT 'Bemerkungen zum Aussagebereich B: Bestandeskontrolle',
  `JBerCTxt` longtext COMMENT 'Bemerkungen zum Aussagebereich C: Zwischenbilanz zur Wirkung von Massnahmen',
  `JBerDTxt` longtext COMMENT 'Bemerkungen zum Aussagebereich D: Einschätzung der Wirkung des AP insgesamt pro Art',
  `JBerDatum` date DEFAULT NULL COMMENT 'Datum der Nachführung',
  `JBerBearb` int(10) DEFAULT NULL COMMENT 'BerichtsverfasserIn: Auswahl aus der Tabelle "tblAdresse"',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`JBerId`),
  KEY `ApArtId` (`ApArtId`),
  KEY `ApBerBeurteilung` (`JBerBeurteilung`),
  KEY `ApBerBearb` (`JBerBearb`)
) ENGINE=InnoDB AUTO_INCREMENT=2143994711 DEFAULT CHARSET=utf8 COMMENT='Jahresberichte zu den APs';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblJBerUebersicht`
--

DROP TABLE IF EXISTS `tblJBerUebersicht`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblJBerUebersicht` (
  `JbuJahr` smallint(5) NOT NULL COMMENT 'Berichtsjahr. Primärschlüssel der Tabelle "tblJBerUebersicht"',
  `JbuBemerkungen` longtext COMMENT 'Bemerkungen zur Artübersicht',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`JbuJahr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Bemerkungen zur Artübersicht im Jahresbericht';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblKonstanten`
--

DROP TABLE IF EXISTS `tblKonstanten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblKonstanten` (
  `KonstId` int(10) NOT NULL AUTO_INCREMENT,
  `JBerJahr` smallint(5) DEFAULT NULL COMMENT 'Von Access aus ein Berichtsjahr wählen, um die Erstellung des Jahresberichts zu beschleunigen',
  `ApArtId` int(10) DEFAULT NULL COMMENT 'Von Access aus eine Art wählen, um views zu beschleunigen',
  PRIMARY KEY (`KonstId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='Hilfstabelle, um Werte von Access an Views zu übergeben';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblPop`
--

DROP TABLE IF EXISTS `tblPop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblPop` (
  `PopId` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Primärschlüssel der Tabelle "tblPopulation"',
  `ApArtId` int(10) DEFAULT NULL COMMENT 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "tblAktionsplan"',
  `PopNr` int(10) DEFAULT NULL COMMENT 'Nummer der Population',
  `PopName` varchar(150) DEFAULT NULL COMMENT 'Bezeichnung der Population',
  `PopHerkunft` int(10) DEFAULT NULL COMMENT 'Herkunft der Population: autochthon oder angesiedelt? Auswahl aus der Tabelle "DomainPopHerkunft"',
  `PopHerkunftUnklar` tinyint(1) DEFAULT NULL COMMENT '1 = die Herkunft der Population ist unklar',
  `PopHerkunftUnklarBegruendung` varchar(255) DEFAULT NULL COMMENT 'Begründung, wieso die Herkunft unklar ist',
  `PopBekanntSeit` smallint(5) DEFAULT NULL COMMENT 'Seit wann ist die Population bekannt?',
  `PopXKoord` int(10) DEFAULT NULL COMMENT 'Wird in der Regel von einer Teilpopulation übernommen',
  `PopYKoord` int(10) DEFAULT NULL COMMENT 'Wird in der Regel von einer Teilpopulation übernommen',
  `PopGuid` varchar(40) DEFAULT NULL COMMENT 'GUID der Population',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`PopId`),
  KEY `ApArtId` (`ApArtId`),
  KEY `PopGuid` (`PopGuid`),
  KEY `PopHerkunft` (`PopHerkunft`),
  KEY `PopXKoord` (`PopXKoord`,`PopYKoord`),
  KEY `popykoord` (`PopYKoord`)
) ENGINE=InnoDB AUTO_INCREMENT=2146169907 DEFAULT CHARSET=utf8 COMMENT='Informationen zu Populationen';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER newguidp
  BEFORE INSERT
  ON tblPop
  FOR EACH ROW
  set new.PopGuid = UUID() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tblPopBer`
--

DROP TABLE IF EXISTS `tblPopBer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblPopBer` (
  `PopBerId` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Primärschlüssel der Tabelle "tblPopBericht"',
  `PopId` int(10) DEFAULT NULL COMMENT 'Zugehörige Population. Fremdschlüssel aus der Tabelle "tblPopulation"',
  `PopBerJahr` smallint(5) DEFAULT NULL COMMENT 'Für welches Jahr gilt der Bericht?',
  `PopBerEntwicklung` int(10) DEFAULT NULL COMMENT 'Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "DomainPopEntwicklung"',
  `PopBerTxt` longtext COMMENT 'Bemerkungen zur Beurteilung',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`PopBerId`),
  KEY `PopId` (`PopId`),
  KEY `PopBerEntwicklung` (`PopBerEntwicklung`)
) ENGINE=InnoDB AUTO_INCREMENT=2146903839 DEFAULT CHARSET=utf8 COMMENT='Berichte über die Entwicklung von Populationen';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblPopMassnBer`
--

DROP TABLE IF EXISTS `tblPopMassnBer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblPopMassnBer` (
  `PopMassnBerId` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Primärschlüssel der Tabelle "tblPopMassnBericht"',
  `PopId` int(10) DEFAULT NULL COMMENT 'Zugehörige Population. Fremdschlüssel aus der Tabelle "tblPopulation"',
  `PopMassnBerJahr` smallint(5) DEFAULT NULL COMMENT 'Für welches Jahr gilt der Bericht?',
  `PopMassnBerErfolgsbeurteilung` int(10) DEFAULT NULL COMMENT 'Wie wird die Wirkung aller im Rahmen des AP durchgeführten Massnahmen beurteilt?',
  `PopMassnBerTxt` longtext COMMENT 'Bemerkungen zur Beurteilung',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`PopMassnBerId`),
  KEY `PopId` (`PopId`),
  KEY `PopMassnBerErfolgsbeurteilung` (`PopMassnBerErfolgsbeurteilung`)
) ENGINE=InnoDB AUTO_INCREMENT=2143137343 DEFAULT CHARSET=utf8 COMMENT='Berichte über den Erfolg von Massnahmen';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblTPop`
--

DROP TABLE IF EXISTS `tblTPop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblTPop` (
  `TPopId` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Primärschlüssel der Tabelle "tblTeilpopulation"',
  `PopId` int(10) DEFAULT NULL COMMENT 'Zugehörige Population. Fremdschlüssel aus der Tabelle "tblPopulation"',
  `TPopNr` int(10) DEFAULT NULL COMMENT 'Nummer der Teilpopulation',
  `TPopGemeinde` varchar(255) DEFAULT NULL COMMENT 'Gemeinde',
  `TPopFlurname` varchar(255) DEFAULT NULL COMMENT 'Flurname',
  `TPopXKoord` int(10) DEFAULT NULL COMMENT 'X-Koordinate',
  `TPopYKoord` int(10) DEFAULT NULL COMMENT 'Y-Koordinate',
  `TPopRadius` smallint(5) DEFAULT NULL COMMENT 'Radius der Teilpopulation (m)',
  `TPopHoehe` smallint(5) DEFAULT NULL COMMENT 'Höhe über Meer (m)',
  `TPopExposition` varchar(50) DEFAULT NULL COMMENT 'Exposition / Besonnung des Standorts',
  `TPopKlima` varchar(50) DEFAULT NULL COMMENT 'Klima des Standorts',
  `TPopNeigung` varchar(50) DEFAULT NULL COMMENT 'Hangneigung des Standorts',
  `TPopBeschr` varchar(255) DEFAULT NULL COMMENT 'Beschreibung der Fläche',
  `TPopKatNr` varchar(255) DEFAULT NULL COMMENT 'Kataster-Nummer',
  `TPopHerkunft` int(10) DEFAULT NULL COMMENT 'Herkunft der Teilpopulation. Auswahl aus Tabelle "DomainPopHerkunft"',
  `TPopHerkunftUnklar` tinyint(1) DEFAULT NULL COMMENT 'Ist der Status der Teilpopulation unklar? (es bestehen keine glaubwuerdigen Beboachtungen)',
  `TPopHerkunftUnklarBegruendung` varchar(255) DEFAULT NULL COMMENT 'Wieso ist der Status unklar?',
  `TPopApBerichtRelevant` int(10) DEFAULT NULL COMMENT 'Ist die Teilpopulation für den AP-Bericht relevant? Auswahl aus der Tabelle "DomainTPopApBerichtRelevant"',
  `TPopBekanntSeit` smallint(5) DEFAULT NULL COMMENT 'Seit wann ist die Teilpopulation bekannt?',
  `TPopEigen` varchar(255) DEFAULT NULL COMMENT 'EigentümerIn',
  `TPopKontakt` varchar(255) DEFAULT NULL COMMENT 'Kontaktperson vor Ort',
  `TPopNutzungszone` varchar(255) DEFAULT NULL COMMENT 'Nutzungszone',
  `TPopBewirtschafterIn` varchar(255) DEFAULT NULL COMMENT 'Wer bewirtschaftet die Fläche?',
  `TPopBewirtschaftung` varchar(255) DEFAULT NULL COMMENT 'Wie wird die Fläche bewirtschaftet?',
  `TPopTxt` longtext COMMENT 'Bemerkungen zur Teilpopulation',
  `TPopGuid` varchar(40) DEFAULT NULL COMMENT 'GUID der Tabelle "tblTeilpopulation"',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`TPopId`),
  KEY `PopId` (`PopId`),
  KEY `TPopGuid` (`TPopGuid`),
  KEY `TPopHerkunft` (`TPopHerkunft`),
  KEY `TPopApBerichtRelevant` (`TPopApBerichtRelevant`),
  KEY `xkoord` (`TPopXKoord`),
  KEY `ykoord` (`TPopYKoord`)
) ENGINE=InnoDB AUTO_INCREMENT=2146452918 DEFAULT CHARSET=utf8 COMMENT='Angaben zu Teilpopulationen';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER newguidtp
  BEFORE INSERT
  ON tblTPop
  FOR EACH ROW
  set new.TPopGuid = UUID() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tblTPopBer`
--

DROP TABLE IF EXISTS `tblTPopBer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblTPopBer` (
  `TPopBerId` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Primärschlüssel der Tabelle "tblTeilPopBericht"',
  `TPopId` int(10) DEFAULT NULL COMMENT 'Zugehörige Teilpopulation. Fremdschlüssel der Tabelle "tblTeilpopulation"',
  `TPopBerJahr` smallint(5) DEFAULT NULL COMMENT 'Für welches Jahr gilt der Bericht?',
  `TPopBerEntwicklung` int(10) DEFAULT NULL COMMENT 'Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "DomainPopEntwicklung"',
  `TPopBerTxt` longtext COMMENT 'Bemerkungen zur Beurteilung',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`TPopBerId`),
  KEY `TPopId` (`TPopId`),
  KEY `TPopBerEntwicklung` (`TPopBerEntwicklung`)
) ENGINE=InnoDB AUTO_INCREMENT=2143683943 DEFAULT CHARSET=utf8 COMMENT='Berichte zu Teilpopulationen';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblTPopKontr`
--

DROP TABLE IF EXISTS `tblTPopKontr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblTPopKontr` (
  `TPopKontrId` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Primärschlüssel der Tabelle "tblTeilPopFeldkontrolle"',
  `TPopId` int(10) DEFAULT NULL COMMENT 'Zugehörige Teilpopulation. Fremdschlüssel aus der Tabelle "tblTeilpopulation"',
  `TPopKontrTyp` varchar(50) DEFAULT NULL COMMENT 'Typ der Kontrolle. Auswahl aus Tabelle "DomainTPopFeldkontrTyp"',
  `TPopKontrDatum` date DEFAULT NULL COMMENT 'Wann wurde kontrolliert?',
  `TPopKontrJahr` smallint(5) DEFAULT NULL COMMENT 'In welchem Jahr wurde kontrolliert? Für welches Jahr gilt die Beschreibung?',
  `TPopKontrBearb` int(10) DEFAULT NULL COMMENT 'Wer hat kontrolliert? Auswahl aus Tabelle "tblAdr"',
  `TPopKontrJungpfl` int(10) DEFAULT NULL COMMENT 'Anzahl Jungpflanzen',
  `TPopKontrVitalitaet` varchar(255) DEFAULT NULL COMMENT 'Vitalität der Pflanzen',
  `TPopKontrUeberleb` smallint(5) DEFAULT NULL COMMENT 'Überlebensrate in Prozent',
  `TPopKontrEntwicklung` int(10) DEFAULT NULL COMMENT 'Entwicklung des Bestandes. Auswahl aus Tabelle "DomainTPopEntwicklung"',
  `TPopKontrUrsach` varchar(255) DEFAULT NULL COMMENT 'Ursachen der Entwicklung',
  `TPopKontrUrteil` varchar(255) DEFAULT NULL COMMENT 'Erfolgsbeurteilung',
  `TPopKontrAendUms` varchar(255) DEFAULT NULL COMMENT 'Vorschlag für Änderung der Umsetzung',
  `TPopKontrAendKontr` varchar(255) DEFAULT NULL COMMENT 'Vorschlag für Änderung der Erfolgskontrolle',
  `TPopKontrTxt` longtext COMMENT 'Bemerkungen zur Erfolgskontrolle',
  `TPopKontrLeb` varchar(255) DEFAULT NULL COMMENT 'Lebensraumtyp nach Delarze',
  `TPopKontrFlaeche` int(10) DEFAULT NULL COMMENT 'Fläche der Teilpopulation',
  `TPopKontrLebUmg` varchar(255) DEFAULT NULL COMMENT 'Lebensraumtyp der direkt angrenzenden Umgebung (nach Delarze)',
  `TPopKontrVegTyp` varchar(100) DEFAULT NULL COMMENT 'Vegetationstyp',
  `TPopKontrKonkurrenz` varchar(100) DEFAULT NULL COMMENT 'Konkurrenz',
  `TPopKontrMoosschicht` varchar(100) DEFAULT NULL COMMENT 'Moosschicht',
  `TPopKontrKrautschicht` varchar(100) DEFAULT NULL COMMENT 'Krautschicht',
  `TPopKontrStrauchschicht` varchar(255) DEFAULT NULL COMMENT 'Strauchschicht, ehemals Verbuschung (%)',
  `TPopKontrBaumschicht` varchar(100) DEFAULT NULL COMMENT 'Baumschicht',
  `TPopKontrBodenTyp` varchar(255) DEFAULT NULL COMMENT 'Bodentyp',
  `TPopKontrBodenKalkgehalt` varchar(100) DEFAULT NULL COMMENT 'Kalkgehalt des Bodens',
  `TPopKontrBodenDurchlaessigkeit` varchar(100) DEFAULT NULL COMMENT 'Durchlässigkeit des Bodens',
  `TPopKontrBodenHumus` varchar(100) DEFAULT NULL COMMENT 'Humusgehalt des Bodens',
  `TPopKontrBodenNaehrstoffgehalt` varchar(100) DEFAULT NULL COMMENT 'Nährstoffgehalt des Bodens',
  `TPopKontrBodenAbtrag` varchar(255) DEFAULT NULL COMMENT 'Oberbodenabtrag',
  `TPopKontrWasserhaushalt` varchar(255) DEFAULT NULL COMMENT 'Wasserhaushalt',
  `TPopKontrIdealBiotopUebereinst` int(10) DEFAULT NULL COMMENT 'Übereinstimmung mit dem Idealbiotop',
  `TPopKontrHandlungsbedarf` longtext COMMENT 'Handlungsbedarf bezüglich Biotop',
  `TPopKontrUebFlaeche` int(10) DEFAULT NULL COMMENT 'Überprüfte Fläche in m2. Nur für Freiwilligen-Erfolgskontrolle',
  `TPopKontrPlan` tinyint(1) DEFAULT NULL COMMENT 'Fläche / Wuchsort auf Plan eingezeichnet? Nur für Freiwilligen-Erfolgskontrolle',
  `TPopKontrVeg` smallint(5) DEFAULT NULL COMMENT 'Von Pflanzen, Streu oder Moos bedeckter Boden (%). Nur für Freiwilligen- Erfolgskontrolle',
  `TPopKontrNaBo` smallint(5) DEFAULT NULL COMMENT 'Flächenanteil nackter Boden (%). Nur für Freiwilligen-Erfolgskontrolle',
  `TPopKontrUebPfl` smallint(5) DEFAULT NULL COMMENT 'Flächenanteil der überprüften Pflanzenart (%). Nur für Freiwilligen-Erfolgskontrolle',
  `TPopKontrJungPflJN` tinyint(1) DEFAULT NULL COMMENT 'Gibt es neben alten Pflanzen auch junge? Nur für Freiwilligen-Erfolgskontrolle',
  `TPopKontrVegHoeMax` smallint(5) DEFAULT NULL COMMENT 'Maximale Vegetationshöhe in cm. Nur für Freiwilligen-Erfolgskontrolle',
  `TPopKontrVegHoeMit` smallint(5) DEFAULT NULL COMMENT 'Mittlere Vegetationshöhe in cm. Nur für Freiwilligen-Erfolgskontrolle',
  `TPopKontrGefaehrdung` varchar(255) DEFAULT NULL COMMENT 'Gefährdung. Nur für Freiwilligen-Erfolgskontrolle',
  `TPopKontrMutDat` datetime DEFAULT NULL COMMENT 'Letzte Mutation. Wird benötigt, um zu klären, welche Daten in den nationalen Kreislauf exportiert werden sollen',
  `TPopKontrGuid` varchar(40) DEFAULT NULL COMMENT 'GUID. Wird u.a. verwendet für die Identifikation der Beobachtung im nationalen Beobachtungs-Daten-Kreislauf',
  `ZeitGuid` varchar(40) DEFAULT NULL COMMENT 'GUID für den Export von Zeiten in EvAB',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`TPopKontrId`),
  KEY `TPopId` (`TPopId`),
  KEY `TPopKontrBearb` (`TPopKontrBearb`),
  KEY `TPopKontrEntwicklung` (`TPopKontrEntwicklung`),
  KEY `DomainTPopKontrIdBiotUebereinst` (`TPopKontrIdealBiotopUebereinst`)
) ENGINE=InnoDB AUTO_INCREMENT=7916 DEFAULT CHARSET=utf8 COMMENT='Feldkontrollen von Teilpopulationen';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER newguidtpf
  BEFORE INSERT
  ON tblTPopKontr
  FOR EACH ROW
  set new.TPopKontrGuid = UUID() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tblTPopKontrZaehl`
--

DROP TABLE IF EXISTS `tblTPopKontrZaehl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblTPopKontrZaehl` (
  `TPopKontrZaehlId` int(11) NOT NULL AUTO_INCREMENT,
  `TPopKontrId` int(10) DEFAULT NULL,
  `Anzahl` int(10) DEFAULT NULL COMMENT 'Anzahl Zaehleinheiten',
  `Zaehleinheit` int(10) DEFAULT NULL COMMENT 'Verwendete Zaehleinheit. Auswahl aus Tabelle domTPopKontrZaehleinheit',
  `Methode` int(10) DEFAULT NULL COMMENT 'Verwendete Methodik. Auswahl aus Tabelle domTPopKontrMethode',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`TPopKontrZaehlId`),
  KEY `TPopKontrId` (`TPopKontrId`),
  KEY `Anzahl` (`Anzahl`),
  KEY `Zaehleinheit` (`Zaehleinheit`),
  KEY `Methode` (`Methode`)
) ENGINE=InnoDB AUTO_INCREMENT=13348 DEFAULT CHARSET=utf8 COMMENT='Zaehlungen fuer Kontrollen';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblTPopMassn`
--

DROP TABLE IF EXISTS `tblTPopMassn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblTPopMassn` (
  `TPopMassnId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primärschlüssel der Tabelle "tblTeilPopMassnahme"',
  `TPopId` int(10) DEFAULT NULL COMMENT 'Zugehörige Teilpopulation. Fremdschlüssel aus der Tabelle "tblTeilpopulation"',
  `TPopMassnTyp` int(10) DEFAULT NULL COMMENT 'Typ der Massnahme. Auswahl aus Tabelle "DomainTPopMassnTyp"',
  `TPopMassnTxt` varchar(255) DEFAULT NULL COMMENT 'Was wurde gemacht? V.a. für Typ "Spezial"',
  `TPopMassnJahr` smallint(5) DEFAULT NULL COMMENT 'Jahr, in dem die Massnahme durchgeführt wurde',
  `TPopMassnDatum` date DEFAULT NULL COMMENT 'Datum, an dem die Massnahme durchgeführt wurde',
  `TPopMassnBearb` int(10) DEFAULT NULL COMMENT 'Verantwortliche BearbeiterIn. Auswahl aus Tabelle "tblAdresse"',
  `TPopMassnBemTxt` longtext COMMENT 'Bemerkungen zur Massnahme',
  `TPopMassnPlan` tinyint(1) DEFAULT NULL COMMENT 'Existiert ein Plan?',
  `TPopMassnPlanBez` varchar(255) DEFAULT NULL COMMENT 'Bezeichnung auf dem Plan',
  `TPopMassnFlaeche` int(10) DEFAULT NULL COMMENT 'Fläche der Massnahme bzw. Teilpopulation (m2)',
  `TPopMassnMarkierung` varchar(255) DEFAULT NULL COMMENT 'Markierung der Massnahme bzw. Teilpopulation',
  `TPopMassnAnsiedAnzTriebe` int(10) DEFAULT NULL COMMENT 'Anzahl angesiedelte Triebe',
  `TPopMassnAnsiedAnzPfl` int(10) DEFAULT NULL COMMENT 'Anzahl angesiedelte Pflanzen',
  `TPopMassnAnzPflanzstellen` int(10) DEFAULT NULL COMMENT 'Anzahl Töpfe/Pflanzstellen',
  `TPopMassnAnsiedWirtspfl` varchar(255) DEFAULT NULL COMMENT 'Wirtspflanze',
  `TPopMassnAnsiedHerkunftPop` varchar(255) DEFAULT NULL COMMENT 'Aus welcher Population stammt das Pflanzenmaterial?',
  `TPopMassnAnsiedDatSamm` varchar(50) DEFAULT NULL COMMENT 'Datum, an dem die angesiedelten Pflanzen gesammelt wurden',
  `TPopMassnAnsiedForm` varchar(255) DEFAULT NULL COMMENT 'Form, Grösse der Ansiedlung',
  `TPopMassnAnsiedPflanzanordnung` varchar(255) DEFAULT NULL COMMENT 'Anordnung der Pflanzung',
  `TPopMassnGuid` varchar(40) DEFAULT NULL COMMENT 'GUID der Tabelle "tblTeilPopMassnahme"',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`TPopMassnId`),
  UNIQUE KEY `guid` (`TPopMassnGuid`),
  KEY `TPopId` (`TPopId`),
  KEY `TPopMassnBearb` (`TPopMassnBearb`),
  KEY `TPopMassnTyp` (`TPopMassnTyp`)
) ENGINE=InnoDB AUTO_INCREMENT=2145293818 DEFAULT CHARSET=utf8 COMMENT='Massnahmen in Teilpopulationen';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER newguidtpm
  BEFORE INSERT
  ON tblTPopMassn
  FOR EACH ROW
  set new.TPopMassnGuid = UUID() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tblTPopMassnBer`
--

DROP TABLE IF EXISTS `tblTPopMassnBer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblTPopMassnBer` (
  `TPopMassnBerId` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Primärschlüssel der Tabelle "tblTeilPopMassnBericht"',
  `TPopId` int(10) DEFAULT NULL COMMENT 'Zugehörige Teilpopulation. Fremdschlüssel aus Tabelle "tblTeilpopulation"',
  `TPopMassnBerJahr` smallint(5) DEFAULT NULL COMMENT 'Jahr, für den der Bericht gilt',
  `TPopMassnBerErfolgsbeurteilung` int(10) DEFAULT NULL COMMENT 'Beurteilung des Erfolgs. Auswahl aus Tabelle "DomainTPopMassnErfolgsbeurteilung"',
  `TPopMassnBerTxt` longtext COMMENT 'Bemerkungen zur Beurteilung',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`TPopMassnBerId`),
  KEY `TPopId` (`TPopId`),
  KEY `TPopMassnBerErfolgsbeurteilung` (`TPopMassnBerErfolgsbeurteilung`)
) ENGINE=InnoDB AUTO_INCREMENT=2139936280 DEFAULT CHARSET=utf8 COMMENT='Berichte zu Teilpopulations-Massnahmen';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblUser`
--

DROP TABLE IF EXISTS `tblUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblUser` (
  `UserId` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Primärschlüssel der Tabelle "tblUser"',
  `UserName` varchar(30) NOT NULL COMMENT 'Username',
  `Passwort` text NOT NULL COMMENT 'Passwort',
  `NurLesen` tinyint(1) DEFAULT '-1' COMMENT 'Hier -1 setzen, wenn ein User keine Daten ändern darf',
  PRIMARY KEY (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8 COMMENT='Benutzer und ihre Rechte';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblZiel`
--

DROP TABLE IF EXISTS `tblZiel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblZiel` (
  `ZielId` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Primärschlüssel der Tabelle "tblZiel"',
  `ApArtId` int(10) DEFAULT NULL COMMENT 'Zugehöriger Aktionsplan. Fremdschluessel aus der Tabelle "tblAktionsplan"',
  `ZielTyp` int(10) DEFAULT NULL COMMENT 'Typ des Ziels. Z.B. Zwischenziel, Gesamtziel. Auswahl aus Tabelle "DomainZielTyp"',
  `ZielJahr` smallint(5) DEFAULT NULL COMMENT 'In welchem Jahr soll das Ziel erreicht werden?',
  `ZielBezeichnung` longtext COMMENT 'Textliche Beschreibung des Ziels',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`ZielId`),
  KEY `ApArtId` (`ApArtId`),
  KEY `ZielTyp` (`ZielTyp`)
) ENGINE=InnoDB AUTO_INCREMENT=2125273586 DEFAULT CHARSET=utf8 COMMENT='AP-Ziele';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblZielBer`
--

DROP TABLE IF EXISTS `tblZielBer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblZielBer` (
  `ZielBerId` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Primärschlüssel der Tabelle "tblZielBericht"',
  `ZielId` int(10) DEFAULT NULL COMMENT 'Zugehöriges Ziel. Fremdschlüssel aus der Tabelle "tblZiel"',
  `ZielBerJahr` smallint(5) DEFAULT NULL COMMENT 'Für welches Jahr gilt der Bericht?',
  `ZielBerErreichung` varchar(255) DEFAULT NULL COMMENT 'Beurteilung der Zielerreichung',
  `ZielBerTxt` varchar(255) DEFAULT NULL COMMENT 'Bemerkungen zur Zielerreichung',
  `MutWann` date DEFAULT NULL COMMENT 'Wann wurde der Datensatz zuletzt geändert?',
  `MutWer` varchar(20) DEFAULT NULL COMMENT 'Von wem wurde der Datensatz zuletzt geändert?',
  PRIMARY KEY (`ZielBerId`),
  KEY `ZielId` (`ZielId`)
) ENGINE=InnoDB AUTO_INCREMENT=2137503166 DEFAULT CHARSET=utf8 COMMENT='Berichte über AP-Ziele';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-12-15 12:48:31
