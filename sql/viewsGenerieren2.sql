/*
 * diese Views hängen von anderen ab, die in viewsGenerieren.sql erstellt werden
 * daher muss diese Date NACH viewsGenerieren.sql ausgeführt werden
 */

CREATE OR REPLACE VIEW vApMassnJahre AS
SELECT apflora.tblAp.ApArtId, apfloraViews.vMassnJahre.TPopMassnJahr 
FROM apflora.tblAp, apfloraViews.vMassnJahre 
WHERE apflora.tblAp.ApArtId>0 AND apflora.tblAp.ApStatus Between 1 And 3 
ORDER BY apflora.tblAp.ApArtId, apfloraViews.vMassnJahre.TPopMassnJahr;

CREATE OR REPLACE VIEW vApAnzMassnProJahr AS 
SELECT apfloraViews.vApMassnJahre.ApArtId, apfloraViews.vApMassnJahre.TPopMassnJahr, IF(apfloraViews.vApAnzMassnProJahr0.AnzahlvonTPopMassnId Is Not Null, apfloraViews.vApAnzMassnProJahr0.AnzahlvonTPopMassnId,0) AS "AnzahlMassnahmen" 
FROM apfloraViews.vApMassnJahre LEFT JOIN apfloraViews.vApAnzMassnProJahr0 ON (apfloraViews.vApMassnJahre.TPopMassnJahr = apfloraViews.vApAnzMassnProJahr0.TPopMassnJahr) AND (apfloraViews.vApMassnJahre.ApArtId = apfloraViews.vApAnzMassnProJahr0.ApArtId) 
ORDER BY apfloraViews.vApMassnJahre.ApArtId, apfloraViews.vApMassnJahre.TPopMassnJahr;

#im Gebrauch durch exportPopMitMassnberAnzMassn.php:
CREATE OR REPLACE VIEW vPopMassnberAnzMassn AS
SELECT apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId AS ApArtId, apfloraBeob.ArtenDb_Arteigenschaften.Artname AS "AP Art", apflora.domApBearbeitungsstand.DomainTxt AS "AP Status", apflora.tblAp.ApJahr AS "AP Start im Jahr", apflora.domApUmsetzung.DomainTxt AS "AP Stand Umsetzung", apflora.tblPop.PopGuid AS "Pop Guid", apflora.tblPop.PopNr AS "Pop Nr", apflora.tblPop.PopName AS "Pop Name", domPopHerkunft.HerkunftTxt AS "Pop Status", apflora.tblPop.PopBekanntSeit AS "Pop bekannt seit", apflora.tblPop.PopHerkunftUnklar AS "Pop Status unklar", apflora.tblPop.PopHerkunftUnklarBegruendung AS "Pop Begruendung fuer unklaren Status", apfloraViews.vPopMassnberAnzMassn0.PopMassnBerJahr AS "MassnBer Jahr", apfloraViews.vPopMassnberAnzMassn0.AnzahlvonTPopMassnId AS "Anz Massnahmen in diesem Jahr"
FROM (((((apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN apflora.tblAp ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId = apflora.tblAp.ApArtId) INNER JOIN apflora.tblPop ON apflora.tblAp.ApArtId = apflora.tblPop.ApArtId) LEFT JOIN apflora.domApBearbeitungsstand ON apflora.tblAp.ApStatus = apflora.domApBearbeitungsstand.DomainCode) LEFT JOIN apflora.domApUmsetzung ON apflora.tblAp.ApUmsetzung = apflora.domApUmsetzung.DomainCode) LEFT JOIN apflora.domPopHerkunft ON apflora.tblPop.PopHerkunft = domPopHerkunft.HerkunftId) INNER JOIN apfloraViews.vPopMassnberAnzMassn0 ON apflora.tblPop.PopId = apfloraViews.vPopMassnberAnzMassn0.PopId
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname, apflora.tblPop.PopNr, apfloraViews.vPopMassnberAnzMassn0.PopMassnBerJahr;

CREATE OR REPLACE VIEW vApAnzMassnBisJahr AS
SELECT apfloraViews.vApMassnJahre.ApArtId, apfloraViews.vApMassnJahre.TPopMassnJahr, Sum(apfloraViews.vApAnzMassnProJahr.AnzahlMassnahmen) AS "AnzahlMassnahmen" 
FROM apfloraViews.vApMassnJahre INNER JOIN apfloraViews.vApAnzMassnProJahr ON apfloraViews.vApMassnJahre.ApArtId = apfloraViews.vApAnzMassnProJahr.ApArtId 
WHERE apfloraViews.vApAnzMassnProJahr.TPopMassnJahr<=apfloraViews.vApMassnJahre.TPopMassnJahr 
GROUP BY apfloraViews.vApMassnJahre.ApArtId, apfloraViews.vApMassnJahre.TPopMassnJahr 
ORDER BY apfloraViews.vApMassnJahre.ApArtId, apfloraViews.vApMassnJahre.TPopMassnJahr;

CREATE OR REPLACE VIEW vApJahresberichteUndMassnahmen AS
SELECT apflora.tblAp.ApArtId, apfloraBeob.ArtenDb_Arteigenschaften.Artname AS Art, apflora.domApBearbeitungsstand.DomainTxt AS "AP Status", apflora.tblAp.ApJahr AS "AP Start im Jahr", apflora.domApUmsetzung.DomainTxt AS "AP Stand Umsetzung", apflora.tblAdresse.AdrName AS "AP Verantwortlich", apflora.tblAp.ApArtwert AS Artwert, apfloraViews.vApAnzMassnProJahr.TPopMassnJahr AS Jahr, apfloraViews.vApAnzMassnProJahr.AnzahlMassnahmen AS "Anzahl Massnahmen", apfloraViews.vApAnzMassnBisJahr.AnzahlMassnahmen AS "Anzahl Massnahmen bisher", IF(apflora.tblJBer.JBerJahr>0,"Ja","Nein") AS "Bericht erstellt"
FROM ((((((apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN apflora.tblAp ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId = apflora.tblAp.ApArtId) LEFT JOIN apflora.domApBearbeitungsstand ON apflora.tblAp.ApStatus = apflora.domApBearbeitungsstand.DomainCode) LEFT JOIN apflora.domApUmsetzung ON apflora.tblAp.ApUmsetzung = apflora.domApUmsetzung.DomainCode) LEFT JOIN apflora.tblAdresse ON apflora.tblAp.ApBearb = apflora.tblAdresse.AdrId) INNER JOIN apfloraViews.vApAnzMassnProJahr ON apflora.tblAp.ApArtId = apfloraViews.vApAnzMassnProJahr.ApArtId) INNER JOIN apfloraViews.vApAnzMassnBisJahr ON (apfloraViews.vApAnzMassnProJahr.TPopMassnJahr = apfloraViews.vApAnzMassnBisJahr.TPopMassnJahr) AND (apfloraViews.vApAnzMassnProJahr.ApArtId = apfloraViews.vApAnzMassnBisJahr.ApArtId)) LEFT JOIN apflora.tblJBer ON (apfloraViews.vApAnzMassnBisJahr.TPopMassnJahr = apflora.tblJBer.JBerJahr) AND (apfloraViews.vApAnzMassnBisJahr.ApArtId = apflora.tblJBer.ApArtId)
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname, apfloraViews.vApAnzMassnProJahr.TPopMassnJahr;

CREATE OR REPLACE VIEW vLetzterTPopMassnBericht AS
SELECT apfloraViews.vLetzterTPopMassnBericht0.ApArtId, apfloraViews.vLetzterTPopMassnBericht0.TPopId, Max(apfloraViews.vLetzterTPopMassnBericht0.TPopMassnBerJahr) AS MaxvonTPopMassnBerJahr
FROM apfloraViews.vLetzterTPopMassnBericht0
GROUP BY apfloraViews.vLetzterTPopMassnBericht0.ApArtId, apfloraViews.vLetzterTPopMassnBericht0.TPopId;

CREATE OR REPLACE VIEW vLetzterTPopBericht AS 
SELECT apfloraViews.vLetzterTPopBericht0.ApArtId, apfloraViews.vLetzterTPopBericht0.TPopId, Max(apfloraViews.vLetzterTPopBericht0.TPopBerJahr) AS MaxvonTPopBerJahr
FROM apfloraViews.vLetzterTPopBericht0
GROUP BY apfloraViews.vLetzterTPopBericht0.ApArtId, apfloraViews.vLetzterTPopBericht0.TPopId;

CREATE OR REPLACE VIEW vLetzterPopMassnBericht AS 
SELECT apfloraViews.vLetzterPopMassnBericht0.ApArtId, apfloraViews.vLetzterPopMassnBericht0.PopId, Max(apfloraViews.vLetzterPopMassnBericht0.PopMassnBerJahr) AS MaxvonPopMassnBerJahr
FROM apfloraViews.vLetzterPopMassnBericht0
GROUP BY apfloraViews.vLetzterPopMassnBericht0.ApArtId, apfloraViews.vLetzterPopMassnBericht0.PopId;

CREATE OR REPLACE VIEW vLetzterPopBericht AS
SELECT apfloraViews.vLetzterPopBericht0.ApArtId, apfloraViews.vLetzterPopBericht0.PopId, Max(apfloraViews.vLetzterPopBericht0.PopBerJahr) AS MaxvonPopBerJahr
FROM apfloraViews.vLetzterPopBericht0
GROUP BY apfloraViews.vLetzterPopBericht0.ApArtId, apfloraViews.vLetzterPopBericht0.PopId;

CREATE OR REPLACE VIEW vJbUebE AS 
SELECT apflora.tblJBer.*, apfloraBeob.ArtenDb_Arteigenschaften.Artname, IF(apfloraBeob.ArtenDb_Arteigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, apfloraBeob.ArtenDb_Arteigenschaften.KefKontrolljahr, IF(Round((apflora.tblKonstanten.JBerJahr-apfloraBeob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,0)=(apflora.tblKonstanten.JBerJahr-apfloraBeob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, apfloraBeob.ArtenDb_Arteigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(apfloraBeob.ArtenDb_Arteigenschaften.FnsJahresartJahr=apflora.tblKonstanten.JBerJahr,"Ja","") AS FnsJahrespflanze2, apfloraViews.vApAnzMassnBisJahr.AnzahlMassnahmen
FROM apflora.tblKonstanten AS tblKonstanten_1 INNER JOIN ((apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN (apflora.tblAp INNER JOIN apfloraViews.vApApBerichtRelevant ON apflora.tblAp.ApArtId = apfloraViews.vApApBerichtRelevant.ApArtId) ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId = apflora.tblAp.ApArtId) INNER JOIN (apflora.tblKonstanten INNER JOIN (apflora.tblJBer INNER JOIN apfloraViews.vApAnzMassnBisJahr ON apflora.tblJBer.ApArtId = apfloraViews.vApAnzMassnBisJahr.ApArtId) ON apflora.tblKonstanten.JBerJahr = apflora.tblJBer.JBerJahr) ON apflora.tblAp.ApArtId = apflora.tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = apfloraViews.vApAnzMassnBisJahr.TPopMassnJahr 
WHERE apfloraViews.vApAnzMassnBisJahr.AnzahlMassnahmen>0 AND apflora.tblJBer.JBerBeurteilung=1 AND apflora.tblAp.ApStatus Between 1 And 3
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUebKm AS 
SELECT apfloraBeob.ArtenDb_Arteigenschaften.Artname, IF(apfloraBeob.ArtenDb_Arteigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, IF(Round((apflora.tblKonstanten.JBerJahr-apfloraBeob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,0)=(apflora.tblKonstanten.JBerJahr-apfloraBeob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, apfloraBeob.ArtenDb_Arteigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(apfloraBeob.ArtenDb_Arteigenschaften.FnsJahresartJahr=apflora.tblKonstanten.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM (apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN ((apfloraViews.vApAnzMassnBisJahr AS vApAnzMassnBisJahr_1 INNER JOIN apflora.tblAp ON vApAnzMassnBisJahr_1.ApArtId = apflora.tblAp.ApArtId) INNER JOIN apfloraViews.vApApBerichtRelevant ON apflora.tblAp.ApArtId = apfloraViews.vApApBerichtRelevant.ApArtId) ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId = apflora.tblAp.ApArtId) INNER JOIN (apflora.tblJBer INNER JOIN apflora.tblKonstanten ON apflora.tblJBer.JBerJahr = apflora.tblKonstanten.JBerJahr) ON (apflora.tblKonstanten.JBerJahr = vApAnzMassnBisJahr_1.TPopMassnJahr) AND (apflora.tblAp.ApArtId = apflora.tblJBer.ApArtId)
WHERE apflora.tblAp.ApStatus Between 1 And 3 AND vApAnzMassnBisJahr_1.AnzahlMassnahmen="0"
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUebMa AS 
SELECT apfloraBeob.ArtenDb_Arteigenschaften.Artname, apfloraViews.vApAnzMassnBisJahr.AnzahlMassnahmen
FROM apflora.tblKonstanten INNER JOIN ((apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN (apflora.tblAp INNER JOIN apfloraViews.vApApBerichtRelevant ON apflora.tblAp.ApArtId = apfloraViews.vApApBerichtRelevant.ApArtId) ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId = apflora.tblAp.ApArtId) INNER JOIN apfloraViews.vApAnzMassnBisJahr ON apflora.tblAp.ApArtId = apfloraViews.vApAnzMassnBisJahr.ApArtId) ON apflora.tblKonstanten.JBerJahr = apfloraViews.vApAnzMassnBisJahr.TPopMassnJahr
WHERE apfloraViews.vApAnzMassnBisJahr.AnzahlMassnahmen>0 AND apflora.tblAp.ApStatus Between 1 And 3
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUebMe AS
SELECT apflora.tblJBer.*, apfloraBeob.ArtenDb_Arteigenschaften.Artname, IF("KefArt"=-1,"Ja","") AS FnsKefArt2, IF(Round((apflora.tblKonstanten.JBerJahr-"KefKontrolljahr")/4,0)=(apflora.tblKonstanten.JBerJahr-"KefKontrolljahr")/4,"Ja","") AS FnsKefKontrJahr2, apfloraBeob.ArtenDb_Arteigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(apfloraBeob.ArtenDb_Arteigenschaften.FnsJahresartJahr=apflora.tblKonstanten.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM apflora.tblKonstanten AS tblKonstanten_1 INNER JOIN ((apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN (apflora.tblAp INNER JOIN apfloraViews.vApApBerichtRelevant ON apflora.tblAp.ApArtId = apfloraViews.vApApBerichtRelevant.ApArtId) ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId = apflora.tblAp.ApArtId) INNER JOIN ((apflora.tblJBer INNER JOIN apfloraViews.vApAnzMassnBisJahr ON apflora.tblJBer.ApArtId = apfloraViews.vApAnzMassnBisJahr.ApArtId) INNER JOIN apflora.tblKonstanten ON apflora.tblJBer.JBerJahr = apflora.tblKonstanten.JBerJahr) ON apflora.tblAp.ApArtId = apflora.tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = apfloraViews.vApAnzMassnBisJahr.TPopMassnJahr
WHERE apflora.tblJBer.JBerBeurteilung=5 AND apfloraViews.vApAnzMassnBisJahr.AnzahlMassnahmen>0 AND apflora.tblAp.ApStatus Between 1 And 3
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUebNe AS
SELECT apflora.tblJBer.*, apfloraBeob.ArtenDb_Arteigenschaften.Artname, IF(apfloraBeob.ArtenDb_Arteigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, IF(Round((apflora.tblKonstanten.JBerJahr-apfloraBeob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,0)=(apflora.tblKonstanten.JBerJahr-apfloraBeob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, apfloraBeob.ArtenDb_Arteigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(apfloraBeob.ArtenDb_Arteigenschaften.FnsJahresartJahr=apflora.tblKonstanten.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM apflora.tblKonstanten AS tblKonstanten_1 INNER JOIN ((apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN (apflora.tblAp INNER JOIN apfloraViews.vApApBerichtRelevant ON apflora.tblAp.ApArtId = apfloraViews.vApApBerichtRelevant.ApArtId) ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId = apflora.tblAp.ApArtId) INNER JOIN ((apflora.tblJBer INNER JOIN apfloraViews.vApAnzMassnBisJahr ON apflora.tblJBer.ApArtId = apfloraViews.vApAnzMassnBisJahr.ApArtId) INNER JOIN apflora.tblKonstanten ON apflora.tblJBer.JBerJahr = apflora.tblKonstanten.JBerJahr) ON apflora.tblAp.ApArtId = apflora.tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = apfloraViews.vApAnzMassnBisJahr.TPopMassnJahr
WHERE apflora.tblJBer.JBerBeurteilung=3 AND apflora.tblAp.ApStatus Between 1 And 3 AND apfloraViews.vApAnzMassnBisJahr.AnzahlMassnahmen>0
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUebSe AS 
SELECT apflora.tblJBer.*, apfloraBeob.ArtenDb_Arteigenschaften.Artname, IF(apfloraBeob.ArtenDb_Arteigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, IF(Round((apflora.tblKonstanten.JBerJahr-apfloraBeob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,0)=(apflora.tblKonstanten.JBerJahr-apfloraBeob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, apfloraBeob.ArtenDb_Arteigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(apfloraBeob.ArtenDb_Arteigenschaften.FnsJahresartJahr=apflora.tblKonstanten.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM apflora.tblKonstanten AS tblKonstanten_1 INNER JOIN ((apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN (apflora.tblAp INNER JOIN apfloraViews.vApApBerichtRelevant ON apflora.tblAp.ApArtId = apfloraViews.vApApBerichtRelevant.ApArtId) ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId = apflora.tblAp.ApArtId) INNER JOIN ((apflora.tblJBer INNER JOIN apfloraViews.vApAnzMassnBisJahr ON apflora.tblJBer.ApArtId = apfloraViews.vApAnzMassnBisJahr.ApArtId) INNER JOIN apflora.tblKonstanten ON apflora.tblJBer.JBerJahr = apflora.tblKonstanten.JBerJahr) ON apflora.tblAp.ApArtId = apflora.tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = apfloraViews.vApAnzMassnBisJahr.TPopMassnJahr
WHERE apflora.tblJBer.JBerBeurteilung=4 AND apfloraViews.vApAnzMassnBisJahr.AnzahlMassnahmen>0 AND apflora.tblAp.ApStatus Between 1 And 3
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUebUn AS
SELECT apflora.tblJBer.*, apfloraBeob.ArtenDb_Arteigenschaften.Artname, IF(apfloraBeob.ArtenDb_Arteigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, IF(Round((apflora.tblKonstanten.JBerJahr-apfloraBeob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,0)=(apflora.tblKonstanten.JBerJahr-apfloraBeob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, apfloraBeob.ArtenDb_Arteigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(apfloraBeob.ArtenDb_Arteigenschaften.FnsJahresartJahr=apflora.tblKonstanten.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM apflora.tblKonstanten AS tblKonstanten_1 INNER JOIN ((apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN (apflora.tblAp INNER JOIN apfloraViews.vApApBerichtRelevant ON apflora.tblAp.ApArtId = apfloraViews.vApApBerichtRelevant.ApArtId) ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId = apflora.tblAp.ApArtId) INNER JOIN ((apflora.tblJBer INNER JOIN apfloraViews.vApAnzMassnBisJahr ON apflora.tblJBer.ApArtId = apfloraViews.vApAnzMassnBisJahr.ApArtId) INNER JOIN apflora.tblKonstanten ON apflora.tblJBer.JBerJahr = apflora.tblKonstanten.JBerJahr) ON apflora.tblAp.ApArtId = apflora.tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = apfloraViews.vApAnzMassnBisJahr.TPopMassnJahr
WHERE apflora.tblJBer.JBerBeurteilung=1168274204 AND apfloraViews.vApAnzMassnBisJahr.AnzahlMassnahmen>0 AND apflora.tblAp.ApStatus Between 1 And 3
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUebWe AS 
SELECT apflora.tblJBer.*, apfloraBeob.ArtenDb_Arteigenschaften.Artname, IF(apfloraBeob.ArtenDb_Arteigenschaften.KefArt=-1,"Ja","") AS FnsKefArt2, IF(Round((apflora.tblKonstanten.JBerJahr-apfloraBeob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,0)=(apflora.tblKonstanten.JBerJahr-apfloraBeob.ArtenDb_Arteigenschaften.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, apfloraBeob.ArtenDb_Arteigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(apfloraBeob.ArtenDb_Arteigenschaften.FnsJahresartJahr=apflora.tblKonstanten.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM apflora.tblKonstanten AS tblKonstanten_1 INNER JOIN ((apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN (apflora.tblAp INNER JOIN apfloraViews.vApApBerichtRelevant ON apflora.tblAp.ApArtId = apfloraViews.vApApBerichtRelevant.ApArtId) ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId = apflora.tblAp.ApArtId) INNER JOIN ((apflora.tblJBer INNER JOIN apfloraViews.vApAnzMassnBisJahr ON apflora.tblJBer.ApArtId = apfloraViews.vApAnzMassnBisJahr.ApArtId) INNER JOIN apflora.tblKonstanten ON apflora.tblJBer.JBerJahr = apflora.tblKonstanten.JBerJahr) ON apflora.tblAp.ApArtId = apflora.tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = apfloraViews.vApAnzMassnBisJahr.TPopMassnJahr
WHERE apflora.tblJBer.JBerBeurteilung=6 AND apfloraViews.vApAnzMassnBisJahr.AnzahlMassnahmen>0 AND apflora.tblAp.ApStatus Between 1 And 3
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUebNichtBeurteilt000 AS 
SELECT apflora.tblAp.ApArtId, apflora.tblJBer.JBerJahr
FROM (((apflora.tblAp INNER JOIN apfloraViews.vApAnzMassnBisJahr ON apflora.tblAp.ApArtId = apfloraViews.vApAnzMassnBisJahr.ApArtId) INNER JOIN apfloraViews.vApApBerichtRelevant ON apflora.tblAp.ApArtId = apfloraViews.vApApBerichtRelevant.ApArtId) LEFT JOIN apflora.tblJBer ON apflora.tblAp.ApArtId = apflora.tblJBer.ApArtId) INNER JOIN apflora.tblKonstanten ON apfloraViews.vApAnzMassnBisJahr.TPopMassnJahr = apflora.tblKonstanten.JBerJahr
WHERE apflora.tblJBer.ApArtId Is Null AND apflora.tblAp.ApStatus Between 1 And 3;

CREATE OR REPLACE VIEW vJbUebNichtBeurteilt00 AS 
SELECT apflora.tblAp.ApArtId, apflora.tblJBer.JBerJahr
FROM apflora.tblKonstanten AS tblKonstanten_1 INNER JOIN (((apflora.tblAp INNER JOIN apfloraViews.vApAnzMassnBisJahr ON apflora.tblAp.ApArtId = apfloraViews.vApAnzMassnBisJahr.ApArtId) INNER JOIN apfloraViews.vApApBerichtRelevant ON apflora.tblAp.ApArtId = apfloraViews.vApApBerichtRelevant.ApArtId) INNER JOIN (apflora.tblJBer INNER JOIN apflora.tblKonstanten ON apflora.tblJBer.JBerJahr = apflora.tblKonstanten.JBerJahr) ON apflora.tblAp.ApArtId = apflora.tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = apfloraViews.vApAnzMassnBisJahr.TPopMassnJahr
WHERE apflora.tblAp.ApStatus Between 1 And 3 AND apflora.tblJBer.JBerBeurteilung Is Null;

CREATE OR REPLACE VIEW vJbUebNichtBeurteilt0 AS 
select ApArtId, JBerJahr from apfloraViews.vJbUebNichtBeurteilt000
UNION select ApArtId, JBerJahr from apfloraViews.vJbUebNichtBeurteilt00;

CREATE OR REPLACE VIEW vJbUebNichtBeurteilt AS 
SELECT apflora.tblAp.ApArtId, apfloraBeob.ArtenDb_Arteigenschaften.Artname, apfloraViews.vFnsKef.FnsKefArt2, apfloraViews.vFnsKef.FnsKefKontrJahr2, apfloraBeob.ArtenDb_Arteigenschaften.FnsJahresartJahr AS FnsJahrespflanze, IF(apfloraBeob.ArtenDb_Arteigenschaften.FnsJahresartJahr=apfloraViews.vJbUebNichtBeurteilt0.JBerJahr,"Ja","") AS FnsJahrespflanze2
FROM ((apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN apflora.tblAp ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId = apflora.tblAp.ApArtId) LEFT JOIN apfloraViews.vFnsKef ON apflora.tblAp.ApArtId = apfloraViews.vFnsKef.TaxonomieId) INNER JOIN apfloraViews.vJbUebNichtBeurteilt0 ON apflora.tblAp.ApArtId = apfloraViews.vJbUebNichtBeurteilt0.ApArtId
WHERE apflora.tblAp.ApStatus Between 1 And 3
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbUeT01 AS 
SELECT apflora.tblAp.ApArtId, apfloraBeob.ArtenDb_Arteigenschaften.Artname
FROM ((apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN (apflora.tblAp INNER JOIN apfloraViews.vApApBerichtRelevant ON apflora.tblAp.ApArtId = apfloraViews.vApApBerichtRelevant.ApArtId) ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId = apflora.tblAp.ApArtId) INNER JOIN apfloraViews.vApAnzMassnBisJahr ON apflora.tblAp.ApArtId = apfloraViews.vApAnzMassnBisJahr.ApArtId) INNER JOIN apflora.tblKonstanten ON apfloraViews.vApAnzMassnBisJahr.TPopMassnJahr = apflora.tblKonstanten.JBerJahr
WHERE apflora.tblAp.ApStatus Between 1 And 3 AND apfloraViews.vApAnzMassnBisJahr.AnzahlMassnahmen>"0"
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vKontrTPopStatusErloschen AS 
SELECT apfloraBeob.ArtenDb_Arteigenschaften.Artname AS Art, apflora.domApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", apflora.tblPop.PopNr, apflora.tblPop.PopName, apflora.tblTPop.TPopNr, apflora.tblTPop.TPopGemeinde, apflora.tblTPop.TPopFlurname, apflora.tblTPop.TPopHerkunft, apflora.tblTPopBer.TPopBerEntwicklung, apflora.tblTPopBer.TPopBerJahr
FROM ((apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN apflora.tblAp ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId = apflora.tblAp.ApArtId) INNER JOIN (apflora.tblPop INNER JOIN (apflora.tblTPop INNER JOIN (apflora.tblTPopBer INNER JOIN apfloraViews.vTPopBerLetzterBericht ON (apflora.tblTPopBer.TPopId = apfloraViews.vTPopBerLetzterBericht.TPopId) AND (apflora.tblTPopBer.TPopBerJahr = apfloraViews.vTPopBerLetzterBericht.MaxvonTPopBerJahr)) ON apflora.tblTPop.TPopId = apflora.tblTPopBer.TPopId) ON apflora.tblPop.PopId = apflora.tblTPop.PopId) ON apflora.tblAp.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.domApBearbeitungsstand ON apflora.tblAp.ApStatus = apflora.domApBearbeitungsstand.DomainCode
WHERE ((apflora.tblAp.ApStatus Between 1 And 3) AND (apflora.tblTPop.TPopHerkunft=101 Or apflora.tblTPop.TPopHerkunft=202) AND (apflora.tblTPopBer.TPopBerEntwicklung<>8)) OR ((apflora.tblAp.ApStatus Between 1 And 3) AND (apflora.tblTPop.TPopHerkunft Not Like 101 And apflora.tblTPop.TPopHerkunft Not Like 202) AND (apflora.tblTPopBer.TPopBerEntwicklung=8))
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname, apflora.tblPop.PopNr, apflora.tblPop.PopName, apflora.tblTPop.TPopNr, apflora.tblTPop.TPopGemeinde, apflora.tblTPop.TPopFlurname;

#im Gebrauch (Access):
CREATE OR REPLACE VIEW vBerJb AS 
SELECT apflora.tblAp.*, apfloraBeob.ArtenDb_Arteigenschaften.Artname AS Art, apflora.tblJBer.JBerId, apflora.tblJBer.JBerJahr, apflora.tblJBer.JBerSituation, apflora.tblJBer.JBerVergleichVorjahrGesamtziel, apflora.tblJBer.JBerBeurteilung, apflora.tblJBer.JBerAnalyse, apflora.tblJBer.JBerUmsetzung, apflora.tblJBer.JBerErfko, apflora.tblJBer.JBerATxt, apflora.tblJBer.JBerBTxt, apflora.tblJBer.JBerCTxt, apflora.tblJBer.JBerDTxt, apflora.tblJBer.JBerDatum, apflora.tblJBer.JBerBearb, apflora.tblAdresse.AdrName & ", " & apflora.tblAdresse.AdrAdresse AS Bearbeiter, apflora.tblJBerUebersicht.JbuJahr, apflora.tblJBerUebersicht.JbuBemerkungen, apfloraViews.vErsteMassnahmeProArt.MinvonTPopMassnJahr AS ErsteMassnahmeImJahr
FROM (apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN (apflora.tblAp LEFT JOIN apfloraViews.vErsteMassnahmeProArt ON apflora.tblAp.ApArtId=apfloraViews.vErsteMassnahmeProArt.ApArtId) ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId=apflora.tblAp.ApArtId) INNER JOIN (((apflora.tblJBer LEFT JOIN apflora.tblAdresse ON apflora.tblJBer.JBerBearb=apflora.tblAdresse.AdrId) LEFT JOIN apflora.tblJBerUebersicht ON apflora.tblJBer.JBerJahr=apflora.tblJBerUebersicht.JbuJahr) INNER JOIN apflora.tblKonstanten ON apflora.tblJBer.JBerJahr=apflora.tblKonstanten.JBerJahr) ON apflora.tblAp.ApArtId=apflora.tblJBer.ApArtId
WHERE apflora.tblAp.ApStatus Between 1 And 3 AND apflora.tblAp.ApArtId NOT IN (100, 150)
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname;

CREATE OR REPLACE VIEW vJbB2rPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblPop.PopId
FROM ((apfloraViews.vLetzterPopBericht INNER JOIN apflora.tblPop ON apfloraViews.vLetzterPopBericht.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.tblPopBer ON (apflora.tblPop.PopId = apflora.tblPopBer.PopId) AND (apfloraViews.vLetzterPopBericht.PopId = apflora.tblPopBer.PopId) AND (apfloraViews.vLetzterPopBericht.MaxvonPopBerJahr = apflora.tblPopBer.PopBerJahr)) INNER JOIN apflora.tblTPop ON apflora.tblPop.PopId = apflora.tblTPop.PopId
WHERE apflora.tblPopBer.PopBerEntwicklung=3 AND apflora.tblTPop.TPopApBerichtRelevant=1 AND apflora.tblPop.PopHerkunft <> 300
GROUP BY apflora.tblPop.ApArtId, apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbB3rPop AS
SELECT apflora.tblPop.ApArtId, apflora.tblPop.PopId
FROM ((apfloraViews.vLetzterPopBericht INNER JOIN apflora.tblPop ON apfloraViews.vLetzterPopBericht.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.tblPopBer ON (apflora.tblPop.PopId = apflora.tblPopBer.PopId) AND (apfloraViews.vLetzterPopBericht.PopId = apflora.tblPopBer.PopId) AND (apfloraViews.vLetzterPopBericht.MaxvonPopBerJahr = apflora.tblPopBer.PopBerJahr)) INNER JOIN apflora.tblTPop ON apflora.tblPop.PopId = apflora.tblTPop.PopId
WHERE apflora.tblPopBer.PopBerEntwicklung=2 AND apflora.tblTPop.TPopApBerichtRelevant=1 AND apflora.tblPop.PopHerkunft <> 300
GROUP BY apflora.tblPop.ApArtId, apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbB4rPop AS
SELECT apflora.tblPop.ApArtId, apflora.tblPop.PopId
FROM ((apfloraViews.vLetzterPopBericht INNER JOIN apflora.tblPop ON apfloraViews.vLetzterPopBericht.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.tblPopBer ON (apflora.tblPop.PopId = apflora.tblPopBer.PopId) AND (apfloraViews.vLetzterPopBericht.PopId = apflora.tblPopBer.PopId) AND (apfloraViews.vLetzterPopBericht.MaxvonPopBerJahr = apflora.tblPopBer.PopBerJahr)) INNER JOIN apflora.tblTPop ON apflora.tblPop.PopId = apflora.tblTPop.PopId
WHERE apflora.tblPopBer.PopBerEntwicklung=1 AND apflora.tblTPop.TPopApBerichtRelevant=1 AND apflora.tblPop.PopHerkunft <> 300
GROUP BY apflora.tblPop.ApArtId, apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbB5rPop AS
SELECT apflora.tblPop.ApArtId, apflora.tblPop.PopId
FROM ((apfloraViews.vLetzterPopBericht INNER JOIN apflora.tblPop ON apfloraViews.vLetzterPopBericht.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.tblPopBer ON (apflora.tblPop.PopId = apflora.tblPopBer.PopId) AND (apfloraViews.vLetzterPopBericht.PopId = apflora.tblPopBer.PopId) AND (apfloraViews.vLetzterPopBericht.MaxvonPopBerJahr = apflora.tblPopBer.PopBerJahr)) INNER JOIN apflora.tblTPop ON apflora.tblPop.PopId = apflora.tblTPop.PopId
WHERE (apflora.tblPopBer.PopBerEntwicklung=4 Or apflora.tblPopBer.PopBerEntwicklung=9) AND apflora.tblTPop.TPopApBerichtRelevant=1 AND apflora.tblPop.PopHerkunft <> 300
GROUP BY apflora.tblPop.ApArtId, apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbB6rPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblPop.PopId
FROM ((apfloraViews.vLetzterPopBericht INNER JOIN apflora.tblPop ON apfloraViews.vLetzterPopBericht.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.tblPopBer ON (apflora.tblPop.PopId = apflora.tblPopBer.PopId) AND (apfloraViews.vLetzterPopBericht.PopId = apflora.tblPopBer.PopId) AND (apfloraViews.vLetzterPopBericht.MaxvonPopBerJahr = apflora.tblPopBer.PopBerJahr)) INNER JOIN apflora.tblTPop ON apflora.tblPop.PopId = apflora.tblTPop.PopId
WHERE apflora.tblPopBer.PopBerEntwicklung=8 AND apflora.tblTPop.TPopApBerichtRelevant=1 AND apflora.tblPop.PopHerkunft <> 300
GROUP BY apflora.tblPop.ApArtId, apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbB2rTPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblTPop.TPopId
FROM apflora.tblTPop INNER JOIN (apflora.tblTPopBer INNER JOIN (apflora.tblPop INNER JOIN apfloraViews.vLetzterTPopBericht ON apflora.tblPop.ApArtId = apfloraViews.vLetzterTPopBericht.ApArtId) ON (apflora.tblTPopBer.TPopId = apfloraViews.vLetzterTPopBericht.TPopId) AND (apflora.tblTPopBer.TPopBerJahr = apfloraViews.vLetzterTPopBericht.MaxvonTPopBerJahr)) ON (apflora.tblTPop.PopId = apflora.tblPop.PopId) AND (apflora.tblTPop.TPopId = apflora.tblTPopBer.TPopId)
WHERE apflora.tblTPopBer.TPopBerEntwicklung=3 AND apflora.tblTPop.TPopApBerichtRelevant=1 AND apflora.tblPop.PopHerkunft <> 300
GROUP BY apflora.tblPop.ApArtId, apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbB3rTPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblTPop.TPopId
FROM apflora.tblTPop INNER JOIN (apflora.tblTPopBer INNER JOIN (apflora.tblPop INNER JOIN apfloraViews.vLetzterTPopBericht ON apflora.tblPop.ApArtId = apfloraViews.vLetzterTPopBericht.ApArtId) ON (apflora.tblTPopBer.TPopId = apfloraViews.vLetzterTPopBericht.TPopId) AND (apflora.tblTPopBer.TPopBerJahr = apfloraViews.vLetzterTPopBericht.MaxvonTPopBerJahr)) ON (apflora.tblTPop.PopId = apflora.tblPop.PopId) AND (apflora.tblTPop.TPopId = apflora.tblTPopBer.TPopId)
WHERE apflora.tblTPopBer.TPopBerEntwicklung=2 AND apflora.tblTPop.TPopApBerichtRelevant=1 AND apflora.tblPop.PopHerkunft <> 300
GROUP BY apflora.tblPop.ApArtId, apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbB4rTPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblTPop.TPopId
FROM apflora.tblTPop INNER JOIN (apflora.tblTPopBer INNER JOIN (apflora.tblPop INNER JOIN apfloraViews.vLetzterTPopBericht ON apflora.tblPop.ApArtId = apfloraViews.vLetzterTPopBericht.ApArtId) ON (apflora.tblTPopBer.TPopId = apfloraViews.vLetzterTPopBericht.TPopId) AND (apflora.tblTPopBer.TPopBerJahr = apfloraViews.vLetzterTPopBericht.MaxvonTPopBerJahr)) ON (apflora.tblTPop.PopId = apflora.tblPop.PopId) AND (apflora.tblTPop.TPopId = apflora.tblTPopBer.TPopId)
WHERE apflora.tblTPopBer.TPopBerEntwicklung=1 AND apflora.tblTPop.TPopApBerichtRelevant=1 AND apflora.tblPop.PopHerkunft <> 300
GROUP BY apflora.tblPop.ApArtId, apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbB5rTPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblTPop.TPopId
FROM apflora.tblTPop INNER JOIN (apflora.tblTPopBer INNER JOIN (apflora.tblPop INNER JOIN apfloraViews.vLetzterTPopBericht ON apflora.tblPop.ApArtId = apfloraViews.vLetzterTPopBericht.ApArtId) ON (apflora.tblTPopBer.TPopId = apfloraViews.vLetzterTPopBericht.TPopId) AND (apflora.tblTPopBer.TPopBerJahr = apfloraViews.vLetzterTPopBericht.MaxvonTPopBerJahr)) ON (apflora.tblTPop.PopId = apflora.tblPop.PopId) AND (apflora.tblTPop.TPopId = apflora.tblTPopBer.TPopId)
WHERE apflora.tblTPopBer.TPopBerEntwicklung=4 AND apflora.tblTPop.TPopApBerichtRelevant=1 AND apflora.tblPop.PopHerkunft <> 300
GROUP BY apflora.tblPop.ApArtId, apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbB6rTPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblTPop.TPopId
FROM apflora.tblTPop INNER JOIN (apflora.tblTPopBer INNER JOIN (apflora.tblPop INNER JOIN apfloraViews.vLetzterTPopBericht ON apflora.tblPop.ApArtId = apfloraViews.vLetzterTPopBericht.ApArtId) ON (apflora.tblTPopBer.TPopId = apfloraViews.vLetzterTPopBericht.TPopId) AND (apflora.tblTPopBer.TPopBerJahr = apfloraViews.vLetzterTPopBericht.MaxvonTPopBerJahr)) ON (apflora.tblTPop.PopId = apflora.tblPop.PopId) AND (apflora.tblTPop.TPopId = apflora.tblTPopBer.TPopId)
WHERE apflora.tblTPopBer.TPopBerEntwicklung=8 AND apflora.tblTPop.TPopApBerichtRelevant=1 AND apflora.tblPop.PopHerkunft <> 300
GROUP BY apflora.tblPop.ApArtId, apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbC1rPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblPop.PopId
FROM apflora.tblKonstanten, (apflora.tblPop INNER JOIN apflora.tblTPop ON apflora.tblPop.PopId = apflora.tblTPop.PopId) INNER JOIN apflora.tblTPopMassn ON apflora.tblTPop.TPopId = apflora.tblTPopMassn.TPopId
WHERE apflora.tblTPopMassn.TPopMassnJahr<=apflora.tblKonstanten.JBerJahr AND apflora.tblTPop.TPopApBerichtRelevant=1 AND apflora.tblPop.PopHerkunft <> 300
GROUP BY apflora.tblPop.ApArtId, apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbC3rPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblPop.PopId
FROM (apfloraViews.vLetzterPopMassnBericht INNER JOIN apflora.tblPop ON apfloraViews.vLetzterPopMassnBericht.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.tblPopMassnBer ON (apflora.tblPop.PopId = apflora.tblPopMassnBer.PopId) AND (apfloraViews.vLetzterPopMassnBericht.MaxvonPopMassnBerJahr = apflora.tblPopMassnBer.PopMassnBerJahr) AND (apfloraViews.vLetzterPopMassnBericht.PopId = apflora.tblPopMassnBer.PopId)
WHERE apflora.tblPopMassnBer.PopMassnBerErfolgsbeurteilung=1
GROUP BY apflora.tblPop.ApArtId, apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbC4rPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblPop.PopId
FROM (apfloraViews.vLetzterPopMassnBericht INNER JOIN apflora.tblPop ON apfloraViews.vLetzterPopMassnBericht.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.tblPopMassnBer ON (apflora.tblPop.PopId = apflora.tblPopMassnBer.PopId) AND (apfloraViews.vLetzterPopMassnBericht.MaxvonPopMassnBerJahr = apflora.tblPopMassnBer.PopMassnBerJahr) AND (apfloraViews.vLetzterPopMassnBericht.PopId = apflora.tblPopMassnBer.PopId)
WHERE (((apflora.tblPopMassnBer.PopMassnBerErfolgsbeurteilung)=2))
GROUP BY apflora.tblPop.ApArtId, apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbC5rPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblPop.PopId
FROM (apfloraViews.vLetzterPopMassnBericht INNER JOIN apflora.tblPop ON apfloraViews.vLetzterPopMassnBericht.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.tblPopMassnBer ON (apflora.tblPop.PopId = apflora.tblPopMassnBer.PopId) AND (apfloraViews.vLetzterPopMassnBericht.MaxvonPopMassnBerJahr = apflora.tblPopMassnBer.PopMassnBerJahr) AND (apfloraViews.vLetzterPopMassnBericht.PopId = apflora.tblPopMassnBer.PopId)
WHERE apflora.tblPopMassnBer.PopMassnBerErfolgsbeurteilung=3
GROUP BY apflora.tblPop.ApArtId, apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbC6rPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblPop.PopId
FROM (apfloraViews.vLetzterPopMassnBericht INNER JOIN apflora.tblPop ON apfloraViews.vLetzterPopMassnBericht.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.tblPopMassnBer ON (apflora.tblPop.PopId = apflora.tblPopMassnBer.PopId) AND (apfloraViews.vLetzterPopMassnBericht.PopId = apflora.tblPopMassnBer.PopId) AND (apfloraViews.vLetzterPopMassnBericht.MaxvonPopMassnBerJahr = apflora.tblPopMassnBer.PopMassnBerJahr)
WHERE apflora.tblPopMassnBer.PopMassnBerErfolgsbeurteilung=4
GROUP BY apflora.tblPop.ApArtId, apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbC7rPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblPop.PopId
FROM (apfloraViews.vLetzterPopMassnBericht INNER JOIN apflora.tblPop ON apfloraViews.vLetzterPopMassnBericht.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.tblPopMassnBer ON (apflora.tblPop.PopId = apflora.tblPopMassnBer.PopId) AND (apfloraViews.vLetzterPopMassnBericht.PopId = apflora.tblPopMassnBer.PopId) AND (apfloraViews.vLetzterPopMassnBericht.MaxvonPopMassnBerJahr = apflora.tblPopMassnBer.PopMassnBerJahr)
WHERE apflora.tblPopMassnBer.PopMassnBerErfolgsbeurteilung=5
GROUP BY apflora.tblPop.ApArtId, apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbC3rTPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblTPop.TPopId
FROM ((apfloraViews.vLetzterTPopMassnBericht INNER JOIN apflora.tblPop ON apfloraViews.vLetzterTPopMassnBericht.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.tblTPopMassnBer ON (apfloraViews.vLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = apflora.tblTPopMassnBer.TPopMassnBerJahr) AND (apfloraViews.vLetzterTPopMassnBericht.TPopId = apflora.tblTPopMassnBer.TPopId)) INNER JOIN apflora.tblTPop ON (apflora.tblTPopMassnBer.TPopId = apflora.tblTPop.TPopId) AND (apflora.tblPop.PopId = apflora.tblTPop.PopId)
WHERE apflora.tblTPopMassnBer.TPopMassnBerErfolgsbeurteilung=1
GROUP BY apflora.tblPop.ApArtId, apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbC4rTPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblTPop.TPopId
FROM ((apfloraViews.vLetzterTPopMassnBericht INNER JOIN apflora.tblPop ON apfloraViews.vLetzterTPopMassnBericht.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.tblTPopMassnBer ON (apfloraViews.vLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = apflora.tblTPopMassnBer.TPopMassnBerJahr) AND (apfloraViews.vLetzterTPopMassnBericht.TPopId = apflora.tblTPopMassnBer.TPopId)) INNER JOIN apflora.tblTPop ON (apflora.tblTPopMassnBer.TPopId = apflora.tblTPop.TPopId) AND (apflora.tblPop.PopId = apflora.tblTPop.PopId)
WHERE (apflora.tblTPopMassnBer.TPopMassnBerErfolgsbeurteilung=2)
GROUP BY apflora.tblPop.ApArtId, apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbC5rTPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblTPop.TPopId
FROM ((apfloraViews.vLetzterTPopMassnBericht INNER JOIN apflora.tblPop ON apfloraViews.vLetzterTPopMassnBericht.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.tblTPopMassnBer ON (apfloraViews.vLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = apflora.tblTPopMassnBer.TPopMassnBerJahr) AND (apfloraViews.vLetzterTPopMassnBericht.TPopId = apflora.tblTPopMassnBer.TPopId)) INNER JOIN apflora.tblTPop ON (apflora.tblTPopMassnBer.TPopId = apflora.tblTPop.TPopId) AND (apflora.tblPop.PopId = apflora.tblTPop.PopId)
WHERE apflora.tblTPopMassnBer.TPopMassnBerErfolgsbeurteilung=3
GROUP BY apflora.tblPop.ApArtId, apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbC6rTPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblTPop.TPopId
FROM ((apfloraViews.vLetzterTPopMassnBericht INNER JOIN apflora.tblPop ON apfloraViews.vLetzterTPopMassnBericht.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.tblTPopMassnBer ON (apfloraViews.vLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = apflora.tblTPopMassnBer.TPopMassnBerJahr) AND (apfloraViews.vLetzterTPopMassnBericht.TPopId = apflora.tblTPopMassnBer.TPopId)) INNER JOIN apflora.tblTPop ON (apflora.tblTPopMassnBer.TPopId = apflora.tblTPop.TPopId) AND (apflora.tblPop.PopId = apflora.tblTPop.PopId)
WHERE apflora.tblTPopMassnBer.TPopMassnBerErfolgsbeurteilung=4
GROUP BY apflora.tblPop.ApArtId, apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbC7rTPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblTPop.TPopId
FROM ((apfloraViews.vLetzterTPopMassnBericht INNER JOIN apflora.tblPop ON apfloraViews.vLetzterTPopMassnBericht.ApArtId = apflora.tblPop.ApArtId) INNER JOIN apflora.tblTPopMassnBer ON (apfloraViews.vLetzterTPopMassnBericht.TPopId = apflora.tblTPopMassnBer.TPopId) AND (apfloraViews.vLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = apflora.tblTPopMassnBer.TPopMassnBerJahr)) INNER JOIN apflora.tblTPop ON (apflora.tblTPopMassnBer.TPopId = apflora.tblTPop.TPopId) AND (apflora.tblPop.PopId = apflora.tblTPop.PopId)
WHERE apflora.tblTPopMassnBer.TPopMassnBerErfolgsbeurteilung=5
GROUP BY apflora.tblPop.ApArtId, apflora.tblTPop.TPopId;

CREATE OR REPLACE VIEW vJbA1lPop AS 
SELECT apflora.tblPop.ApArtId, apflora.tblPop.PopId
FROM apflora.tblPop INNER JOIN apflora.tblTPop ON apflora.tblPop.PopId = apflora.tblTPop.PopId
WHERE apflora.tblTPop.TPopApBerichtRelevant=1 AND apflora.tblPop.PopHerkunft <> 300
GROUP BY apflora.tblPop.ApArtId, apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vJbA2lPop AS
SELECT apflora.tblPop.ApArtId, apflora.tblPop.PopId
FROM apflora.tblPop INNER JOIN apflora.tblTPop ON apflora.tblPop.PopId = apflora.tblTPop.PopId
WHERE apflora.tblPop.PopHerkunft=100 AND apflora.tblTPop.TPopApBerichtRelevant=1
GROUP BY apflora.tblPop.ApArtId, apflora.tblPop.PopId;

CREATE OR REPLACE VIEW vPop_BerUndMassnBer AS
SELECT apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId AS "AP ApArtId", apfloraBeob.ArtenDb_Arteigenschaften.Artname AS "AP Art", apflora.domApBearbeitungsstand.DomainTxt AS "AP Status", apflora.tblAp.ApJahr AS "AP Start im Jahr", apflora.domApUmsetzung.DomainTxt AS "AP Stand Umsetzung", apflora.tblPop.PopGuid AS "Pop Guid", apflora.tblPop.PopNr AS "Pop Nr", apflora.tblPop.PopName AS "Pop Name", domPopHerkunft.HerkunftTxt AS "Pop Status", apflora.tblPop.PopBekanntSeit AS "Pop bekannt seit", apflora.tblPop.PopHerkunftUnklar AS "Pop Status unklar", apflora.tblPop.PopHerkunftUnklarBegruendung AS "Pop Begruendung fuer unklaren Status", apflora.tblPop.PopXKoord AS "Pop X-Koordinaten", apflora.tblPop.PopYKoord AS "Pop Y-Koordinaten", apflora.tblPop.MutWann AS "Datensatz zuletzt geaendert", apflora.tblPop.MutWer AS "Datensatz zuletzt geaendert von", apfloraViews.vPopBerMassnJahre.Jahr, apflora.tblPopBer.PopBerId AS "PopBer Id", apflora.tblPopBer.PopBerJahr AS "PopBer Jahr", domPopEntwicklung.EntwicklungTxt AS "PopBer Entwicklung", apflora.tblPopBer.PopBerTxt AS "PopBer Bemerkungen", apflora.tblPopBer.MutWann AS "PopBer MutWann", apflora.tblPopBer.MutWer AS "PopBer MutWer", apflora.tblPopMassnBer.PopMassnBerId AS "PopMassnBer Id", apflora.tblPopMassnBer.PopMassnBerJahr AS "PopMassnBer Jahr", domTPopMassnErfolgsbeurteilung.BeurteilTxt AS "PopMassnBer Entwicklung", apflora.tblPopMassnBer.PopMassnBerTxt AS "PopMassnBer Interpretation", apflora.tblPopMassnBer.MutWann AS "PopMassnBer MutWann", apflora.tblPopMassnBer.MutWer AS "PopMassnBer MutWer"
FROM (((((((apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN apflora.tblAp ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId = apflora.tblAp.ApArtId) INNER JOIN apflora.tblPop ON apflora.tblAp.ApArtId = apflora.tblPop.ApArtId) LEFT JOIN apflora.domApBearbeitungsstand ON apflora.tblAp.ApStatus = apflora.domApBearbeitungsstand.DomainCode) LEFT JOIN apflora.domApUmsetzung ON apflora.tblAp.ApUmsetzung = apflora.domApUmsetzung.DomainCode) LEFT JOIN apflora.domPopHerkunft ON apflora.tblPop.PopHerkunft = domPopHerkunft.HerkunftId) LEFT JOIN apfloraViews.vPopBerMassnJahre ON apflora.tblPop.PopId = apfloraViews.vPopBerMassnJahre.PopId) LEFT JOIN (apflora.tblPopMassnBer LEFT JOIN apflora.domTPopMassnErfolgsbeurteilung ON apflora.tblPopMassnBer.PopMassnBerErfolgsbeurteilung = domTPopMassnErfolgsbeurteilung.BeurteilId) ON (apfloraViews.vPopBerMassnJahre.Jahr = apflora.tblPopMassnBer.PopMassnBerJahr) AND (apfloraViews.vPopBerMassnJahre.PopId = apflora.tblPopMassnBer.PopId)) LEFT JOIN (apflora.tblPopBer LEFT JOIN apflora.domPopEntwicklung ON apflora.tblPopBer.PopBerEntwicklung = domPopEntwicklung.EntwicklungId) ON (apfloraViews.vPopBerMassnJahre.Jahr = apflora.tblPopBer.PopBerJahr) AND (apfloraViews.vPopBerMassnJahre.PopId = apflora.tblPopBer.PopId)
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname, apflora.tblPop.PopNr, apfloraViews.vPopBerMassnJahre.Jahr;

CREATE OR REPLACE VIEW vTPop_BerUndMassnBer AS
SELECT apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId AS ApArtId, apfloraBeob.ArtenDb_Arteigenschaften.Artname AS "AP Art", apflora.domApBearbeitungsstand.DomainTxt AS "AP Status", apflora.tblAp.ApJahr AS "AP Start im Jahr", apflora.domApUmsetzung.DomainTxt AS "AP Stand Umsetzung", apflora.tblPop.PopGuid AS "Pop Guid", apflora.tblPop.PopNr AS "Pop Nr", apflora.tblPop.PopName AS "Pop Name", domPopHerkunft.HerkunftTxt AS "Pop Status", apflora.tblPop.PopBekanntSeit AS "Pop bekannt seit", apflora.tblPop.PopHerkunftUnklar AS "Pop Status unklar", apflora.tblPop.PopHerkunftUnklarBegruendung AS "Pop Begruendung fuer unklaren Status", apflora.tblPop.PopXKoord AS "Pop X-Koordinaten", apflora.tblPop.PopYKoord AS "Pop Y-Koordinaten", apflora.tblTPop.TPopId AS "TPop ID", apflora.tblTPop.TPopGuid AS "TPop Guid", apflora.tblTPop.TPopNr AS "TPop Nr", apflora.tblTPop.TPopGemeinde AS "TPop Gemeinde", apflora.tblTPop.TPopFlurname AS "TPop Flurname", domPopHerkunft_1.HerkunftTxt AS "TPop Status", apflora.tblTPop.TPopBekanntSeit AS "TPop bekannt seit", apflora.tblTPop.TPopHerkunftUnklar AS "TPop Status unklar", apflora.tblTPop.TPopHerkunftUnklarBegruendung AS "TPop Begruendung fuer unklaren Status", apflora.tblTPop.TPopXKoord AS "TPop X-Koordinaten", apflora.tblTPop.TPopYKoord AS "TPop Y-Koordinaten", apflora.tblTPop.TPopRadius AS "TPop Radius (m)", apflora.tblTPop.TPopHoehe AS "TPop Hoehe", apflora.tblTPop.TPopExposition AS "TPop Exposition", apflora.tblTPop.TPopKlima AS "TPop Klima", apflora.tblTPop.TPopNeigung AS "TPop Hangneigung", apflora.tblTPop.TPopBeschr AS "TPop Beschreibung", apflora.tblTPop.TPopKatNr AS "TPop Kataster-Nr", apflora.tblTPop.TPopApBerichtRelevant AS "TPop fuer AP-Bericht relevant", apflora.tblTPop.TPopEigen AS "TPop EigentuemerIn", apflora.tblTPop.TPopKontakt AS "TPop Kontakt vor Ort", apflora.tblTPop.TPopNutzungszone AS "TPop Nutzungszone", apflora.tblTPop.TPopBewirtschafterIn AS "TPop BewirtschafterIn", apflora.tblTPop.TPopBewirtschaftung AS "TPop Bewirtschaftung", apfloraViews.vTPopBerMassnJahre.Jahr, apflora.tblTPopBer.TPopBerId AS "TPopBer Id", apflora.tblTPopBer.TPopBerJahr AS "TPopBer Jahr", domPopEntwicklung.EntwicklungTxt AS "TPopBer Entwicklung", apflora.tblTPopBer.TPopBerTxt AS "TPopBer Bemerkungen", apflora.tblTPopBer.MutWann AS "TPopBer MutWann", apflora.tblTPopBer.MutWer AS "TPopBer MutWer", apflora.tblTPopMassnBer.TPopMassnBerJahr AS "TPopMassnBer Jahr", domTPopMassnErfolgsbeurteilung.BeurteilTxt AS "TPopMassnBer Entwicklung", apflora.tblTPopMassnBer.TPopMassnBerTxt AS "TPopMassnBer Interpretation", apflora.tblTPopMassnBer.MutWann AS "TPopMassnBer MutWann", apflora.tblTPopMassnBer.MutWer AS "TPopMassnBer MutWer"
FROM ((((((((((apfloraBeob.ArtenDb_Arteigenschaften RIGHT JOIN apflora.tblAp ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId = apflora.tblAp.ApArtId) RIGHT JOIN (apflora.tblPop RIGHT JOIN apflora.tblTPop ON apflora.tblPop.PopId = apflora.tblTPop.PopId) ON apflora.tblAp.ApArtId = apflora.tblPop.ApArtId) LEFT JOIN apflora.domApBearbeitungsstand ON apflora.tblAp.ApStatus = apflora.domApBearbeitungsstand.DomainCode) LEFT JOIN apflora.domApUmsetzung ON apflora.tblAp.ApUmsetzung = apflora.domApUmsetzung.DomainCode) LEFT JOIN apflora.domPopHerkunft ON apflora.tblPop.PopHerkunft = domPopHerkunft.HerkunftId) LEFT JOIN apflora.domPopHerkunft AS domPopHerkunft_1 ON apflora.tblTPop.TPopHerkunft = domPopHerkunft_1.HerkunftId) LEFT JOIN apfloraViews.vTPopBerMassnJahre ON apflora.tblTPop.TPopId = apfloraViews.vTPopBerMassnJahre.TPopId) LEFT JOIN apflora.tblTPopMassnBer ON (apfloraViews.vTPopBerMassnJahre.TPopId = apflora.tblTPopMassnBer.TPopId) AND (apfloraViews.vTPopBerMassnJahre.Jahr = apflora.tblTPopMassnBer.TPopMassnBerJahr)) LEFT JOIN apflora.domTPopMassnErfolgsbeurteilung ON apflora.tblTPopMassnBer.TPopMassnBerErfolgsbeurteilung = domTPopMassnErfolgsbeurteilung.BeurteilId) LEFT JOIN apflora.tblTPopBer ON (apfloraViews.vTPopBerMassnJahre.Jahr = apflora.tblTPopBer.TPopBerJahr) AND (apfloraViews.vTPopBerMassnJahre.TPopId = apflora.tblTPopBer.TPopId)) LEFT JOIN apflora.domPopEntwicklung ON apflora.tblTPopBer.TPopBerEntwicklung = domPopEntwicklung.EntwicklungId
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname, apflora.tblPop.PopNr, apflora.tblTPop.TPopNr, apfloraViews.vTPopBerMassnJahre.Jahr;

CREATE OR REPLACE VIEW vPop_BerMassnJahreVonTPop AS 
SELECT apflora.tblTPop.PopId, apfloraViews.vTPopBerMassnJahre.Jahr
FROM apfloraViews.vTPopBerMassnJahre INNER JOIN apflora.tblTPop ON apfloraViews.vTPopBerMassnJahre.TPopId = apflora.tblTPop.TPopId
GROUP BY apflora.tblTPop.PopId, apfloraViews.vTPopBerMassnJahre.Jahr;

#CREATE OR REPLACE VIEW vKontrLetzte AS
#SELECT * FROM apfloraViews.vKontr INNER JOIN apfloraViews.vKontrLetzteId ON apfloraViews.vKontr.TPopKontrId = apfloraViews.vKontrLetzteId.MaxTPopKontrId;

CREATE OR REPLACE VIEW vTPopBerMitLetzterId AS
SELECT apflora.tblTPopBer.TPopId, apfloraViews.vTPopBerLetzteId.AnzTPopBer, apflora.tblTPopBer.TPopBerId, apflora.tblTPopBer.TPopBerJahr AS "TPopBer Jahr", apflora.tblTPopBer.TPopBerEntwicklung AS "TPopBer Entwicklung", apflora.tblTPopBer.TPopBerTxt AS "TPopBer Bemerkungen", apflora.tblTPopBer.MutWann AS "TPopBer  MutWann", apflora.tblTPopBer.MutWer AS "TPopBer MutWer"
FROM apfloraViews.vTPopBerLetzteId INNER JOIN apflora.tblTPopBer ON (apfloraViews.vTPopBerLetzteId.MaxTPopBerId = apflora.tblTPopBer.TPopBerId) AND (apfloraViews.vTPopBerLetzteId.TPopId = apflora.tblTPopBer.TPopId);

#funktioniert nicht, wenn letzeKontrolle als Unterabfrage eingebunden wird. Grund: Unterabfragen in der FROM-Klausel duerfen keine korrellierten Unterabfragen sein
CREATE OR REPLACE VIEW vTPopAnzKontrInklLetzteKontr AS
SELECT apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId AS ApArtId, apfloraBeob.ArtenDb_Arteigenschaften.Familie, apfloraBeob.ArtenDb_Arteigenschaften.Artname AS "AP Art", apflora.domApBearbeitungsstand.DomainTxt AS "AP Status", apflora.tblAp.ApJahr AS "AP Start im Jahr", apflora.domApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblAdresse_1.AdrName AS "AP verantwortlich", apflora.tblPop.PopGuid AS "Pop Guid", apflora.tblPop.PopNr AS "Pop Nr", apflora.tblPop.PopName AS "Pop Name", apflora.domPopHerkunft.HerkunftTxt AS "Pop Herkunft", apflora.tblPop.PopBekanntSeit AS "Pop bekannt seit", apflora.tblTPop.TPopId AS "TPop ID", apflora.tblTPop.TPopGuid AS "TPop Guid", apflora.tblTPop.TPopNr AS "TPop Nr", apflora.tblTPop.TPopGemeinde AS "TPop Gemeinde", apflora.tblTPop.TPopFlurname AS "TPop Flurname", domPopHerkunft_1.HerkunftTxt AS "TPop Status", apflora.tblTPop.TPopBekanntSeit AS "TPop bekannt seit", apflora.tblTPop.TPopHerkunftUnklar AS "TPop Status unklar", apflora.tblTPop.TPopHerkunftUnklarBegruendung AS "TPop Begruendung fuer unklaren Status", apflora.tblTPop.TPopXKoord AS "TPop X-Koordinaten", apflora.tblTPop.TPopYKoord AS "TPop Y-Koordinaten", apflora.tblTPop.TPopRadius AS "TPop Radius m", apflora.tblTPop.TPopHoehe AS "TPop Hoehe", apflora.tblTPop.TPopExposition AS "TPop Exposition", apflora.tblTPop.TPopKlima AS "TPop Klima", apflora.tblTPop.TPopNeigung AS "TPop Hangneigung", apflora.tblTPop.TPopBeschr AS "TPop Beschreibung", apflora.tblTPop.TPopKatNr AS "TPop Kataster-Nr", apflora.tblTPop.TPopApBerichtRelevant AS "TPop fuer AP-Bericht relevant", apflora.tblTPop.TPopEigen AS "TPop EigentuemerIn", apflora.tblTPop.TPopKontakt AS "TPop Kontakt vor Ort", apflora.tblTPop.TPopNutzungszone AS "TPop Nutzungszone", apflora.tblTPop.TPopBewirtschafterIn AS "TPop BewirtschafterIn", apflora.tblTPop.TPopBewirtschaftung AS "TPop Bewirtschaftung", apfloraViews.vKontrLetzteId.AnzTPopKontr AS "TPop Anzahl Kontrollen", apflora.tblTPopKontr.TPopKontrId, apflora.tblTPopKontr.TPopId, apflora.tblTPopKontr.TPopKontrGuid AS "Kontr Guid", apflora.tblTPopKontr.TPopKontrJahr AS "Kontr Jahr", apflora.tblTPopKontr.TPopKontrDatum AS "Kontr Datum", apflora.domTPopFeldkontrTyp.DomainTxt AS "Kontr Typ", apflora.tblAdresse.AdrName AS "Kontr BearbeiterIn", apflora.tblTPopKontr.TPopKontrUeberleb AS "Kontr Ueberlebensrate", apflora.tblTPopKontr.TPopKontrVitalitaet AS "Kontr Vitalitaet", apflora.domPopEntwicklung.EntwicklungTxt AS "Kontr Entwicklung", apflora.tblTPopKontr.TPopKontrUrsach AS "Kontr Ursachen", apflora.tblTPopKontr.TPopKontrUrteil AS "Kontr Erfolgsbeurteilung", apflora.tblTPopKontr.TPopKontrAendUms AS "Kontr Aenderungs-Vorschlaege Umsetzung", apflora.tblTPopKontr.TPopKontrAendKontr AS "Kontr Aenderungs-Vorschlaege Kontrolle", apflora.tblTPop.TPopXKoord AS "Kontr X-Koord", apflora.tblTPop.TPopYKoord AS "Kontr Y-Koord", apflora.tblTPopKontr.TPopKontrTxt AS "Kontr Bemerkungen", apflora.tblTPopKontr.TPopKontrLeb AS "Kontr Lebensraum Delarze", apflora.tblTPopKontr.TPopKontrLebUmg AS "Kontr angrenzender Lebensraum Delarze", apflora.tblTPopKontr.TPopKontrVegTyp AS "Kontr Vegetationstyp", apflora.tblTPopKontr.TPopKontrKonkurrenz AS "Kontr Konkurrenz", apflora.tblTPopKontr.TPopKontrMoosschicht AS "Kontr Moosschicht", apflora.tblTPopKontr.TPopKontrKrautschicht AS "Kontr Krautschicht", apflora.tblTPopKontr.TPopKontrStrauchschicht AS "Kontr Strauchschicht", apflora.tblTPopKontr.TPopKontrBaumschicht AS "Kontr Baumschicht", apflora.tblTPopKontr.TPopKontrBodenTyp AS "Kontr Bodentyp", apflora.tblTPopKontr.TPopKontrBodenKalkgehalt AS "Kontr Boden Kalkgehalt", apflora.tblTPopKontr.TPopKontrBodenDurchlaessigkeit AS "Kontr Boden Durchlaessigkeit", apflora.tblTPopKontr.TPopKontrBodenHumus AS "Kontr Boden Humusgehalt", apflora.tblTPopKontr.TPopKontrBodenNaehrstoffgehalt AS "Kontr Boden Naehrstoffgehalt", apflora.tblTPopKontr.TPopKontrBodenAbtrag AS "Kontr Oberbodenabtrag", apflora.tblTPopKontr.TPopKontrWasserhaushalt AS "Kontr Wasserhaushalt", apflora.domTPopKontrIdBiotUebereinst.DomainTxt AS "Kontr Uebereinstimmung mit Idealbiotop", apflora.tblTPopKontr.TPopKontrHandlungsbedarf AS "Kontr Handlungsbedarf", apflora.tblTPopKontr.TPopKontrUebFlaeche AS "Kontr Ueberpruefte Flaeche", apflora.tblTPopKontr.TPopKontrFlaeche AS "Kontr Flaeche der Teilpopulation m2", apflora.tblTPopKontr.TPopKontrPlan AS "Kontr auf Plan eingezeichnet", apflora.tblTPopKontr.TPopKontrVeg AS "Kontr Deckung durch Vegetation", apflora.tblTPopKontr.TPopKontrNaBo AS "Kontr Deckung nackter Boden", apflora.tblTPopKontr.TPopKontrUebPfl AS "Kontr Deckung durch ueberpruefte Art", apflora.tblTPopKontr.TPopKontrJungPflJN AS "Kontr auch junge Pflanzen", apflora.tblTPopKontr.TPopKontrVegHoeMax AS "Kontr maximale Veg-hoehe cm", apflora.tblTPopKontr.TPopKontrVegHoeMit AS "Kontr mittlere Veg-hoehe cm", apflora.tblTPopKontr.TPopKontrGefaehrdung AS "Kontr Gefaehrdung", apflora.tblTPopKontr.MutWann AS "Kontrolle zuletzt geaendert", apflora.tblTPopKontr.MutWer AS "Kontrolle zuletzt geaendert von"
FROM apfloraViews.vKontrLetzteId INNER JOIN (apflora.domPopHerkunft AS domPopHerkunft_1 RIGHT JOIN (((((((apfloraBeob.ArtenDb_Arteigenschaften INNER JOIN apflora.tblAp ON apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId = apflora.tblAp.ApArtId) INNER JOIN (apflora.tblPop INNER JOIN (apflora.tblTPop LEFT JOIN (((apflora.tblTPopKontr LEFT JOIN apflora.domTPopFeldkontrTyp ON apflora.tblTPopKontr.TPopKontrTyp = apflora.domTPopFeldkontrTyp.DomainTxt) LEFT JOIN apflora.tblAdresse ON apflora.tblTPopKontr.TPopKontrBearb = apflora.tblAdresse.AdrId) LEFT JOIN apflora.domPopEntwicklung ON apflora.tblTPopKontr.TPopKontrEntwicklung = apflora.domPopEntwicklung.EntwicklungId) ON apflora.tblTPop.TPopId = apflora.tblTPopKontr.TPopId) ON apflora.tblPop.PopId = apflora.tblTPop.PopId) ON apflora.tblAp.ApArtId = apflora.tblPop.ApArtId) LEFT JOIN apflora.domApBearbeitungsstand ON apflora.tblAp.ApStatus = apflora.domApBearbeitungsstand.DomainCode) LEFT JOIN apflora.domApUmsetzung ON apflora.tblAp.ApUmsetzung = apflora.domApUmsetzung.DomainCode) LEFT JOIN apflora.domPopHerkunft ON apflora.tblPop.PopHerkunft = apflora.domPopHerkunft.HerkunftId) LEFT JOIN apflora.domTPopKontrIdBiotUebereinst ON apflora.tblTPopKontr.TPopKontrIdealBiotopUebereinst = apflora.domTPopKontrIdBiotUebereinst.DomainCode) LEFT JOIN apflora.tblAdresse AS tblAdresse_1 ON apflora.tblAp.ApBearb = tblAdresse_1.AdrId) ON domPopHerkunft_1.HerkunftId = apflora.tblTPop.TPopHerkunft) ON (apfloraViews.vKontrLetzteId.MaxTPopKontrId = apflora.tblTPopKontr.TPopKontrId) AND (apfloraViews.vKontrLetzteId.TPopId = apflora.tblTPopKontr.TPopId)
WHERE apfloraBeob.ArtenDb_Arteigenschaften.TaxonomieId Not In (100,150) AND (apflora.tblTPopKontr.TPopKontrTyp Is Null Or (apflora.tblTPopKontr.TPopKontrTyp Not Like "Ziel" And apflora.tblTPopKontr.TPopKontrTyp Not Like "Zwischenziel"))
ORDER BY apfloraBeob.ArtenDb_Arteigenschaften.Artname, apflora.tblPop.PopNr, apflora.tblTPop.TPopNr, apflora.tblTPopKontr.TPopKontrJahr, apflora.tblTPopKontr.TPopKontrDatum;