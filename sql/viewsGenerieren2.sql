/*
 * diese Views hängen von anderen ab, die in viewsGenerieren.sql erstellt werden
 * daher muss diese Date NACH viewsGenerieren.sql ausgeführt werden
 */

CREATE OR REPLACE VIEW v_ap_massnjahre AS
SELECT apflora.ap.ApArtId, apflora_views.v_massn_jahre.TPopMassnJahr 
FROM apflora.ap, apflora_views.v_massn_jahre 
WHERE apflora.ap.ApArtId>0 AND apflora.ap.ApStatus Between 1 And 3 
ORDER BY apflora.ap.ApArtId, apflora_views.v_massn_jahre.TPopMassnJahr;

CREATE OR REPLACE VIEW v_ap_anzmassnprojahr AS 
SELECT apflora_views.v_ap_massnjahre.ApArtId, apflora_views.v_ap_massnjahre.TPopMassnJahr, IF(apflora_views.v_ap_anzmassnprojahr0.AnzahlvonTPopMassnId Is Not Null, apflora_views.v_ap_anzmassnprojahr0.AnzahlvonTPopMassnId,0) AS "AnzahlMassnahmen" 
FROM apflora_views.v_ap_massnjahre LEFT JOIN apflora_views.v_ap_anzmassnprojahr0 ON (apflora_views.v_ap_massnjahre.TPopMassnJahr = apflora_views.v_ap_anzmassnprojahr0.TPopMassnJahr) AND (apflora_views.v_ap_massnjahre.ApArtId = apflora_views.v_ap_anzmassnprojahr0.ApArtId) 
ORDER BY apflora_views.v_ap_massnjahre.ApArtId, apflora_views.v_ap_massnjahre.TPopMassnJahr;

#im Gebrauch durch exportPopMitMassnberAnzMassn.php:
CREATE OR REPLACE VIEW v_popmassnber_anzmassn AS
SELECT apflora_beob.adb_eigenschaften.TaxonomieId AS ApArtId, apflora_beob.adb_eigenschaften.Artname AS "AP Art", apflora.ap_bearbstand_werte.DomainTxt AS "AP Status", apflora.ap.ApJahr AS "AP Start im Jahr", apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung", apflora.pop.PopGuid AS "Pop Guid", apflora.pop.PopNr AS "Pop Nr", apflora.pop.PopName AS "Pop Name", pop_status_werte.HerkunftTxt AS "Pop Status", apflora.pop.PopBekanntSeit AS "Pop bekannt seit", apflora.pop.PopHerkunftUnklar AS "Pop Status unklar", apflora.pop.PopHerkunftUnklarBegruendung AS "Pop Begruendung fuer unklaren Status", apflora_views.v_popmassnber_anzmassn0.PopMassnBerJahr AS "MassnBer Jahr", apflora_views.v_popmassnber_anzmassn0.AnzahlvonTPopMassnId AS "Anz Massnahmen in diesem Jahr"
FROM (((((apflora_beob.adb_eigenschaften INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId) INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId) LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode) LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode) LEFT JOIN apflora.pop_status_werte ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId) INNER JOIN apflora_views.v_popmassnber_anzmassn0 ON apflora.pop.PopId = apflora_views.v_popmassnber_anzmassn0.PopId
ORDER BY apflora_beob.adb_eigenschaften.Artname, apflora.pop.PopNr, apflora_views.v_popmassnber_anzmassn0.PopMassnBerJahr;

CREATE OR REPLACE VIEW v_ap_anzmassnbisjahr AS
SELECT apflora_views.v_ap_massnjahre.ApArtId, apflora_views.v_ap_massnjahre.TPopMassnJahr, Sum(apflora_views.v_ap_anzmassnprojahr.AnzahlMassnahmen) AS "AnzahlMassnahmen" 
FROM apflora_views.v_ap_massnjahre INNER JOIN apflora_views.v_ap_anzmassnprojahr ON apflora_views.v_ap_massnjahre.ApArtId = apflora_views.v_ap_anzmassnprojahr.ApArtId 
WHERE apflora_views.v_ap_anzmassnprojahr.TPopMassnJahr<=apflora_views.v_ap_massnjahre.TPopMassnJahr 
GROUP BY apflora_views.v_ap_massnjahre.ApArtId, apflora_views.v_ap_massnjahre.TPopMassnJahr 
ORDER BY apflora_views.v_ap_massnjahre.ApArtId, apflora_views.v_ap_massnjahre.TPopMassnJahr;

CREATE OR REPLACE VIEW v_ap_apberundmassn AS
SELECT apflora.ap.ApArtId, apflora_beob.adb_eigenschaften.Artname AS Art, apflora.ap_bearbstand_werte.DomainTxt AS "AP Status", apflora.ap.ApJahr AS "AP Start im Jahr", apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung", apflora.adresse.AdrName AS "AP Verantwortlich", apflora.ap.ApArtwert AS Artwert, apflora_views.v_ap_anzmassnprojahr.TPopMassnJahr AS Jahr, apflora_views.v_ap_anzmassnprojahr.AnzahlMassnahmen AS "Anzahl Massnahmen", apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen AS "Anzahl Massnahmen bisher", IF(apflora.apber.JBerJahr>0,"Ja","Nein") AS "Bericht erstellt"
FROM ((((((apflora_beob.adb_eigenschaften INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId) LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode) LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode) LEFT JOIN apflora.adresse ON apflora.ap.ApBearb = apflora.adresse.AdrId) INNER JOIN apflora_views.v_ap_anzmassnprojahr ON apflora.ap.ApArtId = apflora_views.v_ap_anzmassnprojahr.ApArtId) INNER JOIN apflora_views.v_ap_anzmassnbisjahr ON (apflora_views.v_ap_anzmassnprojahr.TPopMassnJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr) AND (apflora_views.v_ap_anzmassnprojahr.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId)) LEFT JOIN apflora.apber ON (apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr = apflora.apber.JBerJahr) AND (apflora_views.v_ap_anzmassnbisjahr.ApArtId = apflora.apber.ApArtId)
ORDER BY apflora_beob.adb_eigenschaften.Artname, apflora_views.v_ap_anzmassnprojahr.TPopMassnJahr;

CREATE OR REPLACE VIEW v_tpop_letztermassnber AS
SELECT apflora_views.v_tpop_letztermassnber0.ApArtId, apflora_views.v_tpop_letztermassnber0.TPopId, Max(apflora_views.v_tpop_letztermassnber0.TPopMassnBerJahr) AS MaxvonTPopMassnBerJahr
FROM apflora_views.v_tpop_letztermassnber0
GROUP BY apflora_views.v_tpop_letztermassnber0.ApArtId, apflora_views.v_tpop_letztermassnber0.TPopId;

CREATE OR REPLACE VIEW v_tpop_letzterpopber AS 
SELECT apflora_views.v_tpop_letzterpopber0.ApArtId, apflora_views.v_tpop_letzterpopber0.TPopId, Max(apflora_views.v_tpop_letzterpopber0.TPopBerJahr) AS MaxvonTPopBerJahr
FROM apflora_views.v_tpop_letzterpopber0
GROUP BY apflora_views.v_tpop_letzterpopber0.ApArtId, apflora_views.v_tpop_letzterpopber0.TPopId;

CREATE OR REPLACE VIEW v_pop_letztermassnber AS 
SELECT apflora_views.v_pop_letztermassnber0.ApArtId, apflora_views.v_pop_letztermassnber0.PopId, Max(apflora_views.v_pop_letztermassnber0.PopMassnBerJahr) AS MaxvonPopMassnBerJahr
FROM apflora_views.v_pop_letztermassnber0
GROUP BY apflora_views.v_pop_letztermassnber0.ApArtId, apflora_views.v_pop_letztermassnber0.PopId;

CREATE OR REPLACE VIEW v_pop_letzterpopber AS
SELECT apflora_views.v_pop_letzterpopber0.ApArtId, apflora_views.v_pop_letzterpopber0.PopId, Max(apflora_views.v_pop_letzterpopber0.PopBerJahr) AS MaxvonPopBerJahr
FROM apflora_views.v_pop_letzterpopber0
GROUP BY apflora_views.v_pop_letzterpopber0.ApArtId, apflora_views.v_pop_letzterpopber0.PopId;

CREATE OR REPLACE VIEW v_apber_uebe AS 
SELECT apflora.apber.*, apflora_beob.adb_eigenschaften.Artname, IF(apflora_beob.adb_eigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, apflora_beob.adb_eigenschaften.KefKontrolljahr, IF(Round((apflora._variable.JBerJahr-apflora_beob.adb_eigenschaften.KefKontrolljahr)/4,0)=(apflora._variable.JBerJahr-apflora_beob.adb_eigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, apflora_beob.adb_eigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(apflora_beob.adb_eigenschaften.FnsJahresartJahr=apflora._variable.JBerJahr,"Ja","") AS FnsJahrespflanze2, apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen
FROM apflora._variable AS tblKonstanten_1 INNER JOIN ((apflora_beob.adb_eigenschaften INNER JOIN (apflora.ap INNER JOIN apflora_views.v_ap_apberrelevant ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId) ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId) INNER JOIN (apflora._variable INNER JOIN (apflora.apber INNER JOIN apflora_views.v_ap_anzmassnbisjahr ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId) ON apflora._variable.JBerJahr = apflora.apber.JBerJahr) ON apflora.ap.ApArtId = apflora.apber.ApArtId) ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr 
WHERE apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen>0 AND apflora.apber.JBerBeurteilung=1 AND apflora.ap.ApStatus Between 1 And 3
ORDER BY apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uebkm AS 
SELECT apflora_beob.adb_eigenschaften.Artname, IF(apflora_beob.adb_eigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, IF(Round((apflora._variable.JBerJahr-apflora_beob.adb_eigenschaften.KefKontrolljahr)/4,0)=(apflora._variable.JBerJahr-apflora_beob.adb_eigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, apflora_beob.adb_eigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(apflora_beob.adb_eigenschaften.FnsJahresartJahr=apflora._variable.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM (apflora_beob.adb_eigenschaften INNER JOIN ((apflora_views.v_ap_anzmassnbisjahr AS vApAnzMassnBisJahr_1 INNER JOIN apflora.ap ON vApAnzMassnBisJahr_1.ApArtId = apflora.ap.ApArtId) INNER JOIN apflora_views.v_ap_apberrelevant ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId) ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId) INNER JOIN (apflora.apber INNER JOIN apflora._variable ON apflora.apber.JBerJahr = apflora._variable.JBerJahr) ON (apflora._variable.JBerJahr = vApAnzMassnBisJahr_1.TPopMassnJahr) AND (apflora.ap.ApArtId = apflora.apber.ApArtId)
WHERE apflora.ap.ApStatus Between 1 And 3 AND vApAnzMassnBisJahr_1.AnzahlMassnahmen="0"
ORDER BY apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uebma AS 
SELECT apflora_beob.adb_eigenschaften.Artname, apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen
FROM apflora._variable INNER JOIN ((apflora_beob.adb_eigenschaften INNER JOIN (apflora.ap INNER JOIN apflora_views.v_ap_apberrelevant ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId) ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId) INNER JOIN apflora_views.v_ap_anzmassnbisjahr ON apflora.ap.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId) ON apflora._variable.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen>0 AND apflora.ap.ApStatus Between 1 And 3
ORDER BY apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uebme AS
SELECT apflora.apber.*, apflora_beob.adb_eigenschaften.Artname, IF("KefArt"=-1,"Ja","") AS FnsKefArt2, IF(Round((apflora._variable.JBerJahr-"KefKontrolljahr")/4,0)=(apflora._variable.JBerJahr-"KefKontrolljahr")/4,"Ja","") AS FnsKefKontrJahr2, apflora_beob.adb_eigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(apflora_beob.adb_eigenschaften.FnsJahresartJahr=apflora._variable.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM apflora._variable AS tblKonstanten_1 INNER JOIN ((apflora_beob.adb_eigenschaften INNER JOIN (apflora.ap INNER JOIN apflora_views.v_ap_apberrelevant ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId) ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId) INNER JOIN ((apflora.apber INNER JOIN apflora_views.v_ap_anzmassnbisjahr ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId) INNER JOIN apflora._variable ON apflora.apber.JBerJahr = apflora._variable.JBerJahr) ON apflora.ap.ApArtId = apflora.apber.ApArtId) ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE apflora.apber.JBerBeurteilung=5 AND apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen>0 AND apflora.ap.ApStatus Between 1 And 3
ORDER BY apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uebne AS
SELECT apflora.apber.*, apflora_beob.adb_eigenschaften.Artname, IF(apflora_beob.adb_eigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, IF(Round((apflora._variable.JBerJahr-apflora_beob.adb_eigenschaften.KefKontrolljahr)/4,0)=(apflora._variable.JBerJahr-apflora_beob.adb_eigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, apflora_beob.adb_eigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(apflora_beob.adb_eigenschaften.FnsJahresartJahr=apflora._variable.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM apflora._variable AS tblKonstanten_1 INNER JOIN ((apflora_beob.adb_eigenschaften INNER JOIN (apflora.ap INNER JOIN apflora_views.v_ap_apberrelevant ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId) ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId) INNER JOIN ((apflora.apber INNER JOIN apflora_views.v_ap_anzmassnbisjahr ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId) INNER JOIN apflora._variable ON apflora.apber.JBerJahr = apflora._variable.JBerJahr) ON apflora.ap.ApArtId = apflora.apber.ApArtId) ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE apflora.apber.JBerBeurteilung=3 AND apflora.ap.ApStatus Between 1 And 3 AND apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen>0
ORDER BY apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uebse AS 
SELECT apflora.apber.*, apflora_beob.adb_eigenschaften.Artname, IF(apflora_beob.adb_eigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, IF(Round((apflora._variable.JBerJahr-apflora_beob.adb_eigenschaften.KefKontrolljahr)/4,0)=(apflora._variable.JBerJahr-apflora_beob.adb_eigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, apflora_beob.adb_eigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(apflora_beob.adb_eigenschaften.FnsJahresartJahr=apflora._variable.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM apflora._variable AS tblKonstanten_1 INNER JOIN ((apflora_beob.adb_eigenschaften INNER JOIN (apflora.ap INNER JOIN apflora_views.v_ap_apberrelevant ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId) ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId) INNER JOIN ((apflora.apber INNER JOIN apflora_views.v_ap_anzmassnbisjahr ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId) INNER JOIN apflora._variable ON apflora.apber.JBerJahr = apflora._variable.JBerJahr) ON apflora.ap.ApArtId = apflora.apber.ApArtId) ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE apflora.apber.JBerBeurteilung=4 AND apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen>0 AND apflora.ap.ApStatus Between 1 And 3
ORDER BY apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uebun AS
SELECT apflora.apber.*, apflora_beob.adb_eigenschaften.Artname, IF(apflora_beob.adb_eigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, IF(Round((apflora._variable.JBerJahr-apflora_beob.adb_eigenschaften.KefKontrolljahr)/4,0)=(apflora._variable.JBerJahr-apflora_beob.adb_eigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, apflora_beob.adb_eigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(apflora_beob.adb_eigenschaften.FnsJahresartJahr=apflora._variable.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM apflora._variable AS tblKonstanten_1 INNER JOIN ((apflora_beob.adb_eigenschaften INNER JOIN (apflora.ap INNER JOIN apflora_views.v_ap_apberrelevant ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId) ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId) INNER JOIN ((apflora.apber INNER JOIN apflora_views.v_ap_anzmassnbisjahr ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId) INNER JOIN apflora._variable ON apflora.apber.JBerJahr = apflora._variable.JBerJahr) ON apflora.ap.ApArtId = apflora.apber.ApArtId) ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE apflora.apber.JBerBeurteilung=1168274204 AND apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen>0 AND apflora.ap.ApStatus Between 1 And 3
ORDER BY apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uebwe AS 
SELECT apflora.apber.*, apflora_beob.adb_eigenschaften.Artname, IF(apflora_beob.adb_eigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, IF(Round((apflora._variable.JBerJahr-apflora_beob.adb_eigenschaften.KefKontrolljahr)/4,0)=(apflora._variable.JBerJahr-apflora_beob.adb_eigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, apflora_beob.adb_eigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(apflora_beob.adb_eigenschaften.FnsJahresartJahr=apflora._variable.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM apflora._variable AS tblKonstanten_1 INNER JOIN ((apflora_beob.adb_eigenschaften INNER JOIN (apflora.ap INNER JOIN apflora_views.v_ap_apberrelevant ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId) ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId) INNER JOIN ((apflora.apber INNER JOIN apflora_views.v_ap_anzmassnbisjahr ON apflora.apber.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId) INNER JOIN apflora._variable ON apflora.apber.JBerJahr = apflora._variable.JBerJahr) ON apflora.ap.ApArtId = apflora.apber.ApArtId) ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE apflora.apber.JBerBeurteilung=6 AND apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen>0 AND apflora.ap.ApStatus Between 1 And 3
ORDER BY apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uebnb000 AS 
SELECT apflora.ap.ApArtId, apflora.apber.JBerJahr
FROM (((apflora.ap INNER JOIN apflora_views.v_ap_anzmassnbisjahr ON apflora.ap.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId) INNER JOIN apflora_views.v_ap_apberrelevant ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId) LEFT JOIN apflora.apber ON apflora.ap.ApArtId = apflora.apber.ApArtId) INNER JOIN apflora._variable ON apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr = apflora._variable.JBerJahr
WHERE apflora.apber.ApArtId Is Null AND apflora.ap.ApStatus Between 1 And 3;

CREATE OR REPLACE VIEW v_apber_uebnb00 AS 
SELECT apflora.ap.ApArtId, apflora.apber.JBerJahr
FROM apflora._variable AS tblKonstanten_1 INNER JOIN (((apflora.ap INNER JOIN apflora_views.v_ap_anzmassnbisjahr ON apflora.ap.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId) INNER JOIN apflora_views.v_ap_apberrelevant ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId) INNER JOIN (apflora.apber INNER JOIN apflora._variable ON apflora.apber.JBerJahr = apflora._variable.JBerJahr) ON apflora.ap.ApArtId = apflora.apber.ApArtId) ON tblKonstanten_1.JBerJahr = apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr
WHERE apflora.ap.ApStatus Between 1 And 3 AND apflora.apber.JBerBeurteilung Is Null;

CREATE OR REPLACE VIEW v_apber_uebnb0 AS 
select ApArtId, JBerJahr from apflora_views.v_apber_uebnb000
UNION select ApArtId, JBerJahr from apflora_views.v_apber_uebnb00;

CREATE OR REPLACE VIEW v_apber_uebnb AS 
SELECT apflora.ap.ApArtId, apflora_beob.adb_eigenschaften.Artname, apflora_views.v_fnskef.FnsKefArt2, apflora_views.v_fnskef.FnsKefKontrJahr2, apflora_beob.adb_eigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(apflora_beob.adb_eigenschaften.FnsJahresartJahr=apflora_views.v_apber_uebnb0.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM ((apflora_beob.adb_eigenschaften INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId) LEFT JOIN apflora_views.v_fnskef ON apflora.ap.ApArtId = apflora_views.v_fnskef.TaxonomieId) INNER JOIN apflora_views.v_apber_uebnb0 ON apflora.ap.ApArtId = apflora_views.v_apber_uebnb0.ApArtId
WHERE apflora.ap.ApStatus Between 1 And 3
ORDER BY apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_uet01 AS 
SELECT apflora.ap.ApArtId, apflora_beob.adb_eigenschaften.Artname
FROM ((apflora_beob.adb_eigenschaften INNER JOIN (apflora.ap INNER JOIN apflora_views.v_ap_apberrelevant ON apflora.ap.ApArtId = apflora_views.v_ap_apberrelevant.ApArtId) ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId) INNER JOIN apflora_views.v_ap_anzmassnbisjahr ON apflora.ap.ApArtId = apflora_views.v_ap_anzmassnbisjahr.ApArtId) INNER JOIN apflora._variable ON apflora_views.v_ap_anzmassnbisjahr.TPopMassnJahr = apflora._variable.JBerJahr
WHERE apflora.ap.ApStatus Between 1 And 3 AND apflora_views.v_ap_anzmassnbisjahr.AnzahlMassnahmen>"0"
ORDER BY apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_tpop_statuswidersprichtbericht AS 
SELECT apflora_beob.adb_eigenschaften.Artname AS Art, apflora.ap_bearbstand_werte.DomainTxt AS "Bearbeitungsstand AP", apflora.pop.PopNr, apflora.pop.PopName, apflora.tpop.TPopNr, apflora.tpop.TPopGemeinde, apflora.tpop.TPopFlurname, apflora.tpop.TPopHerkunft, apflora.tpopber.TPopBerEntwicklung, apflora.tpopber.TPopBerJahr
FROM ((apflora_beob.adb_eigenschaften INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId) INNER JOIN (apflora.pop INNER JOIN (apflora.tpop INNER JOIN (apflora.tpopber INNER JOIN apflora_views.v_tpopber_letzterber ON (apflora.tpopber.TPopId = apflora_views.v_tpopber_letzterber.TPopId) AND (apflora.tpopber.TPopBerJahr = apflora_views.v_tpopber_letzterber.MaxvonTPopBerJahr)) ON apflora.tpop.TPopId = apflora.tpopber.TPopId) ON apflora.pop.PopId = apflora.tpop.PopId) ON apflora.ap.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode
WHERE ((apflora.ap.ApStatus Between 1 And 3) AND (apflora.tpop.TPopHerkunft=101 Or apflora.tpop.TPopHerkunft=202) AND apflora.tpopber.TPopBerEntwicklung<>8) OR ((apflora.ap.ApStatus Between 1 And 3) AND (apflora.tpop.TPopHerkunft Not Like 101 And apflora.tpop.TPopHerkunft Not Like 202) AND apflora.tpopber.TPopBerEntwicklung=8)
ORDER BY apflora_beob.adb_eigenschaften.Artname, apflora.pop.PopNr, apflora.pop.PopName, apflora.tpop.TPopNr, apflora.tpop.TPopGemeinde, apflora.tpop.TPopFlurname;

#im Gebrauch (Access):
CREATE OR REPLACE VIEW v_apber AS 
SELECT apflora.ap.*, apflora_beob.adb_eigenschaften.Artname AS Art, apflora.apber.JBerId, apflora.apber.JBerJahr, apflora.apber.JBerSituation, apflora.apber.JBerVergleichVorjahrGesamtziel, apflora.apber.JBerBeurteilung, apflora.apber.JBerAnalyse, apflora.apber.JBerUmsetzung, apflora.apber.JBerErfko, apflora.apber.JBerATxt, apflora.apber.JBerBTxt, apflora.apber.JBerCTxt, apflora.apber.JBerDTxt, apflora.apber.JBerDatum, apflora.apber.JBerBearb, apflora.adresse.AdrName & ", " & apflora.adresse.AdrAdresse AS Bearbeiter, apflora.apberuebersicht.JbuJahr, apflora.apberuebersicht.JbuBemerkungen, apflora_views.v_erstemassnproap.MinvonTPopMassnJahr AS ErsteMassnahmeImJahr
FROM (apflora_beob.adb_eigenschaften INNER JOIN (apflora.ap LEFT JOIN apflora_views.v_erstemassnproap ON apflora.ap.ApArtId=apflora_views.v_erstemassnproap.ApArtId) ON apflora_beob.adb_eigenschaften.TaxonomieId=apflora.ap.ApArtId) INNER JOIN (((apflora.apber LEFT JOIN apflora.adresse ON apflora.apber.JBerBearb=apflora.adresse.AdrId) LEFT JOIN apflora.apberuebersicht ON apflora.apber.JBerJahr=apflora.apberuebersicht.JbuJahr) INNER JOIN apflora._variable ON apflora.apber.JBerJahr=apflora._variable.JBerJahr) ON apflora.ap.ApArtId=apflora.apber.ApArtId
WHERE apflora.ap.ApStatus Between 1 And 3 AND apflora.ap.ApArtId NOT IN (100, 150)
ORDER BY apflora_beob.adb_eigenschaften.Artname;

CREATE OR REPLACE VIEW v_apber_b2rpop AS 
SELECT apflora.pop.ApArtId, apflora.pop.PopId
FROM ((apflora_views.v_pop_letzterpopber INNER JOIN apflora.pop ON apflora_views.v_pop_letzterpopber.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.popber ON (apflora.pop.PopId = apflora.popber.PopId) AND (apflora_views.v_pop_letzterpopber.PopId = apflora.popber.PopId) AND (apflora_views.v_pop_letzterpopber.MaxvonPopBerJahr = apflora.popber.PopBerJahr)) INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE apflora.popber.PopBerEntwicklung=3 AND apflora.tpop.TPopApBerichtRelevant=1 AND apflora.pop.PopHerkunft <> 300
GROUP BY apflora.pop.ApArtId, apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b3rpop AS
SELECT apflora.pop.ApArtId, apflora.pop.PopId
FROM ((apflora_views.v_pop_letzterpopber INNER JOIN apflora.pop ON apflora_views.v_pop_letzterpopber.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.popber ON (apflora.pop.PopId = apflora.popber.PopId) AND (apflora_views.v_pop_letzterpopber.PopId = apflora.popber.PopId) AND (apflora_views.v_pop_letzterpopber.MaxvonPopBerJahr = apflora.popber.PopBerJahr)) INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE apflora.popber.PopBerEntwicklung=2 AND apflora.tpop.TPopApBerichtRelevant=1 AND apflora.pop.PopHerkunft <> 300
GROUP BY apflora.pop.ApArtId, apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b4rpop AS
SELECT apflora.pop.ApArtId, apflora.pop.PopId
FROM ((apflora_views.v_pop_letzterpopber INNER JOIN apflora.pop ON apflora_views.v_pop_letzterpopber.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.popber ON (apflora.pop.PopId = apflora.popber.PopId) AND (apflora_views.v_pop_letzterpopber.PopId = apflora.popber.PopId) AND (apflora_views.v_pop_letzterpopber.MaxvonPopBerJahr = apflora.popber.PopBerJahr)) INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE apflora.popber.PopBerEntwicklung=1 AND apflora.tpop.TPopApBerichtRelevant=1 AND apflora.pop.PopHerkunft <> 300
GROUP BY apflora.pop.ApArtId, apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b5rpop AS
SELECT apflora.pop.ApArtId, apflora.pop.PopId
FROM ((apflora_views.v_pop_letzterpopber INNER JOIN apflora.pop ON apflora_views.v_pop_letzterpopber.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.popber ON (apflora.pop.PopId = apflora.popber.PopId) AND (apflora_views.v_pop_letzterpopber.PopId = apflora.popber.PopId) AND (apflora_views.v_pop_letzterpopber.MaxvonPopBerJahr = apflora.popber.PopBerJahr)) INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE (apflora.popber.PopBerEntwicklung=4 Or apflora.popber.PopBerEntwicklung=9) AND apflora.tpop.TPopApBerichtRelevant=1 AND apflora.pop.PopHerkunft <> 300
GROUP BY apflora.pop.ApArtId, apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b6rpop AS 
SELECT apflora.pop.ApArtId, apflora.pop.PopId
FROM ((apflora_views.v_pop_letzterpopber INNER JOIN apflora.pop ON apflora_views.v_pop_letzterpopber.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.popber ON (apflora.pop.PopId = apflora.popber.PopId) AND (apflora_views.v_pop_letzterpopber.PopId = apflora.popber.PopId) AND (apflora_views.v_pop_letzterpopber.MaxvonPopBerJahr = apflora.popber.PopBerJahr)) INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE apflora.popber.PopBerEntwicklung=8 AND apflora.tpop.TPopApBerichtRelevant=1 AND apflora.pop.PopHerkunft <> 300
GROUP BY apflora.pop.ApArtId, apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_b2rtpop AS 
SELECT apflora.pop.ApArtId, apflora.tpop.TPopId
FROM apflora.tpop INNER JOIN (apflora.tpopber INNER JOIN (apflora.pop INNER JOIN apflora_views.v_tpop_letzterpopber ON apflora.pop.ApArtId = apflora_views.v_tpop_letzterpopber.ApArtId) ON (apflora.tpopber.TPopId = apflora_views.v_tpop_letzterpopber.TPopId) AND (apflora.tpopber.TPopBerJahr = apflora_views.v_tpop_letzterpopber.MaxvonTPopBerJahr)) ON (apflora.tpop.PopId = apflora.pop.PopId) AND (apflora.tpop.TPopId = apflora.tpopber.TPopId)
WHERE apflora.tpopber.TPopBerEntwicklung=3 AND apflora.tpop.TPopApBerichtRelevant=1 AND apflora.pop.PopHerkunft <> 300
GROUP BY apflora.pop.ApArtId, apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_b3rtpop AS 
SELECT apflora.pop.ApArtId, apflora.tpop.TPopId
FROM apflora.tpop INNER JOIN (apflora.tpopber INNER JOIN (apflora.pop INNER JOIN apflora_views.v_tpop_letzterpopber ON apflora.pop.ApArtId = apflora_views.v_tpop_letzterpopber.ApArtId) ON (apflora.tpopber.TPopId = apflora_views.v_tpop_letzterpopber.TPopId) AND (apflora.tpopber.TPopBerJahr = apflora_views.v_tpop_letzterpopber.MaxvonTPopBerJahr)) ON (apflora.tpop.PopId = apflora.pop.PopId) AND (apflora.tpop.TPopId = apflora.tpopber.TPopId)
WHERE apflora.tpopber.TPopBerEntwicklung=2 AND apflora.tpop.TPopApBerichtRelevant=1 AND apflora.pop.PopHerkunft <> 300
GROUP BY apflora.pop.ApArtId, apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_b4rtpop AS 
SELECT apflora.pop.ApArtId, apflora.tpop.TPopId
FROM apflora.tpop INNER JOIN (apflora.tpopber INNER JOIN (apflora.pop INNER JOIN apflora_views.v_tpop_letzterpopber ON apflora.pop.ApArtId = apflora_views.v_tpop_letzterpopber.ApArtId) ON (apflora.tpopber.TPopId = apflora_views.v_tpop_letzterpopber.TPopId) AND (apflora.tpopber.TPopBerJahr = apflora_views.v_tpop_letzterpopber.MaxvonTPopBerJahr)) ON (apflora.tpop.PopId = apflora.pop.PopId) AND (apflora.tpop.TPopId = apflora.tpopber.TPopId)
WHERE apflora.tpopber.TPopBerEntwicklung=1 AND apflora.tpop.TPopApBerichtRelevant=1 AND apflora.pop.PopHerkunft <> 300
GROUP BY apflora.pop.ApArtId, apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_b5rtpop AS 
SELECT apflora.pop.ApArtId, apflora.tpop.TPopId
FROM apflora.tpop INNER JOIN (apflora.tpopber INNER JOIN (apflora.pop INNER JOIN apflora_views.v_tpop_letzterpopber ON apflora.pop.ApArtId = apflora_views.v_tpop_letzterpopber.ApArtId) ON (apflora.tpopber.TPopId = apflora_views.v_tpop_letzterpopber.TPopId) AND (apflora.tpopber.TPopBerJahr = apflora_views.v_tpop_letzterpopber.MaxvonTPopBerJahr)) ON (apflora.tpop.PopId = apflora.pop.PopId) AND (apflora.tpop.TPopId = apflora.tpopber.TPopId)
WHERE apflora.tpopber.TPopBerEntwicklung=4 AND apflora.tpop.TPopApBerichtRelevant=1 AND apflora.pop.PopHerkunft <> 300
GROUP BY apflora.pop.ApArtId, apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_b6rtpop AS 
SELECT apflora.pop.ApArtId, apflora.tpop.TPopId
FROM apflora.tpop INNER JOIN (apflora.tpopber INNER JOIN (apflora.pop INNER JOIN apflora_views.v_tpop_letzterpopber ON apflora.pop.ApArtId = apflora_views.v_tpop_letzterpopber.ApArtId) ON (apflora.tpopber.TPopId = apflora_views.v_tpop_letzterpopber.TPopId) AND (apflora.tpopber.TPopBerJahr = apflora_views.v_tpop_letzterpopber.MaxvonTPopBerJahr)) ON (apflora.tpop.PopId = apflora.pop.PopId) AND (apflora.tpop.TPopId = apflora.tpopber.TPopId)
WHERE apflora.tpopber.TPopBerEntwicklung=8 AND apflora.tpop.TPopApBerichtRelevant=1 AND apflora.pop.PopHerkunft <> 300
GROUP BY apflora.pop.ApArtId, apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_c1rpop AS 
SELECT apflora.pop.ApArtId, apflora.pop.PopId
FROM apflora._variable, (apflora.pop INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId) INNER JOIN apflora.tpopmassn ON apflora.tpop.TPopId = apflora.tpopmassn.TPopId
WHERE apflora.tpopmassn.TPopMassnJahr<=apflora._variable.JBerJahr AND apflora.tpop.TPopApBerichtRelevant=1 AND apflora.pop.PopHerkunft <> 300
GROUP BY apflora.pop.ApArtId, apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_c3rpop AS 
SELECT apflora.pop.ApArtId, apflora.pop.PopId
FROM (apflora_views.v_pop_letztermassnber INNER JOIN apflora.pop ON apflora_views.v_pop_letztermassnber.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.popmassnber ON (apflora.pop.PopId = apflora.popmassnber.PopId) AND (apflora_views.v_pop_letztermassnber.MaxvonPopMassnBerJahr = apflora.popmassnber.PopMassnBerJahr) AND (apflora_views.v_pop_letztermassnber.PopId = apflora.popmassnber.PopId)
WHERE apflora.popmassnber.PopMassnBerErfolgsbeurteilung=1
GROUP BY apflora.pop.ApArtId, apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_c4rpop AS 
SELECT apflora.pop.ApArtId, apflora.pop.PopId
FROM (apflora_views.v_pop_letztermassnber INNER JOIN apflora.pop ON apflora_views.v_pop_letztermassnber.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.popmassnber ON (apflora.pop.PopId = apflora.popmassnber.PopId) AND (apflora_views.v_pop_letztermassnber.MaxvonPopMassnBerJahr = apflora.popmassnber.PopMassnBerJahr) AND (apflora_views.v_pop_letztermassnber.PopId = apflora.popmassnber.PopId)
WHERE (((apflora.popmassnber.PopMassnBerErfolgsbeurteilung)=2))
GROUP BY apflora.pop.ApArtId, apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_c5rpop AS 
SELECT apflora.pop.ApArtId, apflora.pop.PopId
FROM (apflora_views.v_pop_letztermassnber INNER JOIN apflora.pop ON apflora_views.v_pop_letztermassnber.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.popmassnber ON (apflora.pop.PopId = apflora.popmassnber.PopId) AND (apflora_views.v_pop_letztermassnber.MaxvonPopMassnBerJahr = apflora.popmassnber.PopMassnBerJahr) AND (apflora_views.v_pop_letztermassnber.PopId = apflora.popmassnber.PopId)
WHERE apflora.popmassnber.PopMassnBerErfolgsbeurteilung=3
GROUP BY apflora.pop.ApArtId, apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_c6rpop AS 
SELECT apflora.pop.ApArtId, apflora.pop.PopId
FROM (apflora_views.v_pop_letztermassnber INNER JOIN apflora.pop ON apflora_views.v_pop_letztermassnber.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.popmassnber ON (apflora.pop.PopId = apflora.popmassnber.PopId) AND (apflora_views.v_pop_letztermassnber.PopId = apflora.popmassnber.PopId) AND (apflora_views.v_pop_letztermassnber.MaxvonPopMassnBerJahr = apflora.popmassnber.PopMassnBerJahr)
WHERE apflora.popmassnber.PopMassnBerErfolgsbeurteilung=4
GROUP BY apflora.pop.ApArtId, apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_c7rpop AS 
SELECT apflora.pop.ApArtId, apflora.pop.PopId
FROM (apflora_views.v_pop_letztermassnber INNER JOIN apflora.pop ON apflora_views.v_pop_letztermassnber.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.popmassnber ON (apflora.pop.PopId = apflora.popmassnber.PopId) AND (apflora_views.v_pop_letztermassnber.PopId = apflora.popmassnber.PopId) AND (apflora_views.v_pop_letztermassnber.MaxvonPopMassnBerJahr = apflora.popmassnber.PopMassnBerJahr)
WHERE apflora.popmassnber.PopMassnBerErfolgsbeurteilung=5
GROUP BY apflora.pop.ApArtId, apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_c3rtpop AS 
SELECT apflora.pop.ApArtId, apflora.tpop.TPopId
FROM ((apflora_views.v_tpop_letztermassnber INNER JOIN apflora.pop ON apflora_views.v_tpop_letztermassnber.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.tpopmassnber ON (apflora_views.v_tpop_letztermassnber.MaxvonTPopMassnBerJahr = apflora.tpopmassnber.TPopMassnBerJahr) AND (apflora_views.v_tpop_letztermassnber.TPopId = apflora.tpopmassnber.TPopId)) INNER JOIN apflora.tpop ON (apflora.tpopmassnber.TPopId = apflora.tpop.TPopId) AND (apflora.pop.PopId = apflora.tpop.PopId)
WHERE apflora.tpopmassnber.TPopMassnBerErfolgsbeurteilung=1
GROUP BY apflora.pop.ApArtId, apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_c4rtpop AS 
SELECT apflora.pop.ApArtId, apflora.tpop.TPopId
FROM ((apflora_views.v_tpop_letztermassnber INNER JOIN apflora.pop ON apflora_views.v_tpop_letztermassnber.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.tpopmassnber ON (apflora_views.v_tpop_letztermassnber.MaxvonTPopMassnBerJahr = apflora.tpopmassnber.TPopMassnBerJahr) AND (apflora_views.v_tpop_letztermassnber.TPopId = apflora.tpopmassnber.TPopId)) INNER JOIN apflora.tpop ON (apflora.tpopmassnber.TPopId = apflora.tpop.TPopId) AND (apflora.pop.PopId = apflora.tpop.PopId)
WHERE (apflora.tpopmassnber.TPopMassnBerErfolgsbeurteilung=2)
GROUP BY apflora.pop.ApArtId, apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_c5rtpop AS 
SELECT apflora.pop.ApArtId, apflora.tpop.TPopId
FROM ((apflora_views.v_tpop_letztermassnber INNER JOIN apflora.pop ON apflora_views.v_tpop_letztermassnber.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.tpopmassnber ON (apflora_views.v_tpop_letztermassnber.MaxvonTPopMassnBerJahr = apflora.tpopmassnber.TPopMassnBerJahr) AND (apflora_views.v_tpop_letztermassnber.TPopId = apflora.tpopmassnber.TPopId)) INNER JOIN apflora.tpop ON (apflora.tpopmassnber.TPopId = apflora.tpop.TPopId) AND (apflora.pop.PopId = apflora.tpop.PopId)
WHERE apflora.tpopmassnber.TPopMassnBerErfolgsbeurteilung=3
GROUP BY apflora.pop.ApArtId, apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_c6rtpop AS 
SELECT apflora.pop.ApArtId, apflora.tpop.TPopId
FROM ((apflora_views.v_tpop_letztermassnber INNER JOIN apflora.pop ON apflora_views.v_tpop_letztermassnber.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.tpopmassnber ON (apflora_views.v_tpop_letztermassnber.MaxvonTPopMassnBerJahr = apflora.tpopmassnber.TPopMassnBerJahr) AND (apflora_views.v_tpop_letztermassnber.TPopId = apflora.tpopmassnber.TPopId)) INNER JOIN apflora.tpop ON (apflora.tpopmassnber.TPopId = apflora.tpop.TPopId) AND (apflora.pop.PopId = apflora.tpop.PopId)
WHERE apflora.tpopmassnber.TPopMassnBerErfolgsbeurteilung=4
GROUP BY apflora.pop.ApArtId, apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apber_c7rtpop AS 
SELECT apflora.pop.ApArtId, apflora.tpop.TPopId
FROM ((apflora_views.v_tpop_letztermassnber INNER JOIN apflora.pop ON apflora_views.v_tpop_letztermassnber.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.tpopmassnber ON (apflora_views.v_tpop_letztermassnber.TPopId = apflora.tpopmassnber.TPopId) AND (apflora_views.v_tpop_letztermassnber.MaxvonTPopMassnBerJahr = apflora.tpopmassnber.TPopMassnBerJahr)) INNER JOIN apflora.tpop ON (apflora.tpopmassnber.TPopId = apflora.tpop.TPopId) AND (apflora.pop.PopId = apflora.tpop.PopId)
WHERE apflora.tpopmassnber.TPopMassnBerErfolgsbeurteilung=5
GROUP BY apflora.pop.ApArtId, apflora.tpop.TPopId;

CREATE OR REPLACE VIEW v_apbera1lpop AS 
SELECT apflora.pop.ApArtId, apflora.pop.PopId
FROM apflora.pop INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE apflora.tpop.TPopApBerichtRelevant=1 AND apflora.pop.PopHerkunft <> 300
GROUP BY apflora.pop.ApArtId, apflora.pop.PopId;

CREATE OR REPLACE VIEW v_apber_a2lpop AS
SELECT apflora.pop.ApArtId, apflora.pop.PopId
FROM apflora.pop INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId
WHERE apflora.pop.PopHerkunft=100 AND apflora.tpop.TPopApBerichtRelevant=1
GROUP BY apflora.pop.ApArtId, apflora.pop.PopId;

CREATE OR REPLACE VIEW v_pop_popberundmassnber AS
SELECT apflora_beob.adb_eigenschaften.TaxonomieId AS "AP ApArtId", apflora_beob.adb_eigenschaften.Artname AS "AP Art", apflora.ap_bearbstand_werte.DomainTxt AS "AP Status", apflora.ap.ApJahr AS "AP Start im Jahr", apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung", apflora.pop.PopGuid AS "Pop Guid", apflora.pop.PopNr AS "Pop Nr", apflora.pop.PopName AS "Pop Name", pop_status_werte.HerkunftTxt AS "Pop Status", apflora.pop.PopBekanntSeit AS "Pop bekannt seit", apflora.pop.PopHerkunftUnklar AS "Pop Status unklar", apflora.pop.PopHerkunftUnklarBegruendung AS "Pop Begruendung fuer unklaren Status", apflora.pop.PopXKoord AS "Pop X-Koordinaten", apflora.pop.PopYKoord AS "Pop Y-Koordinaten", apflora.pop.MutWann AS "Datensatz zuletzt geaendert", apflora.pop.MutWer AS "Datensatz zuletzt geaendert von", apflora_views.v_pop_berundmassnjahre.Jahr, apflora.popber.PopBerId AS "PopBer Id", apflora.popber.PopBerJahr AS "PopBer Jahr", pop_entwicklung_werte.EntwicklungTxt AS "PopBer Entwicklung", apflora.popber.PopBerTxt AS "PopBer Bemerkungen", apflora.popber.MutWann AS "PopBer MutWann", apflora.popber.MutWer AS "PopBer MutWer", apflora.popmassnber.PopMassnBerId AS "PopMassnBer Id", apflora.popmassnber.PopMassnBerJahr AS "PopMassnBer Jahr", tpopmassn_erfbeurt_werte.BeurteilTxt AS "PopMassnBer Entwicklung", apflora.popmassnber.PopMassnBerTxt AS "PopMassnBer Interpretation", apflora.popmassnber.MutWann AS "PopMassnBer MutWann", apflora.popmassnber.MutWer AS "PopMassnBer MutWer"
FROM (((((((apflora_beob.adb_eigenschaften INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId) INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId) LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode) LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode) LEFT JOIN apflora.pop_status_werte ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId) LEFT JOIN apflora_views.v_pop_berundmassnjahre ON apflora.pop.PopId = apflora_views.v_pop_berundmassnjahre.PopId) LEFT JOIN (apflora.popmassnber LEFT JOIN apflora.tpopmassn_erfbeurt_werte ON apflora.popmassnber.PopMassnBerErfolgsbeurteilung = tpopmassn_erfbeurt_werte.BeurteilId) ON (apflora_views.v_pop_berundmassnjahre.Jahr = apflora.popmassnber.PopMassnBerJahr) AND (apflora_views.v_pop_berundmassnjahre.PopId = apflora.popmassnber.PopId)) LEFT JOIN (apflora.popber LEFT JOIN apflora.pop_entwicklung_werte ON apflora.popber.PopBerEntwicklung = pop_entwicklung_werte.EntwicklungId) ON (apflora_views.v_pop_berundmassnjahre.Jahr = apflora.popber.PopBerJahr) AND (apflora_views.v_pop_berundmassnjahre.PopId = apflora.popber.PopId)
ORDER BY apflora_beob.adb_eigenschaften.Artname, apflora.pop.PopNr, apflora_views.v_pop_berundmassnjahre.Jahr;

CREATE OR REPLACE VIEW v_tpop_popberundmassnber AS
SELECT apflora_beob.adb_eigenschaften.TaxonomieId AS ApArtId, apflora_beob.adb_eigenschaften.Artname AS "AP Art", apflora.ap_bearbstand_werte.DomainTxt AS "AP Status", apflora.ap.ApJahr AS "AP Start im Jahr", apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung", apflora.pop.PopGuid AS "Pop Guid", apflora.pop.PopNr AS "Pop Nr", apflora.pop.PopName AS "Pop Name", pop_status_werte.HerkunftTxt AS "Pop Status", apflora.pop.PopBekanntSeit AS "Pop bekannt seit", apflora.pop.PopHerkunftUnklar AS "Pop Status unklar", apflora.pop.PopHerkunftUnklarBegruendung AS "Pop Begruendung fuer unklaren Status", apflora.pop.PopXKoord AS "Pop X-Koordinaten", apflora.pop.PopYKoord AS "Pop Y-Koordinaten", apflora.tpop.TPopId AS "TPop ID", apflora.tpop.TPopGuid AS "TPop Guid", apflora.tpop.TPopNr AS "TPop Nr", apflora.tpop.TPopGemeinde AS "TPop Gemeinde", apflora.tpop.TPopFlurname AS "TPop Flurname", domPopHerkunft_1.HerkunftTxt AS "TPop Status", apflora.tpop.TPopBekanntSeit AS "TPop bekannt seit", apflora.tpop.TPopHerkunftUnklar AS "TPop Status unklar", apflora.tpop.TPopHerkunftUnklarBegruendung AS "TPop Begruendung fuer unklaren Status", apflora.tpop.TPopXKoord AS "TPop X-Koordinaten", apflora.tpop.TPopYKoord AS "TPop Y-Koordinaten", apflora.tpop.TPopRadius AS "TPop Radius (m)", apflora.tpop.TPopHoehe AS "TPop Hoehe", apflora.tpop.TPopExposition AS "TPop Exposition", apflora.tpop.TPopKlima AS "TPop Klima", apflora.tpop.TPopNeigung AS "TPop Hangneigung", apflora.tpop.TPopBeschr AS "TPop Beschreibung", apflora.tpop.TPopKatNr AS "TPop Kataster-Nr", apflora.tpop.TPopApBerichtRelevant AS "TPop fuer AP-Bericht relevant", apflora.tpop.TPopEigen AS "TPop EigentuemerIn", apflora.tpop.TPopKontakt AS "TPop Kontakt vor Ort", apflora.tpop.TPopNutzungszone AS "TPop Nutzungszone", apflora.tpop.TPopBewirtschafterIn AS "TPop BewirtschafterIn", apflora.tpop.TPopBewirtschaftung AS "TPop Bewirtschaftung", apflora_views.v_tpop_berjahrundmassnjahr.Jahr, apflora.tpopber.TPopBerId AS "TPopBer Id", apflora.tpopber.TPopBerJahr AS "TPopBer Jahr", pop_entwicklung_werte.EntwicklungTxt AS "TPopBer Entwicklung", apflora.tpopber.TPopBerTxt AS "TPopBer Bemerkungen", apflora.tpopber.MutWann AS "TPopBer MutWann", apflora.tpopber.MutWer AS "TPopBer MutWer", apflora.tpopmassnber.TPopMassnBerJahr AS "TPopMassnBer Jahr", tpopmassn_erfbeurt_werte.BeurteilTxt AS "TPopMassnBer Entwicklung", apflora.tpopmassnber.TPopMassnBerTxt AS "TPopMassnBer Interpretation", apflora.tpopmassnber.MutWann AS "TPopMassnBer MutWann", apflora.tpopmassnber.MutWer AS "TPopMassnBer MutWer"
FROM ((((((((((apflora_beob.adb_eigenschaften RIGHT JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId) RIGHT JOIN (apflora.pop RIGHT JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId) ON apflora.ap.ApArtId = apflora.pop.ApArtId) LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode) LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode) LEFT JOIN apflora.pop_status_werte ON apflora.pop.PopHerkunft = pop_status_werte.HerkunftId) LEFT JOIN apflora.pop_status_werte AS domPopHerkunft_1 ON apflora.tpop.TPopHerkunft = domPopHerkunft_1.HerkunftId) LEFT JOIN apflora_views.v_tpop_berjahrundmassnjahr ON apflora.tpop.TPopId = apflora_views.v_tpop_berjahrundmassnjahr.TPopId) LEFT JOIN apflora.tpopmassnber ON (apflora_views.v_tpop_berjahrundmassnjahr.TPopId = apflora.tpopmassnber.TPopId) AND (apflora_views.v_tpop_berjahrundmassnjahr.Jahr = apflora.tpopmassnber.TPopMassnBerJahr)) LEFT JOIN apflora.tpopmassn_erfbeurt_werte ON apflora.tpopmassnber.TPopMassnBerErfolgsbeurteilung = tpopmassn_erfbeurt_werte.BeurteilId) LEFT JOIN apflora.tpopber ON (apflora_views.v_tpop_berjahrundmassnjahr.Jahr = apflora.tpopber.TPopBerJahr) AND (apflora_views.v_tpop_berjahrundmassnjahr.TPopId = apflora.tpopber.TPopId)) LEFT JOIN apflora.pop_entwicklung_werte ON apflora.tpopber.TPopBerEntwicklung = pop_entwicklung_werte.EntwicklungId
ORDER BY apflora_beob.adb_eigenschaften.Artname, apflora.pop.PopNr, apflora.tpop.TPopNr, apflora_views.v_tpop_berjahrundmassnjahr.Jahr;

CREATE OR REPLACE VIEW v_pop_berjahrundmassnjahrvontpop AS 
SELECT apflora.tpop.PopId, apflora_views.v_tpop_berjahrundmassnjahr.Jahr
FROM apflora_views.v_tpop_berjahrundmassnjahr INNER JOIN apflora.tpop ON apflora_views.v_tpop_berjahrundmassnjahr.TPopId = apflora.tpop.TPopId
GROUP BY apflora.tpop.PopId, apflora_views.v_tpop_berjahrundmassnjahr.Jahr;

#CREATE OR REPLACE VIEW vKontrLetzte AS
#SELECT * FROM apflora_views.v_tpopkontr INNER JOIN apflora_views.v_tpopkontr_letzteid ON apflora_views.v_tpopkontr.TPopKontrId = apflora_views.v_tpopkontr_letzteid.MaxTPopKontrId;

CREATE OR REPLACE VIEW v_tpopber_mitletzterid AS
SELECT apflora.tpopber.TPopId, apflora_views.v_tpopber_letzteid.AnzTPopBer, apflora.tpopber.TPopBerId, apflora.tpopber.TPopBerJahr AS "TPopBer Jahr", apflora.tpopber.TPopBerEntwicklung AS "TPopBer Entwicklung", apflora.tpopber.TPopBerTxt AS "TPopBer Bemerkungen", apflora.tpopber.MutWann AS "TPopBer  MutWann", apflora.tpopber.MutWer AS "TPopBer MutWer"
FROM apflora_views.v_tpopber_letzteid INNER JOIN apflora.tpopber ON (apflora_views.v_tpopber_letzteid.MaxTPopBerId = apflora.tpopber.TPopBerId) AND (apflora_views.v_tpopber_letzteid.TPopId = apflora.tpopber.TPopId);

#funktioniert nicht, wenn letzeKontrolle als Unterabfrage eingebunden wird. Grund: Unterabfragen in der FROM-Klausel duerfen keine korrellierten Unterabfragen sein
CREATE OR REPLACE VIEW v_tpop_anzkontrinklletzter AS
SELECT apflora_beob.adb_eigenschaften.TaxonomieId AS ApArtId, apflora_beob.adb_eigenschaften.Familie, apflora_beob.adb_eigenschaften.Artname AS "AP Art", apflora.ap_bearbstand_werte.DomainTxt AS "AP Status", apflora.ap.ApJahr AS "AP Start im Jahr", apflora.ap_umsetzung_werte.DomainTxt AS "AP Stand Umsetzung", tblAdresse_1.AdrName AS "AP verantwortlich", apflora.pop.PopGuid AS "Pop Guid", apflora.pop.PopNr AS "Pop Nr", apflora.pop.PopName AS "Pop Name", apflora.pop_status_werte.HerkunftTxt AS "Pop Herkunft", apflora.pop.PopBekanntSeit AS "Pop bekannt seit", apflora.tpop.TPopId AS "TPop ID", apflora.tpop.TPopGuid AS "TPop Guid", apflora.tpop.TPopNr AS "TPop Nr", apflora.tpop.TPopGemeinde AS "TPop Gemeinde", apflora.tpop.TPopFlurname AS "TPop Flurname", domPopHerkunft_1.HerkunftTxt AS "TPop Status", apflora.tpop.TPopBekanntSeit AS "TPop bekannt seit", apflora.tpop.TPopHerkunftUnklar AS "TPop Status unklar", apflora.tpop.TPopHerkunftUnklarBegruendung AS "TPop Begruendung fuer unklaren Status", apflora.tpop.TPopXKoord AS "TPop X-Koordinaten", apflora.tpop.TPopYKoord AS "TPop Y-Koordinaten", apflora.tpop.TPopRadius AS "TPop Radius m", apflora.tpop.TPopHoehe AS "TPop Hoehe", apflora.tpop.TPopExposition AS "TPop Exposition", apflora.tpop.TPopKlima AS "TPop Klima", apflora.tpop.TPopNeigung AS "TPop Hangneigung", apflora.tpop.TPopBeschr AS "TPop Beschreibung", apflora.tpop.TPopKatNr AS "TPop Kataster-Nr", apflora.tpop.TPopApBerichtRelevant AS "TPop fuer AP-Bericht relevant", apflora.tpop.TPopEigen AS "TPop EigentuemerIn", apflora.tpop.TPopKontakt AS "TPop Kontakt vor Ort", apflora.tpop.TPopNutzungszone AS "TPop Nutzungszone", apflora.tpop.TPopBewirtschafterIn AS "TPop BewirtschafterIn", apflora.tpop.TPopBewirtschaftung AS "TPop Bewirtschaftung", apflora_views.v_tpopkontr_letzteid.AnzTPopKontr AS "TPop Anzahl Kontrollen", apflora.tpopkontr.TPopKontrId, apflora.tpopkontr.TPopId, apflora.tpopkontr.TPopKontrGuid AS "Kontr Guid", apflora.tpopkontr.TPopKontrJahr AS "Kontr Jahr", apflora.tpopkontr.TPopKontrDatum AS "Kontr Datum", apflora.tpopkontr_typ_werte.DomainTxt AS "Kontr Typ", apflora.adresse.AdrName AS "Kontr BearbeiterIn", apflora.tpopkontr.TPopKontrUeberleb AS "Kontr Ueberlebensrate", apflora.tpopkontr.TPopKontrVitalitaet AS "Kontr Vitalitaet", apflora.pop_entwicklung_werte.EntwicklungTxt AS "Kontr Entwicklung", apflora.tpopkontr.TPopKontrUrsach AS "Kontr Ursachen", apflora.tpopkontr.TPopKontrUrteil AS "Kontr Erfolgsbeurteilung", apflora.tpopkontr.TPopKontrAendUms AS "Kontr Aenderungs-Vorschlaege Umsetzung", apflora.tpopkontr.TPopKontrAendKontr AS "Kontr Aenderungs-Vorschlaege Kontrolle", apflora.tpop.TPopXKoord AS "Kontr X-Koord", apflora.tpop.TPopYKoord AS "Kontr Y-Koord", apflora.tpopkontr.TPopKontrTxt AS "Kontr Bemerkungen", apflora.tpopkontr.TPopKontrLeb AS "Kontr Lebensraum Delarze", apflora.tpopkontr.TPopKontrLebUmg AS "Kontr angrenzender Lebensraum Delarze", apflora.tpopkontr.TPopKontrVegTyp AS "Kontr Vegetationstyp", apflora.tpopkontr.TPopKontrKonkurrenz AS "Kontr Konkurrenz", apflora.tpopkontr.TPopKontrMoosschicht AS "Kontr Moosschicht", apflora.tpopkontr.TPopKontrKrautschicht AS "Kontr Krautschicht", apflora.tpopkontr.TPopKontrStrauchschicht AS "Kontr Strauchschicht", apflora.tpopkontr.TPopKontrBaumschicht AS "Kontr Baumschicht", apflora.tpopkontr.TPopKontrBodenTyp AS "Kontr Bodentyp", apflora.tpopkontr.TPopKontrBodenKalkgehalt AS "Kontr Boden Kalkgehalt", apflora.tpopkontr.TPopKontrBodenDurchlaessigkeit AS "Kontr Boden Durchlaessigkeit", apflora.tpopkontr.TPopKontrBodenHumus AS "Kontr Boden Humusgehalt", apflora.tpopkontr.TPopKontrBodenNaehrstoffgehalt AS "Kontr Boden Naehrstoffgehalt", apflora.tpopkontr.TPopKontrBodenAbtrag AS "Kontr Oberbodenabtrag", apflora.tpopkontr.TPopKontrWasserhaushalt AS "Kontr Wasserhaushalt", apflora.tpopkontr_idbiotuebereinst_werte.DomainTxt AS "Kontr Uebereinstimmung mit Idealbiotop", apflora.tpopkontr.TPopKontrHandlungsbedarf AS "Kontr Handlungsbedarf", apflora.tpopkontr.TPopKontrUebFlaeche AS "Kontr Ueberpruefte Flaeche", apflora.tpopkontr.TPopKontrFlaeche AS "Kontr Flaeche der Teilpopulation m2", apflora.tpopkontr.TPopKontrPlan AS "Kontr auf Plan eingezeichnet", apflora.tpopkontr.TPopKontrVeg AS "Kontr Deckung durch Vegetation", apflora.tpopkontr.TPopKontrNaBo AS "Kontr Deckung nackter Boden", apflora.tpopkontr.TPopKontrUebPfl AS "Kontr Deckung durch ueberpruefte Art", apflora.tpopkontr.TPopKontrJungPflJN AS "Kontr auch junge Pflanzen", apflora.tpopkontr.TPopKontrVegHoeMax AS "Kontr maximale Veg-hoehe cm", apflora.tpopkontr.TPopKontrVegHoeMit AS "Kontr mittlere Veg-hoehe cm", apflora.tpopkontr.TPopKontrGefaehrdung AS "Kontr Gefaehrdung", apflora.tpopkontr.MutWann AS "Kontrolle zuletzt geaendert", apflora.tpopkontr.MutWer AS "Kontrolle zuletzt geaendert von"
FROM apflora_views.v_tpopkontr_letzteid INNER JOIN (apflora.pop_status_werte AS domPopHerkunft_1 RIGHT JOIN (((((((apflora_beob.adb_eigenschaften INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId = apflora.ap.ApArtId) INNER JOIN (apflora.pop INNER JOIN (apflora.tpop LEFT JOIN (((apflora.tpopkontr LEFT JOIN apflora.tpopkontr_typ_werte ON apflora.tpopkontr.TPopKontrTyp = apflora.tpopkontr_typ_werte.DomainTxt) LEFT JOIN apflora.adresse ON apflora.tpopkontr.TPopKontrBearb = apflora.adresse.AdrId) LEFT JOIN apflora.pop_entwicklung_werte ON apflora.tpopkontr.TPopKontrEntwicklung = apflora.pop_entwicklung_werte.EntwicklungId) ON apflora.tpop.TPopId = apflora.tpopkontr.TPopId) ON apflora.pop.PopId = apflora.tpop.PopId) ON apflora.ap.ApArtId = apflora.pop.ApArtId) LEFT JOIN apflora.ap_bearbstand_werte ON apflora.ap.ApStatus = apflora.ap_bearbstand_werte.DomainCode) LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode) LEFT JOIN apflora.pop_status_werte ON apflora.pop.PopHerkunft = apflora.pop_status_werte.HerkunftId) LEFT JOIN apflora.tpopkontr_idbiotuebereinst_werte ON apflora.tpopkontr.TPopKontrIdealBiotopUebereinst = apflora.tpopkontr_idbiotuebereinst_werte.DomainCode) LEFT JOIN apflora.adresse AS tblAdresse_1 ON apflora.ap.ApBearb = tblAdresse_1.AdrId) ON domPopHerkunft_1.HerkunftId = apflora.tpop.TPopHerkunft) ON (apflora_views.v_tpopkontr_letzteid.MaxTPopKontrId = apflora.tpopkontr.TPopKontrId) AND (apflora_views.v_tpopkontr_letzteid.TPopId = apflora.tpopkontr.TPopId)
WHERE apflora_beob.adb_eigenschaften.TaxonomieId Not In (100,150) AND (apflora.tpopkontr.TPopKontrTyp Is Null Or (apflora.tpopkontr.TPopKontrTyp Not Like "Ziel" And apflora.tpopkontr.TPopKontrTyp Not Like "Zwischenziel"))
ORDER BY apflora_beob.adb_eigenschaften.Artname, apflora.pop.PopNr, apflora.tpop.TPopNr, apflora.tpopkontr.TPopKontrJahr, apflora.tpopkontr.TPopKontrDatum;