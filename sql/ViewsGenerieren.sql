CREATE VIEW vAbfrageGleicherOrt AS 
SELECT tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopAuswahl
FROM tblTeilpopulation
ORDER BY tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord;

CREATE VIEW vAp3 AS 
SELECT tblAktionsplan.*, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopApBerichtRelevant
FROM tblAktionsplan LEFT JOIN (tblPopulation LEFT JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId;

CREATE VIEW vAp2 AS 
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName
FROM tblAktionsplan LEFT JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId;

CREATE VIEW vAp1 AS 
SELECT tblAktionsplan.*, ArtenDb_tblFloraSisf.Name, ArtenDb_tblFloraFnsArtwert.AwArtwert AS Artwert
FROM (ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR=tblAktionsplan.ApArtId) LEFT JOIN ArtenDb_tblFloraFnsArtwert ON ArtenDb_tblFloraSisf.NR=ArtenDb_tblFloraFnsArtwert.SisfNr
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vAp AS 
SELECT tblAktionsplan.*, ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr
FROM (ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR=tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId=tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId=tblPopulation.ApArtId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

CREATE VIEW vApApBerichtRelevant AS 
SELECT tblAktionsplan.ApArtId
FROM tblAktionsplan INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblAktionsplan.ApArtId;

CREATE VIEW vAuswFlurnameArtMassn AS 
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblTeilpopulation.TPopId, tblTeilPopMassnahme.TPopMassnId, tblTeilpopulation.TPopGemeinde AS "Teilpopulation-Gemeinde", tblTeilpopulation.TPopFlurname AS "Teilpopulation-Flurname", tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopMassnahme.TPopMassnJahr AS "TPopMassnahme-Jahr", DomainTPopMassnTyp.MassnTypTxt AS Massnahme, DomainTPopMassnTyp.MassnAnsiedlung AS Ansiedlung, tblTeilPopMassnahme.TPopMassnTxt, tblTeilPopMassnahme.TPopMassnDatum, tblAdresse.AdrName AS TPopMassnBearb, tblTeilPopMassnahme.TPopMassnBemTxt, tblTeilPopMassnahme.TPopMassnPlan, tblTeilPopMassnahme.TPopMassnPlanBez, tblTeilPopMassnahme.TPopMassnFlaeche, tblTeilPopMassnahme.TPopMassnMarkierung, tblTeilPopMassnahme.TPopMassnAnsiedAnzTriebe, tblTeilPopMassnahme.TPopMassnAnsiedAnzPfl, tblTeilPopMassnahme.TPopMassnAnzPflanzstellen, tblTeilPopMassnahme.TPopMassnAnsiedWirtspfl, tblTeilPopMassnahme.TPopMassnAnsiedHerkunftPop, tblTeilPopMassnahme.TPopMassnAnsiedDatSamm, tblTeilPopMassnahme.TPopMassnAnsiedForm, tblTeilPopMassnahme.TPopMassnAnsiedPflanzanordnung
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN ((tblTeilPopMassnahme LEFT JOIN DomainTPopMassnTyp ON tblTeilPopMassnahme.TPopMassnTyp = DomainTPopMassnTyp.MassnTypCode) LEFT JOIN tblAdresse ON tblTeilPopMassnahme.TPopMassnBearb = tblAdresse.AdrId) ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
ORDER BY tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, ArtenDb_tblFloraSisf.Name, tblTeilpopulation.TPopNr, tblTeilPopMassnahme.TPopMassnJahr, DomainTPopMassnTyp.MassnTypTxt;

CREATE VIEW vAuswLetzteAnzahlLetzteKontrolle AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblPopulation.PopId, tblPopulation.PopNr, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, Max(tblTeilPopFeldkontrolle.TPopKontrJahr) AS MaxvonTPopKontrJahr
FROM ArtenDb_tblFloraSisf INNER JOIN (((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId
WHERE (((tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Ziel" And (tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Zwischenziel"))
GROUP BY tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblPopulation.PopId, tblPopulation.PopNr, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr
HAVING (((Max(tblTeilPopFeldkontrolle.TPopKontrJahr)) Is Not Null))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

CREATE VIEW vAuswLetzteAnzLetzteKontrollen AS 
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, DomainPopHerkunft.HerkunftTxt AS TPopHerkunft, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilPopFeldkontrolle.TPopKontrId, tblTeilPopFeldkontrolle.TPopKontrTyp, tblTeilPopFeldkontrolle.TPopKontrDatum, tblTeilPopFeldkontrolle.TPopKontrJahr, tblAdresse.AdrName AS TPopKontrBearb, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit1, DomainTPopKontrMethode.BeurteilTxt AS TPopKontrMethode1, tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS TPopKontrZaehleinheit2, DomainTPopKontrMethode_1.BeurteilTxt AS TPopKontrMethode2, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS TPopKontrZaehleinheit3, DomainTPopKontrMethode_2.BeurteilTxt AS TPopKontrMethode3, tblTeilPopFeldkontrolle.TPopKontrAnz3, tblTeilPopFeldkontrolle.TPopKontrJungpfl, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, tblTeilPopFeldkontrolle.TPopKontrUeberleb, DomainTPopEntwicklung.EntwicklungTxt AS TPopKontrEntwicklung, tblTeilPopFeldkontrolle.TPopKontrUrsach, tblTeilPopFeldkontrolle.TPopKontrUrteil, tblTeilPopFeldkontrolle.TPopKontrAendUms, tblTeilPopFeldkontrolle.TPopKontrAendKontr, tblTeilPopFeldkontrolle.TPopKontrTxt, tblTeilPopFeldkontrolle.TPopKontrLeb, tblTeilPopFeldkontrolle.TPopKontrFlaeche, tblTeilPopFeldkontrolle.TPopKontrLebUmg, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht, tblTeilPopFeldkontrolle.TPopKontrBodenTyp, tblTeilPopFeldkontrolle.TPopKontrBodenAbtrag, tblTeilPopFeldkontrolle.TPopKontrWasserhaushalt, tblTeilPopFeldkontrolle.TPopKontrHandlungsbedarf, tblTeilPopFeldkontrolle.TPopKontrUebFlaeche, tblTeilPopFeldkontrolle.TPopKontrPlan, tblTeilPopFeldkontrolle.TPopKontrVeg, tblTeilPopFeldkontrolle.TPopKontrNaBo, tblTeilPopFeldkontrolle.TPopKontrUebPfl, tblTeilPopFeldkontrolle.TPopKontrJungPflJN, tblTeilPopFeldkontrolle.TPopKontrVegHoeMax, tblTeilPopFeldkontrolle.TPopKontrVegHoeMit, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung, tblTeilPopFeldkontrolle.TPopKontrMutDat
FROM vAuswLetzteAnzahlLetzteKontrolle INNER JOIN ((((((((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainTPopEntwicklung ON tblTeilPopFeldkontrolle.TPopKontrEntwicklung = DomainTPopEntwicklung.EntwicklungCode) LEFT JOIN DomainPopHerkunft ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft.HerkunftId) ON (vAuswLetzteAnzahlLetzteKontrolle.MaxvonTPopKontrJahr = tblTeilPopFeldkontrolle.TPopKontrJahr) AND (vAuswLetzteAnzahlLetzteKontrolle.TPopId = tblTeilPopFeldkontrolle.TPopId)
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopFeldkontrolle.TPopKontrJahr DESC;

CREATE VIEW vAuswLetzteAnzAnz3 AS 
SELECT vAuswLetzteAnzLetzteKontrollen.ApArtId, vAuswLetzteAnzLetzteKontrollen.Name, vAuswLetzteAnzLetzteKontrollen.PopId, vAuswLetzteAnzLetzteKontrollen.PopNr, vAuswLetzteAnzLetzteKontrollen.TPopId, vAuswLetzteAnzLetzteKontrollen.TPopNr, vAuswLetzteAnzLetzteKontrollen.TPopKontrId, vAuswLetzteAnzLetzteKontrollen.TPopKontrTyp, vAuswLetzteAnzLetzteKontrollen.TPopKontrZaehleinheit3 AS Zaehleinheit, vAuswLetzteAnzLetzteKontrollen.TPopKontrAnz3 AS Anzahl, vAuswLetzteAnzLetzteKontrollen.TPopKontrJahr, vAuswLetzteAnzLetzteKontrollen.TPopKontrTxt
FROM vAuswLetzteAnzLetzteKontrollen
WHERE (((vAuswLetzteAnzLetzteKontrollen.TPopKontrTyp) Is Not Null) AND ((vAuswLetzteAnzLetzteKontrollen.TPopKontrZaehleinheit3) Is Not Null) AND ((vAuswLetzteAnzLetzteKontrollen.TPopKontrAnz3) Is Not Null));

CREATE VIEW vAuswLetzteAnzAnz2 AS 
SELECT vAuswLetzteAnzLetzteKontrollen.ApArtId, vAuswLetzteAnzLetzteKontrollen.Name, vAuswLetzteAnzLetzteKontrollen.PopId, vAuswLetzteAnzLetzteKontrollen.PopNr, vAuswLetzteAnzLetzteKontrollen.TPopId, vAuswLetzteAnzLetzteKontrollen.TPopNr, vAuswLetzteAnzLetzteKontrollen.TPopKontrId, vAuswLetzteAnzLetzteKontrollen.TPopKontrTyp, vAuswLetzteAnzLetzteKontrollen.TPopKontrZaehleinheit2 AS Zaehleinheit, vAuswLetzteAnzLetzteKontrollen.TPopKontrAnz2 AS Anzahl, vAuswLetzteAnzLetzteKontrollen.TPopKontrJahr, vAuswLetzteAnzLetzteKontrollen.TPopKontrTxt
FROM vAuswLetzteAnzLetzteKontrollen
WHERE (((vAuswLetzteAnzLetzteKontrollen.TPopKontrTyp) Is Not Null) AND ((vAuswLetzteAnzLetzteKontrollen.TPopKontrZaehleinheit2) Is Not Null) AND ((vAuswLetzteAnzLetzteKontrollen.TPopKontrAnz2) Is Not Null));

CREATE VIEW vAuswLetzteAnzAnz1 AS 
SELECT vAuswLetzteAnzLetzteKontrollen.ApArtId, vAuswLetzteAnzLetzteKontrollen.Name, vAuswLetzteAnzLetzteKontrollen.PopId, vAuswLetzteAnzLetzteKontrollen.PopNr, vAuswLetzteAnzLetzteKontrollen.TPopId, vAuswLetzteAnzLetzteKontrollen.TPopNr, vAuswLetzteAnzLetzteKontrollen.TPopKontrId, vAuswLetzteAnzLetzteKontrollen.TPopKontrTyp, vAuswLetzteAnzLetzteKontrollen.TPopKontrZaehleinheit1 AS Zaehleinheit, vAuswLetzteAnzLetzteKontrollen.TPopKontrAnz1 AS Anzahl, vAuswLetzteAnzLetzteKontrollen.TPopKontrJahr, vAuswLetzteAnzLetzteKontrollen.TPopKontrTxt
FROM vAuswLetzteAnzLetzteKontrollen
WHERE (((vAuswLetzteAnzLetzteKontrollen.TPopKontrTyp) Is Not Null) AND ((vAuswLetzteAnzLetzteKontrollen.TPopKontrZaehleinheit1) Is Not Null) AND ((vAuswLetzteAnzLetzteKontrollen.TPopKontrAnz1) Is Not Null));

CREATE VIEW vAuswLetzteAnzAnz AS
SELECT vAuswLetzteAnzAnz1.ApArtId, vAuswLetzteAnzAnz1.Name, vAuswLetzteAnzAnz1.PopId, vAuswLetzteAnzAnz1.PopNr, vAuswLetzteAnzAnz1.TPopId, vAuswLetzteAnzAnz1.TPopNr, vAuswLetzteAnzAnz1.TPopKontrId, vAuswLetzteAnzAnz1.TPopKontrTyp, vAuswLetzteAnzAnz1.Zaehleinheit, vAuswLetzteAnzAnz1.Anzahl, vAuswLetzteAnzAnz1.TPopKontrjahr, vAuswLetzteAnzAnz1.TPopKontrTxt
FROM vAuswLetzteAnzAnz1
union all
SELECT vAuswLetzteAnzAnz2.ApArtId, vAuswLetzteAnzAnz2.Name, vAuswLetzteAnzAnz2.PopId, vAuswLetzteAnzAnz2.PopNr, vAuswLetzteAnzAnz2.TPopId, vAuswLetzteAnzAnz2.TPopNr, vAuswLetzteAnzAnz2.TPopKontrId, vAuswLetzteAnzAnz2.TPopKontrTyp, vAuswLetzteAnzAnz2.Zaehleinheit, vAuswLetzteAnzAnz2.Anzahl, vAuswLetzteAnzAnz2.TPopKontrjahr, vAuswLetzteAnzAnz2.TPopKontrTxt
FROM vAuswLetzteAnzAnz2
UNION ALL SELECT vAuswLetzteAnzAnz3.ApArtId, vAuswLetzteAnzAnz3.Name, vAuswLetzteAnzAnz3.PopId, vAuswLetzteAnzAnz3.PopNr, vAuswLetzteAnzAnz3.TPopId, vAuswLetzteAnzAnz3.TPopNr, vAuswLetzteAnzAnz3.TPopKontrId, vAuswLetzteAnzAnz3.TPopKontrTyp, vAuswLetzteAnzAnz3.Zaehleinheit, vAuswLetzteAnzAnz3.Anzahl, vAuswLetzteAnzAnz3.TPopKontrjahr, vAuswLetzteAnzAnz3.TPopKontrTxt
FROM vAuswLetzteAnzAnz3;

CREATE VIEW vAuswKontrAnzAnz1 AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilPopFeldkontrolle.TPopKontrId, tblTeilPopFeldkontrolle.TPopKontrTyp, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit, tblTeilPopFeldkontrolle.TPopKontrAnz1 AS TPopKontrAnz, tblTeilPopFeldkontrolle.TPopKontrJahr, tblAdresse.AdrName AS TPopKontrBearb
FROM (DomainTPopKontrZaehleinheit INNER JOIN ((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON DomainTPopKontrZaehleinheit.ZaehleinheitCode = tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId
WHERE (((tblTeilPopFeldkontrolle.TPopKontrTyp) Is Not Null) AND ((DomainTPopKontrZaehleinheit.ZaehleinheitTxt) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrAnz1) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrJahr) Is Not Null)) AND (((tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Ziel" And (tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Zwischenziel"));

CREATE VIEW vAuswKontrAnzAnz2 AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilPopFeldkontrolle.TPopKontrId, tblTeilPopFeldkontrolle.TPopKontrTyp, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit, tblTeilPopFeldkontrolle.TPopKontrAnz2 AS TPopKontrAnz, tblTeilPopFeldkontrolle.TPopKontrJahr, tblAdresse.AdrName AS TPopKontrBearb
FROM (DomainTPopKontrZaehleinheit INNER JOIN ((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON DomainTPopKontrZaehleinheit.ZaehleinheitCode = tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId
WHERE (((tblTeilPopFeldkontrolle.TPopKontrTyp) Is Not Null) AND ((DomainTPopKontrZaehleinheit.ZaehleinheitTxt) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrAnz2) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrJahr) Is Not Null)) AND (((tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Ziel" And (tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Zwischenziel"));

CREATE VIEW vAuswKontrAnzAnz3 AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilPopFeldkontrolle.TPopKontrId, tblTeilPopFeldkontrolle.TPopKontrTyp, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit, tblTeilPopFeldkontrolle.TPopKontrAnz3 AS TPopKontrAnz, tblTeilPopFeldkontrolle.TPopKontrJahr, tblAdresse.AdrName AS TPopKontrBearb
FROM (DomainTPopKontrZaehleinheit INNER JOIN ((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON DomainTPopKontrZaehleinheit.ZaehleinheitCode = tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId
WHERE (((tblTeilPopFeldkontrolle.TPopKontrTyp) Is Not Null) AND ((DomainTPopKontrZaehleinheit.ZaehleinheitTxt) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrAnz3) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrJahr) Is Not Null)) AND (((tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Ziel" And (tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Zwischenziel"));

CREATE VIEW vAuswKontrAnzAnz AS
SELECT vAuswKontrAnzAnz1.ApArtId, vAuswKontrAnzAnz1.Name, vAuswKontrAnzAnz1.PopId, vAuswKontrAnzAnz1.PopNr, vAuswKontrAnzAnz1.PopName, vAuswKontrAnzAnz1.TPopId, vAuswKontrAnzAnz1.TPopNr, vAuswKontrAnzAnz1.TPopGemeinde, vAuswKontrAnzAnz1.TPopFlurname, vAuswKontrAnzAnz1.TPopKontrId, vAuswKontrAnzAnz1.TPopKontrTyp, vAuswKontrAnzAnz1.TPopKontrZaehleinheit, vAuswKontrAnzAnz1.TPopKontrAnz, vAuswKontrAnzAnz1.TPopKontrJahr, vAuswKontrAnzAnz1.TPopKontrBearb
FROM vAuswKontrAnzAnz1
union all SELECT vAuswKontrAnzAnz2.ApArtId, vAuswKontrAnzAnz2.Name, vAuswKontrAnzAnz2.PopId, vAuswKontrAnzAnz2.PopNr, vAuswKontrAnzAnz2.PopName, vAuswKontrAnzAnz2.TPopId, vAuswKontrAnzAnz2.TPopNr, vAuswKontrAnzAnz2.TPopGemeinde, vAuswKontrAnzAnz2.TPopFlurname, vAuswKontrAnzAnz2.TPopKontrId, vAuswKontrAnzAnz2.TPopKontrTyp, vAuswKontrAnzAnz2.TPopKontrZaehleinheit, vAuswKontrAnzAnz2.TPopKontrAnz, vAuswKontrAnzAnz2.TPopKontrJahr, vAuswKontrAnzAnz2.TPopKontrBearb
FROM vAuswKontrAnzAnz2
union all SELECT vAuswKontrAnzAnz3.ApArtId, vAuswKontrAnzAnz3.Name, vAuswKontrAnzAnz3.PopId, vAuswKontrAnzAnz3.PopNr, vAuswKontrAnzAnz3.PopName, vAuswKontrAnzAnz3.TPopId, vAuswKontrAnzAnz3.TPopNr, vAuswKontrAnzAnz3.TPopGemeinde, vAuswKontrAnzAnz3.TPopFlurname, vAuswKontrAnzAnz3.TPopKontrId, vAuswKontrAnzAnz3.TPopKontrTyp, vAuswKontrAnzAnz3.TPopKontrZaehleinheit, vAuswKontrAnzAnz3.TPopKontrAnz, vAuswKontrAnzAnz3.TPopKontrJahr, vAuswKontrAnzAnz3.TPopKontrBearb
FROM vAuswKontrAnzAnz3
order by Name, PopNr, TPopNr, TPopKontrJahr DESC;

CREATE VIEW vAuswKontrAnzAnzAlleKontrollen AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, vAuswKontrAnzAnz.TPopKontrId, vAuswKontrAnzAnz.TPopKontrTyp, vAuswKontrAnzAnz.TPopKontrZaehleinheit, vAuswKontrAnzAnz.TPopKontrAnz, vAuswKontrAnzAnz.TPopKontrJahr, vAuswKontrAnzAnz.TPopKontrBearb
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN (vAuswKontrAnzAnz RIGHT JOIN tblTeilpopulation ON vAuswKontrAnzAnz.TPopId = tblTeilpopulation.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, vAuswKontrAnzAnz.TPopKontrJahr DESC;

CREATE VIEW vAuswLetzteAnz AS 
SELECT ArtenDb_tblFloraSisf.Name, tblAktionsplan.ApStatus, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS Zaehleinheit, Sum(vAuswLetzteAnzAnz.Anzahl) AS Anzahl
FROM (ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR=tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN ((DomainTPopKontrZaehleinheit INNER JOIN vAuswLetzteAnzAnz ON DomainTPopKontrZaehleinheit.ZaehleinheitCode=vAuswLetzteAnzAnz.Zaehleinheit) INNER JOIN tblTeilPopFeldkontrolle ON (vAuswLetzteAnzAnz.TPopKontrId=tblTeilPopFeldkontrolle.TPopKontrId) AND (vAuswLetzteAnzAnz.TPopKontrTyp=tblTeilPopFeldkontrolle.TPopKontrTyp) AND (vAuswLetzteAnzAnz.TPopKontrjahr=tblTeilPopFeldkontrolle.TPopKontrJahr)) ON tblTeilpopulation.TPopId=tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId=tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId=tblPopulation.ApArtId
GROUP BY ArtenDb_tblFloraSisf.Name, tblAktionsplan.ApStatus, DomainTPopKontrZaehleinheit.ZaehleinheitTxt;

CREATE VIEW vAuswLetzteAnzProPop AS 
SELECT ArtenDb_tblFloraSisf.Name, tblAktionsplan.ApStatus, tblPopulation.PopNr, tblPopulation.PopName, vAuswLetzteAnzAnz.Zaehleinheit AS Zaehleinheit, Sum(vAuswLetzteAnzAnz.Anzahl) AS Anzahl
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN (tblTeilpopulation INNER JOIN (vAuswLetzteAnzAnz INNER JOIN tblTeilPopFeldkontrolle ON vAuswLetzteAnzAnz.TPopKontrId = tblTeilPopFeldkontrolle.TPopKontrId) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
GROUP BY ArtenDb_tblFloraSisf.Name, tblAktionsplan.ApStatus, tblPopulation.PopNr, tblPopulation.PopName, vAuswLetzteAnzAnz.Zaehleinheit;

CREATE VIEW vAuswLetzteAnzProTPop AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblAktionsplan.ApStatus, tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopHerkunft, tblTeilpopulation.TPopBekanntSeit, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, vAuswLetzteAnzAnz.TPopKontrId, vAuswLetzteAnzAnz.Zaehleinheit, vAuswLetzteAnzAnz.Anzahl, vAuswLetzteAnzAnz.TPopKontrjahr
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN (tblTeilpopulation INNER JOIN (vAuswLetzteAnzAnz INNER JOIN tblTeilPopFeldkontrolle ON vAuswLetzteAnzAnz.TPopKontrId = tblTeilPopFeldkontrolle.TPopKontrId) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

CREATE VIEW vBerKontrGleicheOrte AS 
SELECT tblAktionsplan.ApArtId, tblAktionsplan.ApStatus, tblAktionsplan.ApJahr, tblAktionsplan.ApUmsetzung, tblPopulation.PopNr, tblPopulation.PopName, tblPopulation.PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopBekanntSeit, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrDatum, DomainTPopFeldkontrTyp.DomainTxt AS TPopKontrTyp, tblAdresse.AdrName AS TPopKontrBearb, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit1, tblTeilPopFeldkontrolle.TPopKontrMethode1, tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS TPopKontrZaehleinheit2, tblTeilPopFeldkontrolle.TPopKontrMethode2, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS TPopKontrZaehleinheit3, tblTeilPopFeldkontrolle.TPopKontrMethode3, tblTeilPopFeldkontrolle.TPopKontrAnz3, tblTeilPopFeldkontrolle.TPopKontrUeberleb, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, DomainTPopEntwicklung.EntwicklungTxt AS TPopKontrEntwicklung, tblTeilPopFeldkontrolle.TPopKontrUrsach, tblTeilPopFeldkontrolle.TPopKontrUrteil, tblTeilPopFeldkontrolle.TPopKontrAendUms, tblTeilPopFeldkontrolle.TPopKontrAendKontr, tblTeilpopulation.TPopAuswahl
FROM (tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN (tblTeilpopulation INNER JOIN ((((((tblTeilPopFeldkontrolle LEFT JOIN DomainTPopFeldkontrTyp ON tblTeilPopFeldkontrolle.TPopKontrTyp = DomainTPopFeldkontrTyp.DomainTxt) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopEntwicklung ON tblTeilPopFeldkontrolle.TPopKontrEntwicklung = DomainTPopEntwicklung.EntwicklungCode) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopAuswahl)=true));

CREATE VIEW vBerKontrNachId AS 
SELECT tblAktionsplan.ApArtId, tblAktionsplan.ApStatus, tblAktionsplan.ApJahr, tblAktionsplan.ApUmsetzung, tblPopulation.PopNr, tblPopulation.PopName, tblPopulation.PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopBekanntSeit, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrDatum, DomainTPopFeldkontrTyp.DomainTxt AS TPopKontrTyp, tblAdresse.AdrName AS TPopKontrBearb, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit1, tblTeilPopFeldkontrolle.TPopKontrMethode1, tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS TPopKontrZaehleinheit2, tblTeilPopFeldkontrolle.TPopKontrMethode2, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS TPopKontrZaehleinheit3, tblTeilPopFeldkontrolle.TPopKontrMethode3, tblTeilPopFeldkontrolle.TPopKontrAnz3, tblTeilPopFeldkontrolle.TPopKontrUeberleb, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, DomainTPopEntwicklung.EntwicklungTxt AS TPopKontrEntwicklung, tblTeilPopFeldkontrolle.TPopKontrUrsach, tblTeilPopFeldkontrolle.TPopKontrUrteil, tblTeilPopFeldkontrolle.TPopKontrAendUms, tblTeilPopFeldkontrolle.TPopKontrAendKontr
FROM (tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN ((tblTeilpopulation INNER JOIN tblTeiPopFuerAuswahl ON tblTeilpopulation.TPopId = tblTeiPopFuerAuswahl.TPopId) LEFT JOIN ((((((tblTeilPopFeldkontrolle LEFT JOIN DomainTPopFeldkontrTyp ON tblTeilPopFeldkontrolle.TPopKontrTyp = DomainTPopFeldkontrTyp.DomainTxt) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopEntwicklung ON tblTeilPopFeldkontrolle.TPopKontrEntwicklung = DomainTPopEntwicklung.EntwicklungCode) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId;

CREATE VIEW vBerTPopGleicheOrte AS 
SELECT tblAktionsplan.ApArtId, tblAktionsplan.ApStatus, tblAktionsplan.ApJahr, tblAktionsplan.ApUmsetzung, tblPopulation.PopNr, tblPopulation.PopName, tblPopulation.PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopBekanntSeit, tblTeilpopulation.TPopAuswahl
FROM (tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopAuswahl)=true));

CREATE VIEW vBerTPopNachId AS 
SELECT tblAktionsplan.ApArtId, tblAktionsplan.ApStatus, tblAktionsplan.ApJahr, tblAktionsplan.ApUmsetzung, tblPopulation.PopNr, tblPopulation.PopName, tblPopulation.PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopBekanntSeit
FROM (tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN (tblTeilpopulation INNER JOIN tblTeiPopFuerAuswahl ON tblTeilpopulation.TPopId = tblTeiPopFuerAuswahl.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId;

CREATE VIEW vErsteMassnahmeProArt AS 
SELECT tblAktionsplan.ApArtId, Min(tblTeilPopMassnahme.TPopMassnJahr) AS MinvonTPopMassnJahr
FROM ((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId
GROUP BY tblAktionsplan.ApArtId;

CREATE VIEW vMassn AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblPopulation.PopGuid AS "Pop Guid", tblPopulation.PopNr AS "Pop Nr", tblPopulation.PopName AS "Pop Name", DomainPopHerkunft.HerkunftTxt AS "Pop Status", tblPopulation.PopBekanntSeit AS "Pop bekannt seit", tblPopulation.PopXKoord AS "Pop X-Koordinaten", tblPopulation.PopYKoord AS "Pop Y-Koordinaten", tblTeilpopulation.TPopGuid AS "TPop Guid", tblTeilpopulation.TPopNr AS "TPop Nr", tblTeilpopulation.TPopGemeinde AS "TPop Gemeinde", tblTeilpopulation.TPopFlurname AS "TPop Flurname", DomainPopHerkunft_1.HerkunftTxt AS "TPop Status", tblTeilpopulation.TPopHerkunftUnklar AS "TPop Status unklar", tblTeilpopulation.TPopHerkunftUnklarBegruendung AS "TPop Begründung für unklaren Status", tblTeilpopulation.TPopXKoord AS "TPop X-Koordinaten", tblTeilpopulation.TPopYKoord AS "TPop Y-Koordinaten", tblTeilpopulation.TPopRadius AS "TPop Radius (m)", tblTeilpopulation.TPopHoehe AS "TPop Höhe", tblTeilpopulation.TPopExposition AS "TPop Exposition", tblTeilpopulation.TPopKlima AS "TPop Klima", tblTeilpopulation.TPopNeigung AS "TPop Hangneigung", tblTeilpopulation.TPopBeschr AS "TPop Beschreibung", tblTeilpopulation.TPopKatNr AS "TPop Kataster-Nr", tblAdresse.AdrName AS "TPop Verantwortlich", tblTeilpopulation.TPopApBerichtRelevant AS "TPop für AP-Bericht relevant", tblTeilpopulation.TPopBekanntSeit AS "TPop bekannt seit", tblTeilpopulation.TPopEigen AS "TPop EigentümerIn", tblTeilpopulation.TPopKontakt AS "TPop Kontakt vor Ort", tblTeilpopulation.TPopNutzungszone AS "TPop Nutzungszone", tblTeilpopulation.TPopBewirtschafterIn AS "TPop BewirtschafterIn", tblTeilpopulation.TPopBewirtschaftung AS "TPop Bewirtschaftung", tblTeilpopulation.TPopPop AS "TPop Lage repräsentiert Population", tblTeilPopMassnahme.TPopMassnGuid AS "Massn Guid", tblTeilPopMassnahme.TPopMassnJahr AS "Massn Jahr", tblTeilPopMassnahme.TPopMassnDatum AS "Massn Datum", DomainTPopMassnTyp.MassnTypTxt AS "Massn Typ", tblTeilPopMassnahme.TPopMassnTxt AS "Massn Massnahme", tblAdresse.AdrName AS "Massn BearbeiterIn", tblTeilPopMassnahme.TPopMassnBemTxt AS "Massn Bemerkungen", tblTeilPopMassnahme.TPopMassnPlan AS "Massn Plan vorhanden", tblTeilPopMassnahme.TPopMassnPlanBez AS "Massn Plan Bezeichnung", tblTeilPopMassnahme.TPopMassnFlaeche AS "Massn Fläche m2", tblTeilPopMassnahme.TPopMassnAnsiedForm AS "Massn Form der Ansiedlung", tblTeilPopMassnahme.TPopMassnAnsiedPflanzanordnung AS "Massn Pflanzanordnung",tblTeilPopMassnahme.TPopMassnMarkierung AS "Massn Markierung",  tblTeilPopMassnahme.TPopMassnAnsiedAnzTriebe AS "Massn Anz Triebe", tblTeilPopMassnahme.TPopMassnAnsiedAnzPfl AS "Massn Pflanzen", tblTeilPopMassnahme.TPopMassnAnzPflanzstellen AS "Massn Anz Pflanzstellen", tblTeilPopMassnahme.TPopMassnAnsiedWirtspfl AS "Massn Wirtspflanze", tblTeilPopMassnahme.TPopMassnAnsiedHerkunftPop AS "Massn Herkunftspopulation", tblTeilPopMassnahme.TPopMassnAnsiedDatSamm AS "Massn Sammeldatum", tblTeilPopMassnahme.MutWann AS "Massn MutWann", tblTeilPopMassnahme.MutWer AS "Massn MutWer"
FROM ((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN (tblTeilPopMassnahme LEFT JOIN DomainTPopMassnTyp ON tblTeilPopMassnahme.TPopMassnTyp = DomainTPopMassnTyp.MassnTypCode) ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId) LEFT JOIN tblAdresse ON tblTeilPopMassnahme.TPopMassnBearb = tblAdresse.AdrId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopMassnahme.TPopMassnJahr, tblTeilPopMassnahme.TPopMassnDatum, DomainTPopMassnTyp.MassnTypTxt;

CREATE VIEW vTPopAnzMassn AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblPopulation.PopGuid AS "Pop Guid", tblPopulation.PopNr AS "Pop Nr", tblPopulation.PopName AS "Pop Name", DomainPopHerkunft.HerkunftTxt AS "Pop Status", tblPopulation.PopBekanntSeit AS "Pop bekannt seit", tblPopulation.PopXKoord AS "Pop X-Koordinaten", tblPopulation.PopYKoord AS "Pop Y-Koordinaten", tblTeilpopulation.TPopGuid AS "TPop Guid", tblTeilpopulation.TPopNr AS "TPop Nr", tblTeilpopulation.TPopGemeinde AS "TPop Gemeinde", tblTeilpopulation.TPopFlurname AS "TPop Flurname", DomainPopHerkunft_1.HerkunftTxt AS "TPop Status", tblTeilpopulation.TPopHerkunftUnklar AS "TPop Status unklar", tblTeilpopulation.TPopHerkunftUnklarBegruendung AS "TPop Begründung für unklaren Status", tblTeilpopulation.TPopXKoord AS "TPop X-Koordinaten", tblTeilpopulation.TPopYKoord AS "TPop Y-Koordinaten", tblTeilpopulation.TPopRadius AS "TPop Radius (m)", tblTeilpopulation.TPopHoehe AS "TPop Höhe", tblTeilpopulation.TPopExposition AS "TPop Exposition", tblTeilpopulation.TPopKlima AS "TPop Klima", tblTeilpopulation.TPopNeigung AS "TPop Hangneigung", tblTeilpopulation.TPopBeschr AS "TPop Beschreibung", tblTeilpopulation.TPopKatNr AS "TPop Kataster-Nr", tblTeilpopulation.TPopApBerichtRelevant AS "TPop für AP-Bericht relevant", tblTeilpopulation.TPopBekanntSeit AS "TPop bekannt seit", tblTeilpopulation.TPopEigen AS "TPop EigentümerIn", tblTeilpopulation.TPopKontakt AS "TPop Kontakt vor Ort", tblTeilpopulation.TPopNutzungszone AS "TPop Nutzungszone", tblTeilpopulation.TPopBewirtschafterIn AS "TPop BewirtschafterIn", tblTeilpopulation.TPopBewirtschaftung AS "TPop Bewirtschaftung", tblTeilpopulation.TPopPop AS "TPop Lage repräsentiert Population", Count(tblTeilPopMassnahme.TPopMassnId) AS "Anzahl Massnahmen"
FROM (((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) LEFT JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId
GROUP BY ArtenDb_tblFloraSisf.NR, ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt, tblAktionsplan.ApJahr, DomainApUmsetzung.DomainTxt, tblPopulation.PopGuid, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt, tblPopulation.PopBekanntSeit, tblPopulation.PopXKoord, tblPopulation.PopYKoord, tblTeilpopulation.TPopGuid, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, DomainPopHerkunft_1.HerkunftTxt, tblTeilpopulation.TPopHerkunftUnklar, tblTeilpopulation.TPopHerkunftUnklarBegruendung, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopRadius, tblTeilpopulation.TPopHoehe, tblTeilpopulation.TPopExposition, tblTeilpopulation.TPopKlima, tblTeilpopulation.TPopNeigung, tblTeilpopulation.TPopBeschr, tblTeilpopulation.TPopKatNr, tblTeilpopulation.TPopApBerichtRelevant, tblTeilpopulation.TPopBekanntSeit, tblTeilpopulation.TPopEigen, tblTeilpopulation.TPopKontakt, tblTeilpopulation.TPopNutzungszone, tblTeilpopulation.TPopBewirtschafterIn, tblTeilpopulation.TPopBewirtschaftung, tblTeilpopulation.TPopPop
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

CREATE VIEW vTPopAnzKontr AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblPopulation.PopGuid AS "Pop Guid", tblPopulation.PopNr AS "Pop Nr", tblPopulation.PopName AS "Pop Name", DomainPopHerkunft.HerkunftTxt AS "Pop Status", tblPopulation.PopBekanntSeit AS "Pop bekannt seit", tblPopulation.PopXKoord AS "Pop X-Koordinaten", tblPopulation.PopYKoord AS "Pop Y-Koordinaten", tblTeilpopulation.TPopGuid AS "TPop Guid", tblTeilpopulation.TPopNr AS "TPop Nr", tblTeilpopulation.TPopGemeinde AS "TPop Gemeinde", tblTeilpopulation.TPopFlurname AS "TPop Flurname", DomainPopHerkunft_1.HerkunftTxt AS "TPop Status", tblTeilpopulation.TPopHerkunftUnklar AS "TPop Status unklar", tblTeilpopulation.TPopHerkunftUnklarBegruendung AS "TPop Begründung für unklaren Status", tblTeilpopulation.TPopXKoord AS "TPop X-Koordinaten", tblTeilpopulation.TPopYKoord AS "TPop Y-Koordinaten", tblTeilpopulation.TPopRadius AS "TPop Radius (m)", tblTeilpopulation.TPopHoehe AS "TPop Höhe", tblTeilpopulation.TPopExposition AS "TPop Exposition", tblTeilpopulation.TPopKlima AS "TPop Klima", tblTeilpopulation.TPopNeigung AS "TPop Hangneigung", tblTeilpopulation.TPopBeschr AS "TPop Beschreibung", tblTeilpopulation.TPopKatNr AS "TPop Kataster-Nr", tblTeilpopulation.TPopApBerichtRelevant AS "TPop für AP-Bericht relevant", tblTeilpopulation.TPopBekanntSeit AS "TPop bekannt seit", tblTeilpopulation.TPopEigen AS "TPop EigentümerIn", tblTeilpopulation.TPopKontakt AS "TPop Kontakt vor Ort", tblTeilpopulation.TPopNutzungszone AS "TPop Nutzungszone", tblTeilpopulation.TPopBewirtschafterIn AS "TPop BewirtschafterIn", tblTeilpopulation.TPopBewirtschaftung AS "TPop Bewirtschaftung", tblTeilpopulation.TPopPop AS "TPop Lage repräsentiert Population", Count(tblTeilPopFeldkontrolle.TPopKontrId) AS "Anzahl Kontrollen"
FROM ((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId) LEFT JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId
GROUP BY ArtenDb_tblFloraSisf.NR, ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt, tblAktionsplan.ApJahr, DomainApUmsetzung.DomainTxt, tblPopulation.PopGuid, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt, tblPopulation.PopBekanntSeit, tblPopulation.PopXKoord, tblPopulation.PopYKoord, tblTeilpopulation.TPopGuid, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, DomainPopHerkunft_1.HerkunftTxt, tblTeilpopulation.TPopHerkunftUnklar, tblTeilpopulation.TPopHerkunftUnklarBegruendung, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopRadius, tblTeilpopulation.TPopHoehe, tblTeilpopulation.TPopExposition, tblTeilpopulation.TPopKlima, tblTeilpopulation.TPopNeigung, tblTeilpopulation.TPopBeschr, tblTeilpopulation.TPopKatNr, tblTeilpopulation.TPopApBerichtRelevant, tblTeilpopulation.TPopBekanntSeit, tblTeilpopulation.TPopEigen, tblTeilpopulation.TPopKontakt, tblTeilpopulation.TPopNutzungszone, tblTeilpopulation.TPopBewirtschafterIn, tblTeilpopulation.TPopBewirtschaftung, tblTeilpopulation.TPopPop
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

CREATE VIEW vPopAnzMassn AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblPopulation.PopGuid AS "Pop Guid", tblPopulation.PopNr AS "Pop Nr", tblPopulation.PopName AS "Pop Name", DomainPopHerkunft.HerkunftTxt AS "Pop Status", tblPopulation.PopBekanntSeit AS "Pop bekannt seit", tblPopulation.PopXKoord AS "Pop X-Koordinaten", tblPopulation.PopYKoord AS "Pop Y-Koordinaten", Count(tblTeilPopMassnahme.TPopMassnId) AS "Anzahl Massnahmen"
FROM ((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN ((tblPopulation LEFT JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) LEFT JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId
GROUP BY ArtenDb_tblFloraSisf.NR, ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt, tblAktionsplan.ApJahr, DomainApUmsetzung.DomainTxt, tblPopulation.PopGuid, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt, tblPopulation.PopBekanntSeit, tblPopulation.PopXKoord, tblPopulation.PopYKoord
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr;

CREATE VIEW vPopAnzKontr AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblPopulation.PopGuid AS "Pop Guid", tblPopulation.PopNr AS "Pop Nr", tblPopulation.PopName AS "Pop Name", DomainPopHerkunft.HerkunftTxt AS "Pop Status", tblPopulation.PopBekanntSeit AS "Pop bekannt seit", tblPopulation.PopXKoord AS "Pop X-Koordinaten", tblPopulation.PopYKoord AS "Pop Y-Koordinaten", Count(tblTeilPopFeldkontrolle.TPopKontrId) AS "Anzahl Kontrollen"
FROM ((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN ((tblPopulation LEFT JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) LEFT JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId
GROUP BY ArtenDb_tblFloraSisf.NR, ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt, tblAktionsplan.ApJahr, DomainApUmsetzung.DomainTxt, tblPopulation.PopGuid, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt, tblPopulation.PopBekanntSeit, tblPopulation.PopXKoord, tblPopulation.PopYKoord
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr;

CREATE VIEW vApAnzMassn AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", Count(tblTeilPopMassnahme.TPopMassnId) AS "Anzahl Massnahmen"
FROM (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN ((tblPopulation LEFT JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) LEFT JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode
GROUP BY ArtenDb_tblFloraSisf.NR, ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt, tblAktionsplan.ApJahr, DomainApUmsetzung.DomainTxt
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vPop AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblPopulation.PopGuid AS "Pop Guid", tblPopulation.PopNr AS "Pop Nr", tblPopulation.PopName AS "Pop Name", DomainPopHerkunft.HerkunftTxt AS "Pop Status", tblPopulation.PopBekanntSeit AS "Pop bekannt seit", tblPopulation.PopXKoord AS "Pop X-Koordinaten", tblPopulation.PopYKoord AS "Pop Y-Koordinaten", tblPopulation.MutWann AS "Pop MutWann", tblPopulation.MutWer AS "Pop MutWer"
FROM ((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr;

CREATE VIEW vPopFuerGis AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblPopulation.PopGuid AS "Pop Guid", tblPopulation.PopNr AS "Pop Nr", tblPopulation.PopName AS "Pop Name", DomainPopHerkunft.HerkunftTxt AS "Pop Status", tblPopulation.PopBekanntSeit AS "Pop bekannt seit", tblPopulation.PopXKoord AS "XKoordinaten", tblPopulation.PopYKoord AS "YKoordinaten", tblPopulation.MutWann AS "Pop MutWann", tblPopulation.MutWer AS "Pop MutWer"
FROM ((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId
WHERE tblPopulation.PopXKoord > 0 AND tblPopulation.PopYKoord > 0
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr;

CREATE VIEW vPopOhneAp AS
SELECT tblPopulation.PopGuid AS "Pop Guid", tblPopulation.PopNr AS "Pop Nr", tblPopulation.PopName AS "Pop Name", DomainPopHerkunft.HerkunftTxt AS "Pop Status", tblPopulation.PopBekanntSeit AS "Pop bekannt seit", tblPopulation.PopXKoord AS "Pop X-Koordinaten", tblPopulation.PopYKoord AS "Pop Y-Koordinaten", tblPopulation.MutWann AS "Pop MutWann", tblPopulation.MutWer AS "Pop MutWer", tblAktionsplan.ApArtId
FROM (tblAktionsplan RIGHT JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId
WHERE tblAktionsplan.ApArtId Is Null
ORDER BY tblPopulation.PopName, tblPopulation.PopNr;

CREATE VIEW vPopOhneTPop AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblPopulation.PopGuid AS "Pop Guid", tblPopulation.PopNr AS "Pop Nr", tblPopulation.PopName AS "Pop Name", DomainPopHerkunft.HerkunftTxt AS "Pop Status", tblPopulation.PopBekanntSeit AS "Pop bekannt seit", tblPopulation.PopXKoord AS "Pop X-Koordinaten", tblPopulation.PopYKoord AS "Pop Y-Koordinaten", tblPopulation.MutWann AS "Pop MutWann", tblPopulation.MutWer AS "Pop MutWer"
FROM (((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE tblTeilpopulation.TPopId Is Null
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr;

CREATE VIEW vPopBer AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblPopulation.PopGuid AS "Pop Guid", tblPopulation.PopNr AS "Pop Nr", tblPopulation.PopName AS "Pop Name", DomainPopHerkunft.HerkunftTxt AS "Pop Status", tblPopulation.PopBekanntSeit AS "Pop bekannt seit", tblPopulation.PopXKoord AS "Pop X-Koordinaten", tblPopulation.PopYKoord AS "Pop Y-Koordinaten", tblPopBericht.PopBerId AS "PopBer Id", tblPopBericht.PopBerJahr AS "PopBer Jahr", DomainPopEntwicklung.EntwicklungTxt AS "PopBer Entwicklung", tblPopBericht.PopBerTxt AS "PopBer Bemerkungen", tblPopBericht.MutWann AS "PopBer MutWann", tblPopBericht.MutWer AS "PopBer MutWer"
FROM ((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) INNER JOIN tblPopBericht ON tblPopulation.PopId = tblPopBericht.PopId) LEFT JOIN DomainPopEntwicklung ON tblPopBericht.PopBerEntwicklung = DomainPopEntwicklung.EntwicklungId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopBericht.PopBerJahr, DomainPopEntwicklung.EntwicklungTxt;

CREATE VIEW vPopBerOhnePop AS
SELECT tblPopBericht.PopBerId AS "PopBer Id", tblPopBericht.PopId AS "PopBer PopId", tblPopBericht.PopBerJahr AS "PopBer Jahr", DomainPopEntwicklung.EntwicklungTxt AS "PopBer Entwicklung", tblPopBericht.PopBerTxt AS "PopBer Bemerkungen", tblPopBericht.MutWann AS "PopBer MutWann", tblPopBericht.MutWer AS "PopBer MutWer"
FROM (tblPopulation RIGHT JOIN tblPopBericht ON tblPopulation.PopId = tblPopBericht.PopId) LEFT JOIN DomainPopEntwicklung ON tblPopBericht.PopBerEntwicklung = DomainPopEntwicklung.EntwicklungId
WHERE tblPopulation.PopId Is Null
ORDER BY tblPopBericht.PopBerJahr, DomainPopEntwicklung.EntwicklungTxt;

CREATE VIEW vPopMassnBer AS
SELECT ArtenDb_tblFloraSisf.NR AS "AP ApArtId", ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblPopulation.PopGuid AS "Pop Guid", tblPopulation.PopNr AS "Pop Nr", tblPopulation.PopName AS "Pop Name", DomainPopHerkunft.HerkunftTxt AS "Pop Status", tblPopulation.PopBekanntSeit AS "Pop bekannt seit", tblPopulation.PopXKoord AS "Pop X-Koordinaten", tblPopulation.PopYKoord AS "Pop Y-Koordinaten", tblPopulation.MutWann AS "Pop MutWann", tblPopulation.MutWer AS "Pop MutWer", tblPopMassnBericht.PopMassnBerId AS "PopMassnBer Id", tblPopMassnBericht.PopMassnBerJahr AS "PopMassnBer Jahr", DomainTPopMassnErfolgsbeurteilung.BeurteilTxt AS "PopMassnBer Entwicklung", tblPopMassnBericht.PopMassnBerTxt AS "PopMassnBer Interpretation", tblPopMassnBericht.MutWann AS "PopMassnBer MutWann", tblPopMassnBericht.MutWer AS "PopMassnBer MutWer"
FROM ((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) INNER JOIN tblPopMassnBericht ON tblPopulation.PopId = tblPopMassnBericht.PopId) LEFT JOIN DomainTPopMassnErfolgsbeurteilung ON tblPopMassnBericht.PopMassnBerErfolgsbeurteilung = DomainTPopMassnErfolgsbeurteilung.BeurteilId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr;

CREATE VIEW vPopMassnBerOhnePop AS
SELECT tblPopMassnBericht.PopMassnBerId AS "PopMassnBer Id", tblPopMassnBericht.PopId AS "PopMassnBer PopId", tblPopMassnBericht.PopMassnBerJahr AS "PopMassnBer Jahr", DomainTPopMassnErfolgsbeurteilung.BeurteilTxt AS "PopMassnBer Entwicklung", tblPopMassnBericht.PopMassnBerTxt AS "PopMassnBer Interpretation", tblPopMassnBericht.MutWann AS "PopMassnBer MutWann", tblPopMassnBericht.MutWer AS "PopMassnBer MutWer"
FROM (tblPopulation RIGHT JOIN tblPopMassnBericht ON tblPopulation.PopId = tblPopMassnBericht.PopId) LEFT JOIN DomainTPopMassnErfolgsbeurteilung ON tblPopMassnBericht.PopMassnBerErfolgsbeurteilung = DomainTPopMassnErfolgsbeurteilung.BeurteilId
WHERE tblPopulation.PopId Is Null
ORDER BY tblPopMassnBericht.PopMassnBerJahr, DomainTPopMassnErfolgsbeurteilung.BeurteilTxt;

CREATE VIEW vTPop AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblPopulation.PopGuid AS "Pop Guid", tblPopulation.PopNr AS "Pop Nr", tblPopulation.PopName AS "Pop Name", DomainPopHerkunft.HerkunftTxt AS "Pop Status", tblPopulation.PopBekanntSeit AS "Pop bekannt seit", tblPopulation.PopXKoord AS "Pop X-Koordinaten", tblPopulation.PopYKoord AS "Pop Y-Koordinaten", tblTeilpopulation.TPopGuid AS "TPop Guid", tblTeilpopulation.TPopNr AS "TPop Nr", tblTeilpopulation.TPopGemeinde AS "TPop Gemeinde", tblTeilpopulation.TPopFlurname AS "TPop Flurname", DomainPopHerkunft_1.HerkunftTxt AS "TPop Status", tblTeilpopulation.TPopHerkunftUnklar AS "TPop Status unklar", tblTeilpopulation.TPopHerkunftUnklarBegruendung AS "TPop Begründung für unklaren Status", tblTeilpopulation.TPopXKoord AS "TPop X-Koordinaten", tblTeilpopulation.TPopYKoord AS "TPop Y-Koordinaten", tblTeilpopulation.TPopRadius AS "TPop Radius (m)", tblTeilpopulation.TPopHoehe AS "TPop Höhe", tblTeilpopulation.TPopExposition AS "TPop Exposition", tblTeilpopulation.TPopKlima AS "TPop Klima", tblTeilpopulation.TPopNeigung AS "TPop Hangneigung", tblTeilpopulation.TPopBeschr AS "TPop Beschreibung", tblTeilpopulation.TPopKatNr AS "TPop Kataster-Nr", tblAdresse.AdrName AS "TPop Verantwortlich", tblTeilpopulation.TPopApBerichtRelevant AS "TPop für AP-Bericht relevant", tblTeilpopulation.TPopBekanntSeit AS "TPop bekannt seit", tblTeilpopulation.TPopEigen AS "TPop EigentümerIn", tblTeilpopulation.TPopKontakt AS "TPop Kontakt vor Ort", tblTeilpopulation.TPopNutzungszone AS "TPop Nutzungszone", tblTeilpopulation.TPopBewirtschafterIn AS "TPop BewirtschafterIn", tblTeilpopulation.TPopBewirtschaftung AS "TPop Bewirtschaftung", tblTeilpopulation.TPopPop AS "TPop Lage repräsentiert Population", tblTeilpopulation.MutWann, tblTeilpopulation.MutWer
FROM ((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId) LEFT JOIN tblAdresse ON tblTeilpopulation.TPopVerantw = tblAdresse.AdrId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

CREATE VIEW vTPopFuerGis AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblPopulation.PopGuid AS "Pop Guid", tblPopulation.PopNr AS "Pop Nr", tblPopulation.PopName AS "Pop Name", DomainPopHerkunft.HerkunftTxt AS "Pop Herkunft", tblPopulation.PopBekanntSeit AS "Pop bekannt seit", tblTeilpopulation.TPopGuid AS "TPop Guid", tblTeilpopulation.TPopNr AS "TPop Nr", tblTeilpopulation.TPopGemeinde AS "TPop Gemeinde", tblTeilpopulation.TPopFlurname AS "TPop Flurname", DomainPopHerkunft_1.HerkunftTxt AS "TPop Status", tblTeilpopulation.TPopHerkunftUnklar AS "TPop Status unklar", tblTeilpopulation.TPopHerkunftUnklarBegruendung AS "TPop Begründung für unklaren Status", tblTeilpopulation.TPopXKoord AS "TPopXKoordinaten", tblTeilpopulation.TPopYKoord AS "TPopYKoordinaten", tblTeilpopulation.TPopRadius AS "TPop Radius (m)", tblTeilpopulation.TPopHoehe AS "TPop Höhe", tblTeilpopulation.TPopExposition AS "TPop Exposition", tblTeilpopulation.TPopKlima AS "TPop Klima", tblTeilpopulation.TPopNeigung AS "TPop Hangneigung", tblTeilpopulation.TPopBeschr AS "TPop Beschreibung", tblTeilpopulation.TPopKatNr AS "TPop Kataster-Nr", tblAdresse.AdrName AS "TPop Verantwortlich", tblTeilpopulation.TPopApBerichtRelevant AS "TPop für AP-Bericht relevant", tblTeilpopulation.TPopBekanntSeit AS "TPop bekannt seit", tblTeilpopulation.TPopEigen AS "TPop EigentümerIn", tblTeilpopulation.TPopKontakt AS "TPop Kontakt vor Ort", tblTeilpopulation.TPopNutzungszone AS "TPop Nutzungszone", tblTeilpopulation.TPopBewirtschafterIn AS "TPop BewirtschafterIn", tblTeilpopulation.TPopBewirtschaftung AS "TPop Bewirtschaftung", tblTeilpopulation.TPopPop AS "TPop Lage repräsentiert Population", tblTeilpopulation.MutWann, tblTeilpopulation.MutWer
FROM ((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId) INNER JOIN tblAdresse ON tblTeilpopulation.TPopVerantw = tblAdresse.AdrId
WHERE tblTeilpopulation.TPopYKoord > 0 AND tblTeilpopulation.TPopXKoord > 0
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

CREATE VIEW vTPopOhnePop AS
SELECT tblTeilpopulation.TPopGuid AS "TPop Guid", tblTeilpopulation.TPopNr AS "TPop Nr", tblTeilpopulation.TPopGemeinde AS "TPop Gemeinde", tblTeilpopulation.TPopFlurname AS "TPop Flurname", DomainPopHerkunft_1.HerkunftTxt AS "TPop Status", tblTeilpopulation.TPopHerkunftUnklar AS "TPop Status unklar", tblTeilpopulation.TPopHerkunftUnklarBegruendung AS "TPop Begründung für unklaren Status", tblTeilpopulation.TPopXKoord AS "TPop X-Koordinaten", tblTeilpopulation.TPopYKoord AS "TPop Y-Koordinaten", tblTeilpopulation.TPopRadius AS "TPop Radius (m)", tblTeilpopulation.TPopHoehe AS "TPop Höhe üM", tblTeilpopulation.TPopExposition AS "TPop Exposition", tblTeilpopulation.TPopKlima AS "TPop Klima", tblTeilpopulation.TPopNeigung AS "TPop Hangneigung", tblTeilpopulation.TPopBeschr AS "TPop Beschreibung", tblTeilpopulation.TPopKatNr AS "TPop Kataster-Nr", tblAdresse.AdrName AS "TPop Verantwortlich", tblTeilpopulation.TPopApBerichtRelevant AS "TPop für AP-Bericht relevant", tblTeilpopulation.TPopBekanntSeit AS "TPop bekannt seit", tblTeilpopulation.TPopEigen AS "TPop EigentümerIn", tblTeilpopulation.TPopKontakt AS "TPop Kontakt vor Ort", tblTeilpopulation.TPopNutzungszone AS "TPop Nutzungszone", tblTeilpopulation.TPopBewirtschafterIn AS "TPop BewirtschafterIn", tblTeilpopulation.TPopBewirtschaftung AS "TPop Bewirtschaftung", tblTeilpopulation.TPopPop AS "TPop Lage repräsentiert Population", tblTeilpopulation.MutWann, tblTeilpopulation.MutWer
FROM ((tblPopulation RIGHT JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId) INNER JOIN tblAdresse ON tblTeilpopulation.TPopVerantw = tblAdresse.AdrId
WHERE tblPopulation.PopId Is Null
ORDER BY tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopNr;

CREATE VIEW vPopAnzTPopPop0 AS
SELECT tblPopulation.PopId, Sum(If(tblTeilpopulation.TPopPop Is Null,0,tblTeilpopulation.TPopPop)) AS "AnzTPopPop"
FROM tblTeilpopulation RIGHT JOIN tblPopulation ON tblTeilpopulation.PopId = tblPopulation.PopId
GROUP BY tblPopulation.PopId;

CREATE VIEW vPopAnzTPopPop AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblPopulation.PopGuid AS "Pop Guid", tblPopulation.PopNr AS "Pop Nr", tblPopulation.PopName AS "Pop Name", DomainPopHerkunft.HerkunftTxt AS "Pop Status", tblPopulation.PopBekanntSeit AS "Pop bekannt seit", vPopAnzTPopPop0.AnzTPopPop AS "Anz TPopPop"
FROM (((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) INNER JOIN vPopAnzTPopPop0 ON tblPopulation.PopId = vPopAnzTPopPop0.PopId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr;


CREATE VIEW vPopVonApOhneStatus AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, tblAktionsplan.ApStatus AS "Bearbeitungsstand AP", tblPopulation.PopNr, tblPopulation.PopName, tblPopulation.PopHerkunft AS Status
FROM ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId
WHERE (((tblAktionsplan.ApStatus)=3) AND ((tblPopulation.PopHerkunft) Is Null))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr;

CREATE VIEW vPopMassnberAnzMassn0 AS
SELECT tblPopMassnBericht.PopId, tblPopMassnBericht.PopMassnBerJahr, Count(tblTeilPopMassnahme.TPopMassnId) AS AnzahlvonTPopMassnId
FROM tblPopMassnBericht INNER JOIN (tblTeilpopulation LEFT JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblPopMassnBericht.PopId = tblTeilpopulation.PopId
WHERE tblTeilPopMassnahme.TPopMassnJahr=tblPopMassnBericht.PopMassnBerJahr Or tblTeilPopMassnahme.TPopMassnJahr Is Null
GROUP BY tblPopMassnBericht.PopId, tblPopMassnBericht.PopMassnBerJahr
ORDER BY tblPopMassnBericht.PopId, tblPopMassnBericht.PopMassnBerJahr;

CREATE VIEW vPopMassnberAnzMassn AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblPopulation.PopGuid AS "Pop Guid", tblPopulation.PopNr AS "Pop Nr", tblPopulation.PopName AS "Pop Name", DomainPopHerkunft.HerkunftTxt AS "Pop Status", tblPopulation.PopBekanntSeit AS "Pop bekannt seit", vPopMassnberAnzMassn0.PopMassnBerJahr AS "MassnBer Jahr", vPopMassnberAnzMassn0.AnzahlvonTPopMassnId AS "Anz Massnahmen in diesem Jahr"
FROM (((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) INNER JOIN vPopMassnberAnzMassn0 ON tblPopulation.PopId = vPopMassnberAnzMassn0.PopId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, vPopMassnberAnzMassn0.PopMassnBerJahr;

CREATE VIEW vKontrApArtPopulationOhneStatus AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblPopulation.PopNr, tblPopulation.PopName, tblPopulation.PopHerkunft AS Status
FROM (ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode
WHERE (((tblPopulation.PopHerkunft) Is Null) AND ((tblAktionsplan.ApStatus)=3))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr;

CREATE VIEW vKontrApOhnePop AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS ApStatus, tblPopulation.PopNr
FROM (ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan LEFT JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode
WHERE (((tblPopulation.PopNr) Is Null))
ORDER BY ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt;

CREATE VIEW vKontrBeobDistanzZurTPop AS
SELECT ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS ApStatus, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, alexande_beob.tblBeob.NO_NOTE AS IdZdsf, alexande_beob.tblBeob.IdEvab, alexande_beob.tblBeob.xGIS AS Beob_X, alexande_beob.tblBeob.yGIS AS Beob_Y, SQRT((alexande_beob.tblBeob.xGIS-tblTeilpopulation.TPopXKoord)*(alexande_beob.tblBeob.xGIS-tblTeilpopulation.TPopXKoord)+(alexande_beob.tblBeob.yGIS-tblTeilpopulation.TPopYKoord)*(alexande_beob.tblBeob.yGIS-tblTeilpopulation.TPopYKoord)) AS Beob_DistZurTPop, alexande_beob.tblBeob.PROJET AS Beob_Projekt, alexande_beob.tblBeob.NOM_COMMUNE AS Beob_RaumGde, alexande_beob.tblBeob.DESC_LOCALITE AS Beob_Ort, CAST(IF(alexande_beob.tblBeob.M_NOTE>0, IF(alexande_beob.tblBeob.M_NOTE>9, CONCAT(alexande_beob.tblBeob.J_NOTE, ".", alexande_beob.tblBeob.M_NOTE, ".", alexande_beob.tblBeob.A_NOTE), CONCAT(alexande_beob.tblBeob.J_NOTE, ".0", alexande_beob.tblBeob.M_NOTE, ".", alexande_beob.tblBeob.A_NOTE)), alexande_beob.tblBeob.A_NOTE) AS CHAR) AS Beob_Datum, alexande_beob.tblBeob.Autor AS Beob_Autor
FROM (ArtenDb_tblFloraSisf INNER JOIN (((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN alexande_beob.tblBeob ON tblTeilpopulation.TPopId = alexande_beob.tblBeob.TPopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname;

CREATE VIEW vBerJbZielBer AS 
SELECT tblZielBericht.*
FROM tblZielBericht INNER JOIN tblKonstanten ON tblZielBericht.ZielBerJahr = tblKonstanten.JBerJahr;

CREATE VIEW vBerJbZiel AS
SELECT tblZiel.*, DomainZielTyp.ZieltypTxt
FROM tblKonstanten INNER JOIN (tblZiel INNER JOIN DomainZielTyp ON tblZiel.ZielTyp = DomainZielTyp.ZieltypId) ON tblKonstanten.JBerJahr = tblZiel.ZielJahr
WHERE (tblZiel.ZielTyp=1 Or tblZiel.ZielTyp=2) OR (tblZiel.ZielTyp=1170775556)
ORDER BY tblZiel.ZielTyp, tblZiel.ZielBezeichnung;

CREATE VIEW vJBerOhneAp AS
SELECT tblJBer.JBerId AS "JBer Id", tblJBer.ApArtId AS "JBer ApArtId", tblJBer.JBerJahr AS "JBer Jahr", tblJBer.JBerSituation AS "JBer Situation", tblJBer.JBerVergleichVorjahrGesamtziel AS "JBer Vergleich Vorjahr-Gesamtziel", DomainApErfKrit.BeurteilTxt AS "JBer Beurteilung", tblJBer.JBerVeraenGegenVorjahr AS "JBer Veraend zum Vorjahr", tblJBer.JBerAnalyse AS "JBer Analyse", tblJBer.JBerUmsetzung AS "JBer Konsequenzen Umsetzung", tblJBer.JBerErfko AS "JBer Konsequenzen Erfolgskontrolle", tblJBer.JBerATxt AS "JBer Bemerkungen zu A", tblJBer.JBerBTxt AS "JBer Bemerkungen zu B", tblJBer.JBerCTxt AS "JBer Bemerkungen zu C", tblJBer.JBerDTxt AS "JBer Bemerkungen zu D", tblJBer.JBerDatum AS "JBer Datum", tblAdresse.AdrName AS "JBer BearbeiterIn", tblJBer.MutWann AS "JBer MutWann", tblJBer.MutWer AS "JBer MutWer"
FROM ((tblAktionsplan RIGHT JOIN tblJBer ON tblAktionsplan.ApArtId = tblJBer.ApArtId) LEFT JOIN tblAdresse ON tblJBer.JBerBearb = tblAdresse.AdrId) LEFT JOIN DomainApErfKrit ON tblJBer.JBerBeurteilung = DomainApErfKrit.BeurteilId
WHERE tblAktionsplan.ApArtId Is Null
ORDER BY tblJBer.ApArtId, tblJBer.JBerJahr, tblJBer.JBerDatum;

CREATE VIEW vBerJbArtD AS 
SELECT tblAktionsplan.*, CAST(CONCAT(ArtenDb_tblFloraSisf.Name, If(ArtenDb_tblFloraSisf.Deutsch Is Not Null,CONCAT(" (", ArtenDb_tblFloraSisf.Deutsch, ")"),"")) AS CHAR) AS Art, tblJBer.JBerId, tblJBer.JBerJahr, tblJBer.JBerSituation, tblJBer.JBerVergleichVorjahrGesamtziel, tblJBer.JBerBeurteilung, tblJBer.JBerAnalyse, tblJBer.JBerUmsetzung, tblJBer.JBerErfko, tblJBer.JBerATxt, tblJBer.JBerBTxt, tblJBer.JBerCTxt, tblJBer.JBerDTxt, tblJBer.JBerDatum, tblJBer.JBerBearb, tblAdresse.AdrName AS Bearbeiter, DomainApErfKrit.BeurteilTxt
FROM (ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR=tblAktionsplan.ApArtId) INNER JOIN (((tblJBer LEFT JOIN tblAdresse ON tblJBer.JBerBearb=tblAdresse.AdrId) LEFT JOIN DomainApErfKrit ON tblJBer.JBerBeurteilung=DomainApErfKrit.BeurteilId) INNER JOIN tblKonstanten ON tblJBer.JBerJahr=tblKonstanten.JBerJahr) ON tblAktionsplan.ApArtId=tblJBer.ApArtId;

CREATE VIEW vFnsJahrespflanzen AS 
SELECT distinct ArtenDb_tblFloraFnsJahresarten.SisfNr, If(ArtenDb_tblFloraFnsJahresarten.Jahr>0,"Ja","") AS Jahresart, ArtenDb_tblFloraFnsJahresarten.Jahr
FROM ArtenDb_tblFloraFnsJahresarten, tblKonstanten
WHERE ArtenDb_tblFloraFnsJahresarten.Jahr=tblKonstanten.JBerJahr;

CREATE VIEW vFnsKef AS 
SELECT ArtenDb_tblFloraFnsKef.SisfNr, If(ArtenDb_tblFloraFnsKef.KefArt=-1,"Ja","") AS FnsKefArt2, If(Round((tblKonstanten.JBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,0)=(tblKonstanten.JBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2
FROM ArtenDb_tblFloraFnsKef, tblKonstanten
ORDER BY ArtenDb_tblFloraFnsKef.SisfNr;

CREATE VIEW vPopMassnSeitBeginnAp AS 
SELECT tblTeilPopMassnahme.TPopId
FROM tblAktionsplan INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilPopMassnahme.TPopMassnJahr)>=tblAktionsplan.ApJahr))
GROUP BY tblTeilPopMassnahme.TPopId;

***reparieren***
CREATE VIEW vPopMassnBerOhneMassahmen AS 
SELECT ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblPopMassnBericht.PopMassnBerJahr
FROM (tblAktionsplan INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) INNER JOIN ((tblPopulation INNER JOIN tblPopMassnBericht ON tblPopulation.PopId = tblPopMassnBericht.PopId) LEFT JOIN (tblTeilpopulation LEFT JOIN vPopMassnSeitBeginnAp ON tblTeilpopulation.TPopId = vPopMassnSeitBeginnAp.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblPopMassnBericht.PopMassnBerJahr)>=tblAktionsplan.ApJahr) AND ((vPopMassnSeitBeginnAp.TPopId) Is Null) AND ((tblAktionsplan.ApStatus) Between 1 And 3))
GROUP BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblPopMassnBericht.PopMassnBerJahr
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopMassnBericht.PopMassnBerJahr DESC;

***reparieren***
CREATE VIEW vKontrTPopMassnBerichteOhneMassnahme AS 
SELECT ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilPopMassnBericht.TPopMassnBerJahr
FROM (tblAktionsplan INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) INNER JOIN ((tblPopulation INNER JOIN (tblTeilpopulation LEFT JOIN vPopMassnSeitBeginnAp ON tblTeilpopulation.TPopId = vPopMassnSeitBeginnAp.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnBericht ON tblTeilpopulation.TPopId = tblTeilPopMassnBericht.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilPopMassnBericht.TPopMassnBerJahr)>=tblAktionsplan.ApJahr) AND ((vPopMassnSeitBeginnAp.TPopId) Is Null) AND ((tblAktionsplan.ApStatus) Between 1 And 3))
GROUP BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilPopMassnBericht.TPopMassnBerJahr
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopMassnBericht.TPopMassnBerJahr DESC;

CREATE VIEW vApAnzMassnProJahr AS 
SELECT tblAktionsplan.ApArtId, tblTeilPopMassnahme.TPopMassnJahr, Count(tblTeilPopMassnahme.TPopMassnId) AS AnzahlvonTPopMassnId
FROM tblAktionsplan INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (tblAktionsplan.ApStatus Between 1 And 3) AND (tblTeilpopulation.TPopApBerichtRelevant=1)
GROUP BY tblAktionsplan.ApArtId, tblTeilPopMassnahme.TPopMassnJahr
HAVING tblTeilPopMassnahme.TPopMassnJahr Is Not Null
ORDER BY tblAktionsplan.ApArtId, tblTeilPopMassnahme.TPopMassnJahr;

CREATE VIEW vApAnzMassnBisJahr AS
SELECT vApAnzMassnProJahr.ApArtId, vApAnzMassnProJahr.TPopMassnJahr, Sum(vApAnzMassnProJahr_1.AnzahlvonTPopMassnId) AS "AnzahlMassnahmen"
FROM vApAnzMassnProJahr INNER JOIN vApAnzMassnProJahr AS vApAnzMassnProJahr_1 ON vApAnzMassnProJahr.ApArtId = vApAnzMassnProJahr_1.ApArtId
WHERE vApAnzMassnProJahr_1.TPopMassnJahr<=vApAnzMassnProJahr.TPopMassnJahr
GROUP BY vApAnzMassnProJahr.ApArtId, vApAnzMassnProJahr.TPopMassnJahr;

CREATE VIEW vApJahresberichte AS 
select tblAktionsplan.ApArtId AS ApArtId, tblJBer.JBerId AS JBerId, ArtenDb_tblFloraSisf.Name AS Name, tblJBer.JBerJahr AS JBerJahr, tblJBer.JBerSituation AS JBerSituation, tblJBer.JBerVergleichVorjahrGesamtziel AS JBerVergleichVorjahrGesamtziel, DomainApErfKrit.BeurteilTxt AS JBerBeurteilung,tblJBer.JBerVeraenGegenVorjahr AS JBerVeraenGegenVorjahr,tblJBer.JBerAnalyse AS JBerAnalyse,tblJBer.JBerUmsetzung AS JBerUmsetzung,tblJBer.JBerErfko AS JBerErfko,tblJBer.JBerATxt AS JBerATxt,tblJBer.JBerBTxt AS JBerBTxt,tblJBer.JBerCTxt AS JBerCTxt,tblJBer.JBerDTxt AS JBerDTxt,tblJBer.JBerDatum AS JBerDatum,tblAdresse.AdrName AS JBerBearb 
from ((tblAktionsplan join ArtenDb_tblFloraSisf on(tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR)) join ((tblJBer left join DomainApErfKrit on (tblJBer.JBerBeurteilung = DomainApErfKrit.BeurteilId)) left join tblAdresse on(tblJBer.JBerBearb = tblAdresse.AdrId)) on (tblAktionsplan.ApArtId = tblJBer.ApArtId)) 
order by ArtenDb_tblFloraSisf.Name;

CREATE VIEW vApJahresberichteUndMassnahmen AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblAdresse.AdrName AS "AP Verantwortlich", tblAktionsplan.ApArtwert AS Artwert, vApAnzMassnProJahr.TPopMassnJahr AS Jahr, vApAnzMassnProJahr.AnzahlvonTPopMassnId AS "Anzahl Massnahmen", vApAnzMassnBisJahr.AnzahlMassnahmen AS "Anzahl Massnahmen bisher", If(tblJBer.JBerJahr>0,"Ja","Nein") AS "Bericht erstellt"
FROM ((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN tblAdresse ON tblAktionsplan.ApBearb = tblAdresse.AdrId) INNER JOIN vApAnzMassnProJahr ON tblAktionsplan.ApArtId = vApAnzMassnProJahr.ApArtId) INNER JOIN vApAnzMassnBisJahr ON (vApAnzMassnProJahr.TPopMassnJahr = vApAnzMassnBisJahr.TPopMassnJahr) AND (vApAnzMassnProJahr.ApArtId = vApAnzMassnBisJahr.ApArtId)) LEFT JOIN tblJBer ON (vApAnzMassnBisJahr.TPopMassnJahr = tblJBer.JBerJahr) AND (vApAnzMassnBisJahr.ApArtId = tblJBer.ApArtId)
ORDER BY ArtenDb_tblFloraSisf.Name, vApAnzMassnProJahr.TPopMassnJahr;

CREATE VIEW vLetzterTPopMassnBericht0 AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId, tblTeilPopMassnBericht.TPopMassnBerJahr
FROM tblKonstanten, ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnBericht ON tblTeilpopulation.TPopId = tblTeilPopMassnBericht.TPopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId
WHERE (tblTeilPopMassnBericht.TPopMassnBerJahr<=tblKonstanten.JBerJahr) AND (tblTeilpopulation.TPopApBerichtRelevant=1) AND (tblTeilPopMassnahme.TPopMassnJahr<=tblKonstanten.JBerJahr);

CREATE VIEW vLetzterTPopMassnBericht AS
SELECT vLetzterTPopMassnBericht0.ApArtId, vLetzterTPopMassnBericht0.TPopId, Max(vLetzterTPopMassnBericht0.TPopMassnBerJahr) AS MaxvonTPopMassnBerJahr
FROM vLetzterTPopMassnBericht0
GROUP BY vLetzterTPopMassnBericht0.ApArtId, vLetzterTPopMassnBericht0.TPopId;

CREATE VIEW vLetzterTPopBericht0 AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId, tblTeilPopBericht.TPopBerJahr
FROM tblKonstanten, tblAktionsplan INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN tblTeilPopBericht ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (tblTeilPopBericht.TPopBerJahr<=tblKonstanten.JBerJahr And tblTeilPopBericht.TPopBerJahr>=tblAktionsplan.ApJahr) AND (tblTeilpopulation.TPopApBerichtRelevant=1);

CREATE VIEW vLetzterTPopBericht AS 
SELECT vLetzterTPopBericht0.ApArtId, vLetzterTPopBericht0.TPopId, Max(vLetzterTPopBericht0.TPopBerJahr) AS MaxvonTPopBerJahr
FROM vLetzterTPopBericht0
GROUP BY vLetzterTPopBericht0.ApArtId, vLetzterTPopBericht0.TPopId;

CREATE VIEW vLetzterPopMassnBericht0 AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId, tblPopMassnBericht.PopMassnBerJahr
FROM tblKonstanten, ((tblPopulation INNER JOIN tblPopMassnBericht ON tblPopulation.PopId = tblPopMassnBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId
WHERE (tblPopMassnBericht.PopMassnBerJahr<=tblKonstanten.JBerJahr) AND (tblTeilpopulation.TPopApBerichtRelevant=1) AND (tblTeilPopMassnahme.TPopMassnJahr<=tblKonstanten.JBerJahr);

CREATE VIEW vLetzterPopMassnBericht AS 
SELECT vLetzterPopMassnBericht0.ApArtId, vLetzterPopMassnBericht0.PopId, Max(vLetzterPopMassnBericht0.PopMassnBerJahr) AS MaxvonPopMassnBerJahr
FROM vLetzterPopMassnBericht0
GROUP BY vLetzterPopMassnBericht0.ApArtId, vLetzterPopMassnBericht0.PopId;

CREATE VIEW vLetzterPopBericht0 AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId, tblPopBericht.PopBerJahr
FROM tblKonstanten, (tblPopulation INNER JOIN tblPopBericht ON tblPopulation.PopId = tblPopBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (tblPopBericht.PopBerJahr<=tblKonstanten.JBerJahr) AND (tblTeilpopulation.TPopApBerichtRelevant=1);

CREATE VIEW vLetzterPopBericht AS
SELECT vLetzterPopBericht0.ApArtId, vLetzterPopBericht0.PopId, Max(vLetzterPopBericht0.PopBerJahr) AS MaxvonPopBerJahr
FROM vLetzterPopBericht0
GROUP BY vLetzterPopBericht0.ApArtId, vLetzterPopBericht0.PopId;

CREATE VIEW vJbUebE AS 
SELECT tblJBer.*, CAST(If(ArtenDb_tblFloraSisf.Deutsch Is Null,ArtenDb_tblFloraSisf.Name,CONCAT(ArtenDb_tblFloraSisf.Name,' (',ArtenDb_tblFloraSisf.Deutsch,')')) AS CHAR) AS Artname, If(ArtenDb_tblFloraFnsKef.KefArt=-1,"Ja","") AS FnsKefArt2, ArtenDb_tblFloraFnsKef.KefKontrolljahr, If(Round((tblKonstanten.JBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,0)=(tblKonstanten.JBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, vFnsJahrespflanzen.Jahr AS FnsJahrespflanze, vFnsJahrespflanzen.Jahresart AS FnsJahrespflanze2, vApAnzMassnBisJahr.AnzahlMassnahmen
FROM tblKonstanten AS tblKonstanten_1 INNER JOIN ((((ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN vApApBerichtRelevant ON tblAktionsplan.ApArtId = vApApBerichtRelevant.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN ArtenDb_tblFloraFnsKef ON tblAktionsplan.ApArtId = ArtenDb_tblFloraFnsKef.SisfNr) LEFT JOIN vFnsJahrespflanzen ON tblAktionsplan.ApArtId = vFnsJahrespflanzen.SisfNr) INNER JOIN (tblKonstanten INNER JOIN (tblJBer INNER JOIN vApAnzMassnBisJahr ON tblJBer.ApArtId = vApAnzMassnBisJahr.ApArtId) ON tblKonstanten.JBerJahr = tblJBer.JBerJahr) ON tblAktionsplan.ApArtId = tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = vApAnzMassnBisJahr.TPopMassnJahr
WHERE ((vApAnzMassnBisJahr.AnzahlMassnahmen>0) AND (tblJBer.JBerBeurteilung=1) AND (tblAktionsplan.ApStatus Between 1 And 3))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vJbUebKm AS 
SELECT CAST(If(ArtenDb_tblFloraSisf.Deutsch is null,ArtenDb_tblFloraSisf.Name, CONCAT(ArtenDb_tblFloraSisf.Name, ' (', ArtenDb_tblFloraSisf.Deutsch, ')')) AS CHAR) AS Artname, If(ArtenDb_tblFloraFnsKef.KefArt=-1,"Ja","") AS FnsKefArt2, If(Round((tblKonstanten.JBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,0)=(tblKonstanten.JBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, ArtenDb_tblFloraFnsJahresarten.Jahr AS FnsJahrespflanze, vFnsJahrespflanzen.Jahresart AS FnsJahrespflanze2
FROM ((((ArtenDb_tblFloraSisf INNER JOIN ((vApAnzMassnBisJahr AS vApAnzMassnBisJahr_1 RIGHT JOIN tblAktionsplan ON vApAnzMassnBisJahr_1.ApArtId = tblAktionsplan.ApArtId) INNER JOIN vApApBerichtRelevant ON tblAktionsplan.ApArtId = vApApBerichtRelevant.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN ArtenDb_tblFloraFnsJahresarten ON tblAktionsplan.ApArtId = ArtenDb_tblFloraFnsJahresarten.SisfNr) LEFT JOIN ArtenDb_tblFloraFnsKef ON tblAktionsplan.ApArtId = ArtenDb_tblFloraFnsKef.SisfNr) LEFT JOIN vFnsJahrespflanzen ON tblAktionsplan.ApArtId = vFnsJahrespflanzen.SisfNr) INNER JOIN (tblJBer INNER JOIN tblKonstanten ON tblJBer.JBerJahr = tblKonstanten.JBerJahr) ON tblAktionsplan.ApArtId = tblJBer.ApArtId
WHERE ((tblAktionsplan.ApStatus Between 1 And 3) AND (vApAnzMassnBisJahr_1.AnzahlMassnahmen=0)) OR ((tblAktionsplan.ApStatus Between 1 And 3) AND (vApAnzMassnBisJahr_1.AnzahlMassnahmen Is Null))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vJbUebMa AS 
SELECT CAST(If(ArtenDb_tblFloraSisf.Deutsch Is Null,ArtenDb_tblFloraSisf.Name,CONCAT(ArtenDb_tblFloraSisf.Name,' (',ArtenDb_tblFloraSisf.Deutsch,')')) AS CHAR) AS Artname, vApAnzMassnBisJahr.AnzahlMassnahmen
FROM tblKonstanten INNER JOIN ((ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN vApApBerichtRelevant ON tblAktionsplan.ApArtId = vApApBerichtRelevant.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN vApAnzMassnBisJahr ON tblAktionsplan.ApArtId = vApAnzMassnBisJahr.ApArtId) ON tblKonstanten.JBerJahr = vApAnzMassnBisJahr.TPopMassnJahr
WHERE (vApAnzMassnBisJahr.AnzahlMassnahmen>0) AND (tblAktionsplan.ApStatus Between 1 And 3)
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vJbUebMe AS
SELECT tblJBer.*, CAST(If(ArtenDb_tblFloraSisf.Deutsch Is Null,ArtenDb_tblFloraSisf.Name,CONCAT(ArtenDb_tblFloraSisf.Name,' (',ArtenDb_tblFloraSisf.Deutsch,')')) AS CHAR) AS Artname, If("KefArt"=-1,"Ja","") AS FnsKefArt2, If(Round((tblKonstanten.JBerJahr-"KefKontrolljahr")/4,0)=(tblKonstanten.JBerJahr-"KefKontrolljahr")/4,"Ja","") AS FnsKefKontrJahr2, vFnsJahrespflanzen.Jahr AS FnsJahrespflanze, vFnsJahrespflanzen.Jahresart AS FnsJahrespflanze2
FROM tblKonstanten AS tblKonstanten_1 INNER JOIN ((((ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN vApApBerichtRelevant ON tblAktionsplan.ApArtId = vApApBerichtRelevant.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN vFnsJahrespflanzen ON tblAktionsplan.ApArtId = vFnsJahrespflanzen.SisfNr) INNER JOIN ((tblJBer INNER JOIN vApAnzMassnBisJahr ON tblJBer.ApArtId = vApAnzMassnBisJahr.ApArtId) INNER JOIN tblKonstanten ON tblJBer.JBerJahr = tblKonstanten.JBerJahr) ON tblAktionsplan.ApArtId = tblJBer.ApArtId) LEFT JOIN ArtenDb_tblFloraFnsKef ON ArtenDb_tblFloraSisf.NR = ArtenDb_tblFloraFnsKef.SisfNr) ON tblKonstanten_1.JBerJahr = vApAnzMassnBisJahr.TPopMassnJahr
WHERE (tblJBer.JBerBeurteilung=5) AND (vApAnzMassnBisJahr.AnzahlMassnahmen>0) AND (tblAktionsplan.ApStatus Between 1 And 3)
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vJbUebNe AS
SELECT tblJBer.*, CAST(If(ArtenDb_tblFloraSisf.Deutsch Is Null,ArtenDb_tblFloraSisf.Name,CONCAT(ArtenDb_tblFloraSisf.Name,' (',ArtenDb_tblFloraSisf.Deutsch,')')) AS CHAR) AS Artname, If(ArtenDb_tblFloraFnsKef.KefArt=-1,"Ja","") AS FnsKefArt2, If(Round((tblKonstanten.JBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,0)=(tblKonstanten.JBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, vFnsJahrespflanzen.Jahr AS FnsJahrespflanze, vFnsJahrespflanzen.Jahresart AS FnsJahrespflanze2
FROM tblKonstanten AS tblKonstanten_1 INNER JOIN (((((ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN vApApBerichtRelevant ON tblAktionsplan.ApArtId = vApApBerichtRelevant.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN vFnsJahrespflanzen ON tblAktionsplan.ApArtId = vFnsJahrespflanzen.SisfNr) LEFT JOIN ArtenDb_tblFloraFnsJahresarten ON ArtenDb_tblFloraSisf.NR = ArtenDb_tblFloraFnsJahresarten.SisfNr) LEFT JOIN ArtenDb_tblFloraFnsKef ON ArtenDb_tblFloraSisf.NR = ArtenDb_tblFloraFnsKef.SisfNr) INNER JOIN ((tblJBer INNER JOIN vApAnzMassnBisJahr ON tblJBer.ApArtId = vApAnzMassnBisJahr.ApArtId) INNER JOIN tblKonstanten ON tblJBer.JBerJahr = tblKonstanten.JBerJahr) ON tblAktionsplan.ApArtId = tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = vApAnzMassnBisJahr.TPopMassnJahr
WHERE (tblJBer.JBerBeurteilung=3) AND (tblAktionsplan.ApStatus Between 1 And 3) AND (vApAnzMassnBisJahr.AnzahlMassnahmen>0)
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vJbUebSe AS 
SELECT tblJBer.*, CAST(If(ArtenDb_tblFloraSisf.Deutsch Is Null,ArtenDb_tblFloraSisf.Name,CONCAT(ArtenDb_tblFloraSisf.Name,' (',ArtenDb_tblFloraSisf.Deutsch,')')) AS CHAR) AS Artname, If(ArtenDb_tblFloraFnsKef.KefArt=-1,"Ja","") AS FnsKefArt2, If(Round((tblKonstanten.JBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,0)=(tblKonstanten.JBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, vFnsJahrespflanzen.Jahr AS FnsJahrespflanze, vFnsJahrespflanzen.Jahresart AS FnsJahrespflanze2
FROM tblKonstanten AS tblKonstanten_1 INNER JOIN ((((ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN vApApBerichtRelevant ON tblAktionsplan.ApArtId = vApApBerichtRelevant.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN vFnsJahrespflanzen ON tblAktionsplan.ApArtId = vFnsJahrespflanzen.SisfNr) LEFT JOIN ArtenDb_tblFloraFnsKef ON ArtenDb_tblFloraSisf.NR = ArtenDb_tblFloraFnsKef.SisfNr) INNER JOIN ((tblJBer INNER JOIN vApAnzMassnBisJahr ON tblJBer.ApArtId = vApAnzMassnBisJahr.ApArtId) INNER JOIN tblKonstanten ON tblJBer.JBerJahr = tblKonstanten.JBerJahr) ON tblAktionsplan.ApArtId = tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = vApAnzMassnBisJahr.TPopMassnJahr
WHERE (tblJBer.JBerBeurteilung=4) AND (vApAnzMassnBisJahr.AnzahlMassnahmen>0) AND (tblAktionsplan.ApStatus Between 1 And 3)
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vJbUebUn AS
SELECT tblJBer.*, CAST(If(ArtenDb_tblFloraSisf.Deutsch Is Null,ArtenDb_tblFloraSisf.Name,CONCAT(ArtenDb_tblFloraSisf.Name,' (',ArtenDb_tblFloraSisf.Deutsch,')')) AS CHAR) AS Artname, If(ArtenDb_tblFloraFnsKef.KefArt=-1,"Ja","") AS FnsKefArt2, If(Round((tblKonstanten.JBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,0)=(tblKonstanten.JBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, vFnsJahrespflanzen.Jahr AS FnsJahrespflanze, vFnsJahrespflanzen.Jahresart AS FnsJahrespflanze2
FROM tblKonstanten AS tblKonstanten_1 INNER JOIN ((((ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN vApApBerichtRelevant ON tblAktionsplan.ApArtId = vApApBerichtRelevant.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN vFnsJahrespflanzen ON tblAktionsplan.ApArtId = vFnsJahrespflanzen.SisfNr) LEFT JOIN ArtenDb_tblFloraFnsKef ON ArtenDb_tblFloraSisf.NR = ArtenDb_tblFloraFnsKef.SisfNr) INNER JOIN ((tblJBer INNER JOIN vApAnzMassnBisJahr ON tblJBer.ApArtId = vApAnzMassnBisJahr.ApArtId) INNER JOIN tblKonstanten ON tblJBer.JBerJahr = tblKonstanten.JBerJahr) ON tblAktionsplan.ApArtId = tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = vApAnzMassnBisJahr.TPopMassnJahr
WHERE (tblJBer.JBerBeurteilung=1168274204) AND (vApAnzMassnBisJahr.AnzahlMassnahmen>0) AND (tblAktionsplan.ApStatus Between 1 And 3)
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vJbUebWe AS 
SELECT tblJBer.*, CAST(If(ArtenDb_tblFloraSisf.Deutsch Is Null,ArtenDb_tblFloraSisf.Name,CONCAT(ArtenDb_tblFloraSisf.Name,' (',ArtenDb_tblFloraSisf.Deutsch,')')) AS CHAR) AS Artname, If(ArtenDb_tblFloraFnsKef.KefArt=-1,"Ja","") AS FnsKefArt2, If(Round((tblKonstanten.JBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,0)=(tblKonstanten.JBerJahr-ArtenDb_tblFloraFnsKef.KefKontrolljahr)/4,"Ja","") AS FnsKefKontrJahr2, vFnsJahrespflanzen.Jahr AS FnsJahrespflanze, vFnsJahrespflanzen.Jahresart AS FnsJahrespflanze2
FROM tblKonstanten AS tblKonstanten_1 INNER JOIN ((((ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan INNER JOIN vApApBerichtRelevant ON tblAktionsplan.ApArtId = vApApBerichtRelevant.ApArtId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN vFnsJahrespflanzen ON tblAktionsplan.ApArtId = vFnsJahrespflanzen.SisfNr) LEFT JOIN ArtenDb_tblFloraFnsKef ON ArtenDb_tblFloraSisf.NR = ArtenDb_tblFloraFnsKef.SisfNr) INNER JOIN ((tblJBer INNER JOIN vApAnzMassnBisJahr ON tblJBer.ApArtId = vApAnzMassnBisJahr.ApArtId) INNER JOIN tblKonstanten ON tblJBer.JBerJahr = tblKonstanten.JBerJahr) ON tblAktionsplan.ApArtId = tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = vApAnzMassnBisJahr.TPopMassnJahr
WHERE (tblJBer.JBerBeurteilung=6) AND (vApAnzMassnBisJahr.AnzahlMassnahmen>0) AND (tblAktionsplan.ApStatus Between 1 And 3)
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vJbUebNichtBeurteilt000 AS 
SELECT tblAktionsplan.ApArtId
FROM (((tblAktionsplan INNER JOIN vApAnzMassnBisJahr ON tblAktionsplan.ApArtId = vApAnzMassnBisJahr.ApArtId) INNER JOIN vApApBerichtRelevant ON tblAktionsplan.ApArtId = vApApBerichtRelevant.ApArtId) LEFT JOIN tblJBer ON tblAktionsplan.ApArtId = tblJBer.ApArtId) INNER JOIN tblKonstanten ON vApAnzMassnBisJahr.TPopMassnJahr = tblKonstanten.JBerJahr
WHERE (tblJBer.ApArtId Is Null) AND (tblAktionsplan.ApStatus Between 1 And 3);

alt:
SELECT tblAktionsplan.ApArtId
FROM ((tblAktionsplan INNER JOIN vApAnzMassnBisJahr ON tblAktionsplan.ApArtId = vApAnzMassnBisJahr.ApArtId) INNER JOIN vApApBerichtRelevant ON tblAktionsplan.ApArtId = vApApBerichtRelevant.ApArtId) LEFT JOIN tblJBer ON tblAktionsplan.ApArtId = tblJBer.ApArtId
WHERE ((tblJBer.ApArtId Is Null) AND (tblAktionsplan.ApStatus Between 1 And 3));

CREATE VIEW vJbUebNichtBeurteilt00 AS 
SELECT tblAktionsplan.ApArtId
FROM tblKonstanten AS tblKonstanten_1 INNER JOIN (((tblAktionsplan INNER JOIN vApAnzMassnBisJahr ON tblAktionsplan.ApArtId = vApAnzMassnBisJahr.ApArtId) INNER JOIN vApApBerichtRelevant ON tblAktionsplan.ApArtId = vApApBerichtRelevant.ApArtId) INNER JOIN (tblJBer INNER JOIN tblKonstanten ON tblJBer.JBerJahr = tblKonstanten.JBerJahr) ON tblAktionsplan.ApArtId = tblJBer.ApArtId) ON tblKonstanten_1.JBerJahr = vApAnzMassnBisJahr.TPopMassnJahr
WHERE (tblAktionsplan.ApStatus Between 1 And 3) AND (tblJBer.JBerBeurteilung Is Null);

alt:
SELECT tblAktionsplan.ApArtId
FROM ((tblAktionsplan INNER JOIN vApAnzMassnBisJahr ON tblAktionsplan.ApArtId = vApAnzMassnBisJahr.ApArtId) INNER JOIN vApApBerichtRelevant ON tblAktionsplan.ApArtId = vApApBerichtRelevant.ApArtId) INNER JOIN (tblJBer INNER JOIN tblKonstanten ON tblJBer.JBerJahr = tblKonstanten.JBerJahr) ON tblAktionsplan.ApArtId = tblJBer.ApArtId
WHERE (((tblJBer.JBerJahr)=tblKonstanten.JBerJahr) AND ((tblAktionsplan.ApStatus) Between 1 And 3) AND ((tblJBer.JBerBeurteilung) Is Null));

CREATE VIEW vJbUebNichtBeurteilt0 AS 
select ApArtId from vJbUebNichtBeurteilt000
UNION select ApArtId from vJbUebNichtBeurteilt00;

CREATE VIEW vJbUebNichtBeurteilt AS 
SELECT If(ArtenDb_tblFloraSisf.Deutsch is null,ArtenDb_tblFloraSisf.Name, CONCAT(ArtenDb_tblFloraSisf.Name, ' (', ArtenDb_tblFloraSisf.Deutsch, ')')) AS Artname, vFnsKef.FnsKefArt2, vFnsKef.FnsKefKontrJahr2, vFnsJahrespflanzen.Jahr AS FnsJahrespflanze, vFnsJahrespflanzen.Jahresart AS FnsJahrespflanze2
FROM (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN vFnsJahrespflanzen ON tblAktionsplan.ApArtId = vFnsJahrespflanzen.SisfNr) LEFT JOIN vFnsKef ON tblAktionsplan.ApArtId = vFnsKef.SisfNr) INNER JOIN vJbUebNichtBeurteilt0 ON tblAktionsplan.ApArtId = vJbUebNichtBeurteilt0.ApArtId
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3));

CREATE VIEW vPopTPopPopFehlt AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, DomainApErfKrit.BeurteilTxt AS "Bearbeitungsstand AP", tblPopulation.PopNr, tblPopulation.PopName
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN DomainApErfKrit ON tblAktionsplan.ApStatus = DomainApErfKrit.BeurteilId
WHERE ((tblAktionsplan.ApStatus) Between 1 And 3) AND ((tblPopulation.PopId) Not In (SELECT tblTeilpopulation.PopId FROM tblTeilpopulation WHERE (tblTeilpopulation.TPopPop=1) GROUP BY tblTeilpopulation.PopId))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName;

CREATE VIEW vKontrApArtTPopOhneStatus AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt AS "Status Population", tblTeilpopulation.TPopNr, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopHerkunft AS "Status Teilpopulation"
FROM (DomainApBearbeitungsstand INNER JOIN (ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) ON DomainApBearbeitungsstand.DomainCode = tblAktionsplan.ApStatus) INNER JOIN ((tblPopulation INNER JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilpopulation.TPopHerkunft) Is Null) AND ((tblAktionsplan.ApStatus)=3))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr;

CREATE VIEW vTPopOhneBekanntSeit AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS ApStatus_, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopBekanntSeit
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilpopulation.TPopBekanntSeit) Is Null) AND ((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname;

CREATE VIEW vKontrTPopKoorLeer AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS ApStatus_, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilpopulation.TPopXKoord) Is Null) AND ((tblAktionsplan.ApStatus) Between 1 And 3)) OR (((tblTeilpopulation.TPopYKoord) Is Null) AND ((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname;

CREATE VIEW vTPopBerLetzterBericht AS 
SELECT tblTeilPopBericht.TPopId, Max(tblTeilPopBericht.TPopBerJahr) AS MaxvonTPopBerJahr
FROM tblTeilPopBericht
GROUP BY tblTeilPopBericht.TPopId;

CREATE VIEW vKontrTPopStatusErloschen AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopHerkunft, tblTeilPopBericht.TPopBerEntwicklung, tblTeilPopBericht.TPopBerJahr
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN vTPopBerLetzterBericht ON (tblTeilPopBericht.TPopId = vTPopBerLetzterBericht.TPopId) AND (tblTeilPopBericht.TPopBerJahr = vTPopBerLetzterBericht.MaxvonTPopBerJahr)) ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3) AND ((tblTeilpopulation.TPopHerkunft)=4 Or (tblTeilpopulation.TPopHerkunft)=7) AND ((tblTeilPopBericht.TPopBerEntwicklung)<>8)) OR (((tblAktionsplan.ApStatus) Between 1 And 3) AND ((tblTeilpopulation.TPopHerkunft) Not Like 4 And (tblTeilpopulation.TPopHerkunft) Not Like 7) AND ((tblTeilPopBericht.TPopBerEntwicklung)=8))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname;

CREATE VIEW vBerJb AS 
SELECT tblAktionsplan.*, If(ArtenDb_tblFloraSisf.Deutsch is null,ArtenDb_tblFloraSisf.Name, CONCAT(ArtenDb_tblFloraSisf.Name, ' (', ArtenDb_tblFloraSisf.Deutsch, ')')) AS Art, tblJBer.JBerId, tblJBer.JBerJahr, tblJBer.JBerSituation, tblJBer.JBerVergleichVorjahrGesamtziel, tblJBer.JBerBeurteilung, tblJBer.JBerAnalyse, tblJBer.JBerUmsetzung, tblJBer.JBerErfko, tblJBer.JBerATxt, tblJBer.JBerBTxt, tblJBer.JBerCTxt, tblJBer.JBerDTxt, tblJBer.JBerDatum, tblJBer.JBerBearb, tblAdresse.AdrName & ", " & tblAdresse.AdrAdresse AS Bearbeiter, tblJBerUebersicht.JbuJahr, tblJBerUebersicht.JbuBemerkungen, vErsteMassnahmeProArt.MinvonTPopMassnJahr AS ErsteMassnahmeImJahr
FROM (ArtenDb_tblFloraSisf INNER JOIN (tblAktionsplan LEFT JOIN vErsteMassnahmeProArt ON tblAktionsplan.ApArtId=vErsteMassnahmeProArt.ApArtId) ON ArtenDb_tblFloraSisf.NR=tblAktionsplan.ApArtId) INNER JOIN (((tblJBer LEFT JOIN tblAdresse ON tblJBer.JBerBearb=tblAdresse.AdrId) LEFT JOIN tblJBerUebersicht ON tblJBer.JBerJahr=tblJBerUebersicht.JbuJahr) INNER JOIN tblKonstanten ON tblJBer.JBerJahr=tblKonstanten.JBerJahr) ON tblAktionsplan.ApArtId=tblJBer.ApArtId
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vAuswAp AS 
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblAktionsplan.ApJahr AS "Start AP im Jahr", DomainApUmsetzung.DomainTxt AS "Stand Umsetzung AP", tblAdresse.AdrName AS "Verantwortlich", tblAktionsplan.MutWann AS "Letzte Änderung", tblAktionsplan.MutWer AS "Letzte(r) Bearbeiter(in)"
FROM (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN tblAdresse ON tblAktionsplan.ApBearb = tblAdresse.AdrId
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vProgramme AS 
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Bearbeitungsstand", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblAdresse.AdrName AS "AP verantwortlich", tblAktionsplan.MutWann AS "AP Letzte Änderung", tblAktionsplan.MutWer AS "AP Letzte(r) Bearbeiter(in)"
FROM (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN tblAdresse ON tblAktionsplan.ApBearb = tblAdresse.AdrId
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vApBer AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Bearbeitungsstand", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblAdresse.AdrName AS "AP verantwortlich", tblApBer.BerId AS "Ber Id", tblApBer.BerAutor AS "Ber Autor", tblApBer.BerJahr AS "Ber Jahr", tblApBer.BerTitel AS "Ber Titel", tblApBer.BerURL AS "Ber URL", tblApBer.MutWann AS "Ber MutWann", tblApBer.MutWer AS "Ber MutWer"
FROM ((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN tblAdresse ON tblAktionsplan.ApBearb = tblAdresse.AdrId) INNER JOIN tblApBer ON tblAktionsplan.ApArtId = tblApBer.ApArtId
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vIdealBiotope AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Bearbeitungsstand", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblAdresse.AdrName AS "AP verantwortlich", tblIdealBiotope.IbId AS "IB Id", tblIdealBiotope.IbName AS "IB Name", tblIdealBiotope.IbVegTyp AS "IB VegTyp", tblIdealBiotope.IbBewPflege AS "IB Pflege", tblIdealBiotope.IbBemerkungen AS "IB Bemerkungen", tblIdealBiotope.MutWann AS "IB MutWann", tblIdealBiotope.MutWer AS "IB MutWer"
FROM ((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN tblAdresse ON tblAktionsplan.ApBearb = tblAdresse.AdrId) INNER JOIN tblIdealBiotope ON tblAktionsplan.ApArtId = tblIdealBiotope.IbApArtId
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vAssozArten AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Bearbeitungsstand", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblAdresse.AdrName AS "AP verantwortlich", tblAssozArten.AaId AS "AA Id", ArtenDb_tblFloraSisf_1.Name AS "AA Art", tblAssozArten.AaBem AS "AA Bemerkungen", tblAssozArten.MutWann AS "AA MutWann", tblAssozArten.MutWer AS "AA MutWer"
FROM ArtenDb_tblFloraSisf AS ArtenDb_tblFloraSisf_1 INNER JOIN (((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN tblAdresse ON tblAktionsplan.ApBearb = tblAdresse.AdrId) INNER JOIN tblAssozArten ON tblAktionsplan.ApArtId = tblAssozArten.AaApArtId) ON ArtenDb_tblFloraSisf_1.NR = tblAssozArten.AaSisfNr
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vApOhnePop AS 
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblAktionsplan.ApJahr AS "Start AP im Jahr", DomainApUmsetzung.DomainTxt AS "Stand Umsetzung AP", tblAdresse.AdrName AS "Verantwortlich", tblPopulation.ApArtId AS "Population"
FROM ((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN tblAdresse ON tblAktionsplan.ApBearb = tblAdresse.AdrId) LEFT JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblPopulation.ApArtId) Is Null))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vApArtenAnzKontrInJahr AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblTeilPopFeldkontrolle.TPopKontrId, tblTeilPopFeldkontrolle.TPopKontrJahr
FROM (tblAktionsplan INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3))
GROUP BY tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblTeilPopFeldkontrolle.TPopKontrId, tblTeilPopFeldkontrolle.TPopKontrJahr;

CREATE VIEW vApErfKrit AS
SELECT tblAktionsplan.ApArtId AS "AP Id", ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblAdresse.AdrName AS "AP verantwortlich", tblApErfKrit.ErfBeurtZielSkalaId AS "ErfKrit Id", DomainApErfKrit.BeurteilTxt AS "ErfKrit Beurteilung", tblApErfKrit.ErfBeurtZielSkalaTxt AS "ErfKrit Kriterien", tblApErfKrit.MutWann AS "ErfKrit MutWann", tblApErfKrit.MutWer AS "ErfKrit MutWer"
FROM (((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN tblAdresse ON tblAktionsplan.ApBearb = tblAdresse.AdrId) INNER JOIN tblApErfKrit ON tblAktionsplan.ApArtId = tblApErfKrit.ApArtId) LEFT JOIN DomainApErfKrit ON tblApErfKrit.ErfBeurtZielSkalaErreichungsgrad = DomainApErfKrit.BeurteilId
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vAuswApArtenAnzMassnInJahr0 AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblTeilPopMassnahme.TPopMassnId, tblTeilPopMassnahme.TPopMassnJahr
FROM (tblAktionsplan INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3))
GROUP BY tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, tblTeilPopMassnahme.TPopMassnId, tblTeilPopMassnahme.TPopMassnJahr;

CREATE VIEW vAuswApArtenBearbMassnInJahr0 AS 
SELECT tblAdresse.AdrName, ArtenDb_tblFloraSisf.Name AS Art, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilPopMassnahme.TPopMassnJahr, DomainTPopMassnTyp.MassnTypTxt AS TPopMassnTyp, tblTeilPopMassnahme.TPopMassnTxt, tblTeilPopMassnahme.TPopMassnDatum, tblTeilPopMassnahme.TPopMassnBemTxt, tblTeilPopMassnahme.TPopMassnPlan, tblTeilPopMassnahme.TPopMassnPlanBez, tblTeilPopMassnahme.TPopMassnFlaeche, tblTeilPopMassnahme.TPopMassnMarkierung, tblTeilPopMassnahme.TPopMassnAnsiedAnzTriebe, tblTeilPopMassnahme.TPopMassnAnsiedAnzPfl, tblTeilPopMassnahme.TPopMassnAnzPflanzstellen, tblTeilPopMassnahme.TPopMassnAnsiedWirtspfl, tblTeilPopMassnahme.TPopMassnAnsiedHerkunftPop, tblTeilPopMassnahme.TPopMassnAnsiedDatSamm, tblTeilPopMassnahme.TPopMassnAnsiedForm, tblTeilPopMassnahme.TPopMassnAnsiedPflanzanordnung
FROM (ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN ((tblTeilPopMassnahme LEFT JOIN tblAdresse ON tblTeilPopMassnahme.TPopMassnBearb = tblAdresse.AdrId) INNER JOIN DomainTPopMassnTyp ON tblTeilPopMassnahme.TPopMassnTyp = DomainTPopMassnTyp.MassnTypCode) ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY tblAdresse.AdrName, ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname;

CREATE VIEW vAuswApArtenMitMassnInJahr0 AS 
SELECT ArtenDb_tblFloraSisf.Name AS Art, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilPopMassnahme.TPopMassnJahr, DomainTPopMassnTyp.MassnTypTxt AS TPopMassnTyp, tblTeilPopMassnahme.TPopMassnTxt, tblTeilPopMassnahme.TPopMassnDatum, tblAdresse.AdrName AS TPopMassnBearb, tblTeilPopMassnahme.TPopMassnBemTxt, tblTeilPopMassnahme.TPopMassnPlan, tblTeilPopMassnahme.TPopMassnPlanBez, tblTeilPopMassnahme.TPopMassnFlaeche, tblTeilPopMassnahme.TPopMassnMarkierung, tblTeilPopMassnahme.TPopMassnAnsiedAnzTriebe, tblTeilPopMassnahme.TPopMassnAnsiedAnzPfl, tblTeilPopMassnahme.TPopMassnAnzPflanzstellen, tblTeilPopMassnahme.TPopMassnAnsiedWirtspfl, tblTeilPopMassnahme.TPopMassnAnsiedHerkunftPop, tblTeilPopMassnahme.TPopMassnAnsiedDatSamm, tblTeilPopMassnahme.TPopMassnAnsiedForm, tblTeilPopMassnahme.TPopMassnAnsiedPflanzanordnung
FROM (ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN ((tblTeilPopMassnahme INNER JOIN DomainTPopMassnTyp ON tblTeilPopMassnahme.TPopMassnTyp = DomainTPopMassnTyp.MassnTypCode) LEFT JOIN tblAdresse ON tblTeilPopMassnahme.TPopMassnBearb = tblAdresse.AdrId) ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblAktionsplan.ApStatus) Between 1 And 3))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname;

CREATE VIEW vAuswArtPopTPopMassnBerFuerAktArt0 AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Aktionsplan-Status", tblAktionsplan.ApJahr AS "Aktionsplan-Jahr", DomainApUmsetzung.DomainTxt AS "Aktionsplan-Umsetzung", tblPopulation.PopNr AS "Population-Nr", tblPopulation.PopName AS "Population-Name", DomainPopHerkunft.HerkunftTxt AS "Population-Herkunft", tblPopulation.PopBekanntSeit AS "Population - bekannt seit", tblTeilpopulation.TPopNr AS "Teilpopulation-Nr", tblTeilpopulation.TPopGemeinde AS "Teilpopulation-Gemeinde", tblTeilpopulation.TPopFlurname AS "Teilpopulation-Flurname", tblTeilpopulation.TPopXKoord AS "Teilpopulation-X-Koodinate", tblTeilpopulation.TPopYKoord AS "Teilpopulation-Y-Koordinate", tblTeilpopulation.TPopRadius AS "Teilpopulation-Radius", tblTeilpopulation.TPopHoehe AS "Teilpopulation-Hoehe", tblTeilpopulation.TPopBeschr AS "Teilpopulation-Beschreibung", tblTeilpopulation.TPopKatNr AS "Teilpopulation-Kataster-Nr", tblAdresse.AdrName AS "Teilpopulation-Verantwortlich", DomainPopHerkunft_1.HerkunftTxt AS "Teilpopulation-Herkunft", tblTeilpopulation.TPopHerkunftUnklar AS "Teilpopulation - Herkunft unklar", tblTeilpopulation.TPopHerkunftUnklarBegruendung AS "Teilpopulation - Herkunft unklar Begründung", DomainTPopApBerichtRelevant.DomainTxt AS "Teilpopulation - Für Bericht relevant", tblTeilpopulation.TPopBekanntSeit AS "Teilpopulation - bekannt seit", tblTeilpopulation.TPopEigen AS "Teilpopulation-Eigentümer", tblTeilpopulation.TPopKontakt AS "Teilpopulation-Kontakt", tblTeilpopulation.TPopNutzungszone AS "Teilpopulation-Nutzungszone", tblTeilpopulation.TPopBewirtschafterIn AS "Teilpopulation-Bewirtschafter", tblTeilpopulation.TPopBewirtschaftung AS "Teilpopulation-Bewirtschaftung", tblTeilpopulation.TPopTxt AS "Teilpopulation-Bemerkungen", tblTeilPopMassnBericht.TPopMassnBerJahr AS "Massnahmenbericht-Jahr", DomainTPopMassnErfolgsbeurteilung.BeurteilTxt AS "Massnahmenbericht-Erfolgsberuteilung", tblTeilPopMassnBericht.TPopMassnBerTxt AS "Massnahmenbericht-Interpretation"
FROM (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) INNER JOIN (((tblPopulation LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) INNER JOIN (((tblTeilpopulation LEFT JOIN tblAdresse ON tblTeilpopulation.TPopVerantw = tblAdresse.AdrId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId) LEFT JOIN DomainTPopApBerichtRelevant ON tblTeilpopulation.TPopApBerichtRelevant = DomainTPopApBerichtRelevant.DomainCode) ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN (tblTeilPopMassnBericht INNER JOIN DomainTPopMassnErfolgsbeurteilung ON tblTeilPopMassnBericht.TPopMassnBerErfolgsbeurteilung = DomainTPopMassnErfolgsbeurteilung.BeurteilId) ON tblTeilpopulation.TPopId = tblTeilPopMassnBericht.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopMassnBericht.TPopMassnBerJahr;

CREATE VIEW vAuswArtPopTPopMassn0 AS 
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Aktionsplan Bearbeitungsstand", tblPopulation.PopId, tblPopulation.PopNr, tblPopulation.PopName, tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopFlurname, tblTeilPopMassnahme.TPopMassnId, tblTeilPopMassnahme.TPopMassnJahr AS Jahr, DomainTPopMassnTyp.MassnTypTxt AS Massnahme, tblTeilPopMassnahme.TPopMassnTxt, tblTeilPopMassnahme.TPopMassnDatum, tblAdresse.AdrName AS TPopMassnBearb, tblTeilPopMassnahme.TPopMassnBemTxt, tblTeilPopMassnahme.TPopMassnPlan, tblTeilPopMassnahme.TPopMassnPlanBez, tblTeilPopMassnahme.TPopMassnFlaeche, tblTeilPopMassnahme.TPopMassnMarkierung, tblTeilPopMassnahme.TPopMassnAnsiedAnzTriebe, tblTeilPopMassnahme.TPopMassnAnsiedAnzPfl, tblTeilPopMassnahme.TPopMassnAnzPflanzstellen, tblTeilPopMassnahme.TPopMassnAnsiedWirtspfl, tblTeilPopMassnahme.TPopMassnAnsiedHerkunftPop, tblTeilPopMassnahme.TPopMassnAnsiedDatSamm, tblTeilPopMassnahme.TPopMassnAnsiedForm, tblTeilPopMassnahme.TPopMassnAnsiedPflanzanordnung
FROM ((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN ((tblTeilPopMassnahme LEFT JOIN DomainTPopMassnTyp ON tblTeilPopMassnahme.TPopMassnTyp = DomainTPopMassnTyp.MassnTypCode) LEFT JOIN tblAdresse ON tblTeilPopMassnahme.TPopMassnBearb = tblAdresse.AdrId) ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopMassnahme.TPopMassnJahr, DomainTPopMassnTyp.MassnTypTxt;

CREATE VIEW vAuswArtPopTPopMassnFuerAktArt0 AS 
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "Aktionsplan-Status", tblAktionsplan.ApJahr AS "Aktionsplan-Jahr", DomainApUmsetzung.DomainTxt AS "Aktionsplan-Umsetzung", tblPopulation.PopId, tblPopulation.PopNr AS "Population-Nr", tblPopulation.PopName AS "Population-Name", DomainPopHerkunft.HerkunftTxt AS "Population-Herkunft", tblPopulation.PopBekanntSeit AS "Population - bekannt seit", tblTeilpopulation.TPopId, tblTeilpopulation.TPopNr AS "Teilpopulation-Nr", tblTeilpopulation.TPopGemeinde AS "Teilpopulation-Gemeinde", tblTeilpopulation.TPopFlurname AS "Teilpopulation-Flurname", tblTeilpopulation.TPopXKoord AS "Teilpopulation-X-Koodinate", tblTeilpopulation.TPopYKoord AS "Teilpopulation-Y-Koordinate", tblTeilpopulation.TPopRadius AS "Teilpopulation-Radius", tblTeilpopulation.TPopHoehe AS "Teilpopulation-Höhe", tblTeilpopulation.TPopBeschr AS "Teilpopulation-Beschreibung", tblTeilpopulation.TPopKatNr AS "Teilpopulation-Kataster-Nr", tblAdresse_1.AdrName AS "Teilpopulation-Verantwortlich", DomainPopHerkunft_1.HerkunftTxt AS "Teilpopulation-Herkunft", tblTeilpopulation.TPopHerkunftUnklar AS "Teilpopulation - Herkunft unklar", tblTeilpopulation.TPopHerkunftUnklarBegruendung AS "Teilpopulation - Herkunft unklar Begründung", DomainTPopApBerichtRelevant.DomainTxt AS "Teilpopulation - Für Bericht relevant", tblTeilpopulation.TPopBekanntSeit AS "Teilpopulation - bekannt seit", tblTeilpopulation.TPopEigen AS "Teilpopulation-Eigentümer", tblTeilpopulation.TPopKontakt AS "Teilpopulation-Kontakt", tblTeilpopulation.TPopNutzungszone AS "Teilpopulation-Nutzungszone", tblTeilpopulation.TPopBewirtschafterIn AS "Teilpopulation-Bewirtschafter", tblTeilpopulation.TPopBewirtschaftung AS "Teilpopulation-Bewirtschaftung", tblTeilpopulation.TPopTxt AS "Teilpopulation-Bemerkungen", tblTeilPopMassnahme.TPopMassnId, DomainTPopMassnTyp.MassnTypTxt AS "Massnahme-Typ", tblTeilPopMassnahme.TPopMassnTxt AS "Massnahme-Beschreibung", tblTeilPopMassnahme.TPopMassnDatum AS "Massnahme-Datum", tblAdresse.AdrName AS "Massnahme-BearbeiterIn", tblTeilPopMassnahme.TPopMassnBemTxt AS "Massnahme-Bemerkungen", tblTeilPopMassnahme.TPopMassnPlan AS "Massnahme-Plan", tblTeilPopMassnahme.TPopMassnPlanBez AS "Massnahme-Planbezeichnung", tblTeilPopMassnahme.TPopMassnFlaeche AS "Massnahme-Fläche", tblTeilPopMassnahme.TPopMassnMarkierung AS "Massnahme-Markierung", tblTeilPopMassnahme.TPopMassnAnsiedAnzTriebe AS "Massnahme - Ansiedlung Anzahl Triebe", tblTeilPopMassnahme.TPopMassnAnsiedAnzPfl AS "Massnahme - Ansiedlung Anzahl Pflanzen", tblTeilPopMassnahme.TPopMassnAnzPflanzstellen AS "Massnahme - Ansiedlung Anzahl Pflanzstellen", tblTeilPopMassnahme.TPopMassnAnsiedWirtspfl AS "Massnahme - Ansiedlung Wirtspflanzen", tblTeilPopMassnahme.TPopMassnAnsiedHerkunftPop AS "Massnahme - Ansiedlung Herkunftspopulation", tblTeilPopMassnahme.TPopMassnAnsiedDatSamm AS "Massnahme - Ansiedlung Sammeldatum", tblTeilPopMassnahme.TPopMassnAnsiedForm AS "Massnahme - Ansiedlung Form", tblTeilPopMassnahme.TPopMassnAnsiedPflanzanordnung AS "Massnahme - Ansiedlung Pflanzordnung"
FROM (ArtenDb_tblFloraSisf INNER JOIN ((tblAktionsplan LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (((tblPopulation LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) INNER JOIN (((tblTeilpopulation LEFT JOIN tblAdresse AS tblAdresse_1 ON tblTeilpopulation.TPopVerantw = tblAdresse_1.AdrId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId) LEFT JOIN DomainTPopApBerichtRelevant ON tblTeilpopulation.TPopApBerichtRelevant = DomainTPopApBerichtRelevant.DomainCode) ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN ((tblTeilPopMassnahme LEFT JOIN DomainTPopMassnTyp ON tblTeilPopMassnahme.TPopMassnTyp = DomainTPopMassnTyp.MassnTypCode) LEFT JOIN tblAdresse ON tblTeilPopMassnahme.TPopMassnBearb = tblAdresse.AdrId) ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, DomainTPopMassnTyp.MassnTypTxt;

CREATE VIEW vAuswFlurnameArtKontrolle AS
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblTeilpopulation.TPopId, tblTeilPopFeldkontrolle.TPopKontrId, tblTeilpopulation.TPopGemeinde AS Gemeinde, tblTeilpopulation.TPopFlurname AS "Flurname aus Teilpopulation", DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", ArtenDb_tblFloraSisf.Name AS Art, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopFeldkontrolle.TPopKontrJahr AS Jahr, tblTeilPopFeldkontrolle.TPopKontrTyp AS Kontrolltyp, tblTeilPopFeldkontrolle.TPopKontrDatum, tblAdresse.AdrName AS TPopKontrBearb, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit1, DomainTPopKontrMethode.BeurteilTxt AS TPopKontrMethode1, tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS TPopKontrZaehleinheit2, DomainTPopKontrMethode_1.BeurteilTxt AS TPopKontrMethode2, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS TPopKontrZaehleinheit3, DomainTPopKontrMethode_2.BeurteilTxt AS TPopKontrMethode3, tblTeilPopFeldkontrolle.TPopKontrAnz3, tblTeilPopFeldkontrolle.TPopKontrJungpfl, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, tblTeilPopFeldkontrolle.TPopKontrUeberleb, tblTeilPopFeldkontrolle.TPopKontrEntwicklung, tblTeilPopFeldkontrolle.TPopKontrUrsach, tblTeilPopFeldkontrolle.TPopKontrUrteil, tblTeilPopFeldkontrolle.TPopKontrAendUms, tblTeilPopFeldkontrolle.TPopKontrAendKontr, tblTeilPopFeldkontrolle.TPopKontrTxt, tblTeilPopFeldkontrolle.TPopKontrLeb, tblTeilPopFeldkontrolle.TPopKontrFlaeche, tblTeilPopFeldkontrolle.TPopKontrLebUmg, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht, tblTeilPopFeldkontrolle.TPopKontrBodenTyp, tblTeilPopFeldkontrolle.TPopKontrBodenAbtrag, tblTeilPopFeldkontrolle.TPopKontrWasserhaushalt, tblTeilPopFeldkontrolle.TPopKontrHandlungsbedarf, tblTeilPopFeldkontrolle.TPopKontrUebFlaeche, tblTeilPopFeldkontrolle.TPopKontrPlan, tblTeilPopFeldkontrolle.TPopKontrVeg, tblTeilPopFeldkontrolle.TPopKontrNaBo, tblTeilPopFeldkontrolle.TPopKontrUebPfl, tblTeilPopFeldkontrolle.TPopKontrJungPflJN, tblTeilPopFeldkontrolle.TPopKontrVegHoeMax, tblTeilPopFeldkontrolle.TPopKontrVegHoeMit, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung
FROM (((((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode
WHERE (((tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Ziel"))
ORDER BY tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrTyp;

CREATE VIEW vAuswLetzteAnzProTPopAktArt0 AS
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblTeilpopulation.TPopId, tblTeilPopFeldkontrolle.TPopKontrId, ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblPopulation.PopNr, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopulation.PopName, tblTeilpopulation.TPopNr, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft, tblTeilpopulation.TPopBekanntSeit, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, vAuswLetzteAnzAnz.Zaehleinheit, vAuswLetzteAnzAnz.Anzahl AS Anzahl, vAuswLetzteAnzAnz.TPopKontrjahr, tblAdresse.AdrName AS BearbeiterIn
FROM DomainPopHerkunft AS DomainPopHerkunft_1 RIGHT JOIN (tblAdresse RIGHT JOIN (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ((tblPopulation LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) INNER JOIN (tblTeilpopulation INNER JOIN (vAuswLetzteAnzAnz INNER JOIN tblTeilPopFeldkontrolle ON vAuswLetzteAnzAnz.TPopKontrId = tblTeilPopFeldkontrolle.TPopKontrId) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) ON tblAdresse.AdrId = tblTeilPopFeldkontrolle.TPopKontrBearb) ON DomainPopHerkunft_1.HerkunftId = tblTeilpopulation.TPopHerkunft
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

CREATE VIEW vAuswLetzteAnzProTPopAktArtAlleTPop AS
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblTeilpopulation.TPopId, tblTeilPopFeldkontrolle.TPopKontrId, ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblPopulation.PopNr, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopulation.PopName, tblTeilpopulation.TPopNr, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft, tblTeilpopulation.TPopBekanntSeit, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, vAuswLetzteAnzAnz.Zaehleinheit, vAuswLetzteAnzAnz.Anzahl, vAuswLetzteAnzAnz.TPopKontrjahr, vAuswLetzteAnzAnz.TPopKontrTxt, tblAdresse.AdrName AS BearbeiterIn
FROM DomainPopHerkunft AS DomainPopHerkunft_1 RIGHT JOIN (tblAdresse RIGHT JOIN (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ((tblPopulation LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) INNER JOIN (tblTeilpopulation LEFT JOIN (vAuswLetzteAnzAnz INNER JOIN tblTeilPopFeldkontrolle ON vAuswLetzteAnzAnz.TPopKontrId = tblTeilPopFeldkontrolle.TPopKontrId) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) ON tblAdresse.AdrId = tblTeilPopFeldkontrolle.TPopKontrBearb) ON DomainPopHerkunft_1.HerkunftId = tblTeilpopulation.TPopHerkunft
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

bisher:
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblTeilpopulation.TPopId, tblTeilPopFeldkontrolle.TPopKontrId, ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", tblPopulation.PopNr, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopulation.PopName, tblTeilpopulation.TPopNr, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft, tblTeilpopulation.TPopBekanntSeit, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, vAuswLetzteAnzAnz.Zaehleinheit, vAuswLetzteAnzAnz.Anzahl, vAuswLetzteAnzAnz.TPopKontrjahr, tblAdresse.AdrName AS BearbeiterIn
FROM DomainPopHerkunft AS DomainPopHerkunft_1 RIGHT JOIN (tblAdresse RIGHT JOIN (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ((tblPopulation LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) INNER JOIN (tblTeilpopulation INNER JOIN (vAuswLetzteAnzAnz RIGHT JOIN tblTeilPopFeldkontrolle ON vAuswLetzteAnzAnz.TPopKontrId = tblTeilPopFeldkontrolle.TPopKontrId) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) ON tblAdresse.AdrId = tblTeilPopFeldkontrolle.TPopKontrBearb) ON DomainPopHerkunft_1.HerkunftId = tblTeilpopulation.TPopHerkunft
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;



CREATE VIEW vJbA1rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblAktionsplan INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblPopulation.PopHerkunft)=1 Or (tblPopulation.PopHerkunft)=4 Or (tblPopulation.PopHerkunft)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbA2rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblAktionsplan INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblPopulation.PopHerkunft)=1 Or (tblPopulation.PopHerkunft)=4) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbA3rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblAktionsplan INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblPopulation.PopHerkunft)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbA1rTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblAktionsplan INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilpopulation.TPopHerkunft)=1 Or (tblTeilpopulation.TPopHerkunft)=4 Or (tblTeilpopulation.TPopHerkunft)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbA2rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblAktionsplan INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilpopulation.TPopHerkunft)=1 Or (tblTeilpopulation.TPopHerkunft)=4) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbA3rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblAktionsplan INNER JOIN (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
WHERE (((tblTeilpopulation.TPopHerkunft)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbB1rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblKonstanten, (tblPopulation INNER JOIN tblPopBericht ON tblPopulation.PopId = tblPopBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (tblTeilpopulation.TPopApBerichtRelevant=1) AND (tblPopBericht.PopBerJahr<=tblKonstanten.JBerJahr)
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbB2rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM ((vLetzterPopBericht INNER JOIN tblPopulation ON vLetzterPopBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopBericht ON (tblPopulation.PopId = tblPopBericht.PopId) AND (vLetzterPopBericht.PopId = tblPopBericht.PopId) AND (vLetzterPopBericht.MaxvonPopBerJahr = tblPopBericht.PopBerJahr)) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (tblPopBericht.PopBerEntwicklung=3) AND (tblTeilpopulation.TPopApBerichtRelevant=1)
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbB3rPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM ((vLetzterPopBericht INNER JOIN tblPopulation ON vLetzterPopBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopBericht ON (tblPopulation.PopId = tblPopBericht.PopId) AND (vLetzterPopBericht.PopId = tblPopBericht.PopId) AND (vLetzterPopBericht.MaxvonPopBerJahr = tblPopBericht.PopBerJahr)) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopBericht.PopBerEntwicklung)=2) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbB4rPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM ((vLetzterPopBericht INNER JOIN tblPopulation ON vLetzterPopBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopBericht ON (tblPopulation.PopId = tblPopBericht.PopId) AND (vLetzterPopBericht.PopId = tblPopBericht.PopId) AND (vLetzterPopBericht.MaxvonPopBerJahr = tblPopBericht.PopBerJahr)) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopBericht.PopBerEntwicklung)=1) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbB5rPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM ((vLetzterPopBericht INNER JOIN tblPopulation ON vLetzterPopBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopBericht ON (tblPopulation.PopId = tblPopBericht.PopId) AND (vLetzterPopBericht.PopId = tblPopBericht.PopId) AND (vLetzterPopBericht.MaxvonPopBerJahr = tblPopBericht.PopBerJahr)) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopBericht.PopBerEntwicklung)=4 Or (tblPopBericht.PopBerEntwicklung)=9) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbB6rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM ((vLetzterPopBericht INNER JOIN tblPopulation ON vLetzterPopBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopBericht ON (tblPopulation.PopId = tblPopBericht.PopId) AND (vLetzterPopBericht.PopId = tblPopBericht.PopId) AND (vLetzterPopBericht.MaxvonPopBerJahr = tblPopBericht.PopBerJahr)) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopBericht.PopBerEntwicklung)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbB1rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilPopBericht.TPopId
FROM tblKonstanten, tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN tblTeilPopBericht ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (tblTeilpopulation.TPopApBerichtRelevant=1) AND (tblTeilPopBericht.TPopBerJahr<=tblKonstanten.JBerJahr)
GROUP BY tblPopulation.ApArtId, tblTeilPopBericht.TPopId;

CREATE VIEW vJbB2rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN (tblPopulation INNER JOIN vLetzterTPopBericht ON tblPopulation.ApArtId = vLetzterTPopBericht.ApArtId) ON (tblTeilPopBericht.TPopId = vLetzterTPopBericht.TPopId) AND (tblTeilPopBericht.TPopBerJahr = vLetzterTPopBericht.MaxvonTPopBerJahr)) ON (tblTeilpopulation.PopId = tblPopulation.PopId) AND (tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId)
WHERE (tblTeilPopBericht.TPopBerEntwicklung=3) AND (tblTeilpopulation.TPopApBerichtRelevant=1)
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbB3rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN (tblPopulation INNER JOIN vLetzterTPopBericht ON tblPopulation.ApArtId = vLetzterTPopBericht.ApArtId) ON (tblTeilPopBericht.TPopId = vLetzterTPopBericht.TPopId) AND (tblTeilPopBericht.TPopBerJahr = vLetzterTPopBericht.MaxvonTPopBerJahr)) ON (tblTeilpopulation.PopId = tblPopulation.PopId) AND (tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId)
WHERE (((tblTeilPopBericht.TPopBerEntwicklung)=2) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbB4rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN (tblPopulation INNER JOIN vLetzterTPopBericht ON tblPopulation.ApArtId = vLetzterTPopBericht.ApArtId) ON (tblTeilPopBericht.TPopId = vLetzterTPopBericht.TPopId) AND (tblTeilPopBericht.TPopBerJahr = vLetzterTPopBericht.MaxvonTPopBerJahr)) ON (tblTeilpopulation.PopId = tblPopulation.PopId) AND (tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId)
WHERE (((tblTeilPopBericht.TPopBerEntwicklung)=1) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbB5rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN (tblPopulation INNER JOIN vLetzterTPopBericht ON tblPopulation.ApArtId = vLetzterTPopBericht.ApArtId) ON (tblTeilPopBericht.TPopId = vLetzterTPopBericht.TPopId) AND (tblTeilPopBericht.TPopBerJahr = vLetzterTPopBericht.MaxvonTPopBerJahr)) ON (tblTeilpopulation.PopId = tblPopulation.PopId) AND (tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId)
WHERE (((tblTeilPopBericht.TPopBerEntwicklung)=4 Or (tblTeilPopBericht.TPopBerEntwicklung)=9) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbB6rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN (tblPopulation INNER JOIN vLetzterTPopBericht ON tblPopulation.ApArtId = vLetzterTPopBericht.ApArtId) ON (tblTeilPopBericht.TPopId = vLetzterTPopBericht.TPopId) AND (tblTeilPopBericht.TPopBerJahr = vLetzterTPopBericht.MaxvonTPopBerJahr)) ON (tblTeilpopulation.PopId = tblPopulation.PopId) AND (tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId)
WHERE (((tblTeilPopBericht.TPopBerEntwicklung)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbC1rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblKonstanten, (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId
WHERE (tblTeilPopMassnahme.TPopMassnJahr<=tblKonstanten.JBerJahr) AND (tblTeilpopulation.TPopApBerichtRelevant=1)
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbC3rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (vLetzterPopMassnBericht INNER JOIN tblPopulation ON vLetzterPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopMassnBericht ON (tblPopulation.PopId = tblPopMassnBericht.PopId) AND (vLetzterPopMassnBericht.MaxvonPopMassnBerJahr = tblPopMassnBericht.PopMassnBerJahr) AND (vLetzterPopMassnBericht.PopId = tblPopMassnBericht.PopId)
WHERE tblPopMassnBericht.PopMassnBerErfolgsbeurteilung=1
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbC4rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (vLetzterPopMassnBericht INNER JOIN tblPopulation ON vLetzterPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopMassnBericht ON (tblPopulation.PopId = tblPopMassnBericht.PopId) AND (vLetzterPopMassnBericht.MaxvonPopMassnBerJahr = tblPopMassnBericht.PopMassnBerJahr) AND (vLetzterPopMassnBericht.PopId = tblPopMassnBericht.PopId)
WHERE (((tblPopMassnBericht.PopMassnBerErfolgsbeurteilung)=2))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbC5rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (vLetzterPopMassnBericht INNER JOIN tblPopulation ON vLetzterPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopMassnBericht ON (tblPopulation.PopId = tblPopMassnBericht.PopId) AND (vLetzterPopMassnBericht.MaxvonPopMassnBerJahr = tblPopMassnBericht.PopMassnBerJahr) AND (vLetzterPopMassnBericht.PopId = tblPopMassnBericht.PopId)
WHERE tblPopMassnBericht.PopMassnBerErfolgsbeurteilung=3
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbC6rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (vLetzterPopMassnBericht INNER JOIN tblPopulation ON vLetzterPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopMassnBericht ON (tblPopulation.PopId = tblPopMassnBericht.PopId) AND (vLetzterPopMassnBericht.PopId = tblPopMassnBericht.PopId) AND (vLetzterPopMassnBericht.MaxvonPopMassnBerJahr = tblPopMassnBericht.PopMassnBerJahr)
WHERE tblPopMassnBericht.PopMassnBerErfolgsbeurteilung=4
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbC7rPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (vLetzterPopMassnBericht INNER JOIN tblPopulation ON vLetzterPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopMassnBericht ON (tblPopulation.PopId = tblPopMassnBericht.PopId) AND (vLetzterPopMassnBericht.PopId = tblPopMassnBericht.PopId) AND (vLetzterPopMassnBericht.MaxvonPopMassnBerJahr = tblPopMassnBericht.PopMassnBerJahr)
WHERE tblPopMassnBericht.PopMassnBerErfolgsbeurteilung=5
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbC1rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblKonstanten, (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId
WHERE (tblTeilPopMassnahme.TPopMassnJahr<=tblKonstanten.JBerJahr) AND (tblTeilpopulation.TPopApBerichtRelevant=1)
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbC3rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM ((vLetzterTPopMassnBericht INNER JOIN tblPopulation ON vLetzterTPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilPopMassnBericht ON (vLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = tblTeilPopMassnBericht.TPopMassnBerJahr) AND (vLetzterTPopMassnBericht.TPopId = tblTeilPopMassnBericht.TPopId)) INNER JOIN tblTeilpopulation ON (tblTeilPopMassnBericht.TPopId = tblTeilpopulation.TPopId) AND (tblPopulation.PopId = tblTeilpopulation.PopId)
WHERE tblTeilPopMassnBericht.TPopMassnBerErfolgsbeurteilung=1
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbC4rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM ((vLetzterTPopMassnBericht INNER JOIN tblPopulation ON vLetzterTPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilPopMassnBericht ON (vLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = tblTeilPopMassnBericht.TPopMassnBerJahr) AND (vLetzterTPopMassnBericht.TPopId = tblTeilPopMassnBericht.TPopId)) INNER JOIN tblTeilpopulation ON (tblTeilPopMassnBericht.TPopId = tblTeilpopulation.TPopId) AND (tblPopulation.PopId = tblTeilpopulation.PopId)
WHERE (tblTeilPopMassnBericht.TPopMassnBerErfolgsbeurteilung=2)
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbC5rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM ((vLetzterTPopMassnBericht INNER JOIN tblPopulation ON vLetzterTPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilPopMassnBericht ON (vLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = tblTeilPopMassnBericht.TPopMassnBerJahr) AND (vLetzterTPopMassnBericht.TPopId = tblTeilPopMassnBericht.TPopId)) INNER JOIN tblTeilpopulation ON (tblTeilPopMassnBericht.TPopId = tblTeilpopulation.TPopId) AND (tblPopulation.PopId = tblTeilpopulation.PopId)
WHERE tblTeilPopMassnBericht.TPopMassnBerErfolgsbeurteilung=3
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbC6rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM ((vLetzterTPopMassnBericht INNER JOIN tblPopulation ON vLetzterTPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilPopMassnBericht ON (vLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = tblTeilPopMassnBericht.TPopMassnBerJahr) AND (vLetzterTPopMassnBericht.TPopId = tblTeilPopMassnBericht.TPopId)) INNER JOIN tblTeilpopulation ON (tblTeilPopMassnBericht.TPopId = tblTeilpopulation.TPopId) AND (tblPopulation.PopId = tblTeilpopulation.PopId)
WHERE tblTeilPopMassnBericht.TPopMassnBerErfolgsbeurteilung=4
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbC7rTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM ((vLetzterTPopMassnBericht INNER JOIN tblPopulation ON vLetzterTPopMassnBericht.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilPopMassnBericht ON (vLetzterTPopMassnBericht.TPopId = tblTeilPopMassnBericht.TPopId) AND (vLetzterTPopMassnBericht.MaxvonTPopMassnBerJahr = tblTeilPopMassnBericht.TPopMassnBerJahr)) INNER JOIN tblTeilpopulation ON (tblTeilPopMassnBericht.TPopId = tblTeilpopulation.TPopId) AND (tblPopulation.PopId = tblTeilpopulation.PopId)
WHERE tblTeilPopMassnBericht.TPopMassnBerErfolgsbeurteilung=5
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbA1lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbA2lPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopulation.PopHerkunft)=1) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbA3lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopulation.PopHerkunft)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbA4lPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopulation.PopHerkunft)=2) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbA5lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopulation.PopHerkunft)=1198167213) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbA6lPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopulation.PopHerkunft)=6) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbA7lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopulation.PopHerkunft)=9) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbA8lPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopulation.PopHerkunft)=4 Or (tblPopulation.PopHerkunft)=1200498803) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbA9lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblPopulation.PopHerkunft)=7) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbA1lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbA2lTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopHerkunft)=1) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbA3lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopHerkunft)=8) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbA4lTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopHerkunft)=2) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbA5lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopHerkunft)=1198167213) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbA6lTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopHerkunft)=6) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbA7lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopHerkunft)=9) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbA8lTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopHerkunft)=4 Or (tblTeilpopulation.TPopHerkunft)=1200498803) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbA9lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopHerkunft)=7) AND ((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbB1lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (tblPopulation INNER JOIN (tblPopBericht INNER JOIN tblKonstanten ON tblPopBericht.PopBerJahr = tblKonstanten.JBerJahr) ON tblPopulation.PopId = tblPopBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE tblTeilpopulation.TPopApBerichtRelevant=1
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbB2lPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (tblPopulation INNER JOIN (tblPopBericht INNER JOIN tblKonstanten ON tblPopBericht.PopBerJahr = tblKonstanten.JBerJahr) ON tblPopulation.PopId = tblPopBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (tblPopBericht.PopBerEntwicklung=3) AND (tblTeilpopulation.TPopApBerichtRelevant=1)
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbB3lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (tblPopulation INNER JOIN (tblPopBericht INNER JOIN tblKonstanten ON tblPopBericht.PopBerJahr = tblKonstanten.JBerJahr) ON tblPopulation.PopId = tblPopBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (tblPopBericht.PopBerEntwicklung=2) AND (tblTeilpopulation.TPopApBerichtRelevant=1)
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbB4lPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (tblPopulation INNER JOIN (tblPopBericht INNER JOIN tblKonstanten ON tblPopBericht.PopBerJahr = tblKonstanten.JBerJahr) ON tblPopulation.PopId = tblPopBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (tblPopBericht.PopBerEntwicklung=1) AND (tblTeilpopulation.TPopApBerichtRelevant=1)
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbB5lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (tblPopulation INNER JOIN (tblPopBericht INNER JOIN tblKonstanten ON tblPopBericht.PopBerJahr = tblKonstanten.JBerJahr) ON tblPopulation.PopId = tblPopBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (tblPopBericht.PopBerEntwicklung=4 Or tblPopBericht.PopBerEntwicklung=9) AND (tblTeilpopulation.TPopApBerichtRelevant=1)
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbB6lPop AS
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (tblPopulation INNER JOIN (tblPopBericht INNER JOIN tblKonstanten ON tblPopBericht.PopBerJahr = tblKonstanten.JBerJahr) ON tblPopulation.PopId = tblPopBericht.PopId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (tblPopBericht.PopBerEntwicklung=8) AND (tblTeilpopulation.TPopApBerichtRelevant=1)
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbB7lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbB1lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN tblKonstanten ON tblTeilPopBericht.TPopBerJahr = tblKonstanten.JBerJahr) ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE tblTeilpopulation.TPopApBerichtRelevant=1
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbB2lTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN tblKonstanten ON tblTeilPopBericht.TPopBerJahr = tblKonstanten.JBerJahr) ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (tblTeilPopBericht.TPopBerEntwicklung=3) AND (tblTeilpopulation.TPopApBerichtRelevant=1)
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbB3lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN tblKonstanten ON tblTeilPopBericht.TPopBerJahr = tblKonstanten.JBerJahr) ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (tblTeilPopBericht.TPopBerEntwicklung=2) AND (tblTeilpopulation.TPopApBerichtRelevant=1)
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbB4lTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN tblKonstanten ON tblTeilPopBericht.TPopBerJahr = tblKonstanten.JBerJahr) ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (tblTeilPopBericht.TPopBerEntwicklung=1) AND (tblTeilpopulation.TPopApBerichtRelevant=1)
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbB5lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN tblKonstanten ON tblTeilPopBericht.TPopBerJahr = tblKonstanten.JBerJahr) ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (tblTeilPopBericht.TPopBerEntwicklung=4 Or tblTeilPopBericht.TPopBerEntwicklung=9) AND (tblTeilpopulation.TPopApBerichtRelevant=1)
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbB6lTPop AS 
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN (tblTeilPopBericht INNER JOIN tblKonstanten ON tblTeilPopBericht.TPopBerJahr = tblKonstanten.JBerJahr) ON tblTeilpopulation.TPopId = tblTeilPopBericht.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (tblTeilPopBericht.TPopBerEntwicklung=8) AND (tblTeilpopulation.TPopApBerichtRelevant=1)
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbB7lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId
WHERE (((tblTeilpopulation.TPopApBerichtRelevant)=1))
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vJbC1lPop AS 
SELECT tblPopulation.ApArtId, tblPopulation.PopId
FROM (tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN (tblTeilPopMassnahme INNER JOIN tblKonstanten ON tblTeilPopMassnahme.TPopMassnJahr = tblKonstanten.JBerJahr) ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId
WHERE tblTeilpopulation.TPopApBerichtRelevant=1
GROUP BY tblPopulation.ApArtId, tblPopulation.PopId;

CREATE VIEW vJbC1lTPop AS
SELECT tblPopulation.ApArtId, tblTeilpopulation.TPopId
FROM ((tblPopulation INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopMassnahme ON tblTeilpopulation.TPopId = tblTeilPopMassnahme.TPopId) INNER JOIN tblKonstanten ON tblTeilPopMassnahme.TPopMassnJahr = tblKonstanten.JBerJahr
WHERE tblTeilpopulation.TPopApBerichtRelevant=1
GROUP BY tblPopulation.ApArtId, tblTeilpopulation.TPopId;

CREATE VIEW vAuswAnzProTPopAngezArtBestJahr0 AS 
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblTeilpopulation.TPopId, tblTeilPopFeldkontrolle.TPopKontrId, ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft, tblTeilPopFeldkontrolle.TPopKontrTyp, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrDatum, tblAdresse.AdrName AS TPopKontrBearb, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit1, DomainTPopKontrMethode.BeurteilTxt AS TPopKontrMethode1, tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS TPopKontrZaehleinheit2, DomainTPopKontrMethode_1.BeurteilTxt AS TPopKontrMethode2, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS TPopKontrZaehleinheit3, DomainTPopKontrMethode_2.BeurteilTxt AS TPopKontrMethode3, tblTeilPopFeldkontrolle.TPopKontrAnz3, tblTeilPopFeldkontrolle.TPopKontrJungpfl, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, tblTeilPopFeldkontrolle.TPopKontrUeberleb, DomainTPopEntwicklung.EntwicklungTxt AS TPopKontrEntwicklung, tblTeilPopFeldkontrolle.TPopKontrUrsach, tblTeilPopFeldkontrolle.TPopKontrUrteil, tblTeilPopFeldkontrolle.TPopKontrAendUms, tblTeilPopFeldkontrolle.TPopKontrAendKontr, tblTeilPopFeldkontrolle.TPopKontrTxt, tblTeilPopFeldkontrolle.TPopKontrLeb, tblTeilPopFeldkontrolle.TPopKontrFlaeche, tblTeilPopFeldkontrolle.TPopKontrLebUmg, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht, tblTeilPopFeldkontrolle.TPopKontrBodenTyp, tblTeilPopFeldkontrolle.TPopKontrBodenAbtrag, tblTeilPopFeldkontrolle.TPopKontrWasserhaushalt, tblTeilPopFeldkontrolle.TPopKontrHandlungsbedarf, tblTeilPopFeldkontrolle.TPopKontrUebFlaeche, tblTeilPopFeldkontrolle.TPopKontrPlan, tblTeilPopFeldkontrolle.TPopKontrVeg, tblTeilPopFeldkontrolle.TPopKontrNaBo, tblTeilPopFeldkontrolle.TPopKontrUebPfl, tblTeilPopFeldkontrolle.TPopKontrJungPflJN, tblTeilPopFeldkontrolle.TPopKontrVegHoeMax, tblTeilPopFeldkontrolle.TPopKontrVegHoeMit, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung, tblTeilPopFeldkontrolle.TPopKontrMutDat
FROM ((((((((((ArtenDb_tblFloraSisf INNER JOIN (((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainTPopEntwicklung ON tblTeilPopFeldkontrolle.TPopKontrEntwicklung = DomainTPopEntwicklung.EntwicklungCode;

CREATE VIEW vAuswPopBerAngezArtBestJahr0 AS
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblPopBericht.PopBerId, ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopBericht.PopBerJahr, DomainPopEntwicklung.EntwicklungTxt AS PopBerEntwicklung, tblPopBericht.PopBerTxt
FROM ((ArtenDb_tblFloraSisf INNER JOIN ((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblPopBericht ON tblPopulation.PopId = tblPopBericht.PopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainPopEntwicklung ON tblPopBericht.PopBerEntwicklung = DomainPopEntwicklung.EntwicklungId;
 
CREATE VIEW vApZiele AS 
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblAdresse.AdrName AS "AP verantwortlich", tblZiel.ZielId AS "Ziel Id", tblZiel.ZielJahr AS "Ziel Jahr", DomainZielTyp.ZieltypTxt AS "Ziel Typ", tblZiel.ZielBezeichnung AS "Ziel Beschreibung"
FROM (((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN tblAdresse ON tblAktionsplan.ApBearb = tblAdresse.AdrId) INNER JOIN tblZiel ON tblAktionsplan.ApArtId = tblZiel.ApArtId) LEFT JOIN DomainZielTyp ON tblZiel.ZielTyp = DomainZielTyp.ZieltypId
WHERE tblZiel.ZielTyp=1 Or tblZiel.ZielTyp=2 Or tblZiel.ZielTyp=1170775556
ORDER BY ArtenDb_tblFloraSisf.Name, tblZiel.ZielJahr, DomainZielTyp.ZieltypTxt, tblZiel.ZielTyp;

CREATE VIEW vApZielBer AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Art, DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblAdresse.AdrName AS "AP verantwortlich", tblZiel.ZielId AS "Ziel Id", tblZiel.ZielJahr AS "Ziel Jahr", DomainZielTyp.ZieltypTxt AS "Ziel Typ", tblZiel.ZielBezeichnung AS "Ziel Beschreibung", tblZielBericht.ZielBerId AS "ZielBer Id", tblZielBericht.ZielBerJahr AS "ZielBer Jahr", tblZielBericht.ZielBerErreichung AS "ZielBer Erreichung", tblZielBericht.ZielBerTxt AS "ZielBer Bemerkungen", tblZielBericht.MutWann AS "ZielBer MutWann", tblZielBericht.MutWer AS "ZielBer MutWer"
FROM ((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN tblAdresse ON tblAktionsplan.ApBearb = tblAdresse.AdrId) INNER JOIN tblZiel ON tblAktionsplan.ApArtId = tblZiel.ApArtId) LEFT JOIN DomainZielTyp ON tblZiel.ZielTyp = DomainZielTyp.ZieltypId) INNER JOIN tblZielBericht ON tblZiel.ZielId = tblZielBericht.ZielId
WHERE tblZiel.ZielTyp=1 Or tblZiel.ZielTyp=2 Or tblZiel.ZielTyp=1170775556
ORDER BY ArtenDb_tblFloraSisf.Name, tblZiel.ZielJahr, DomainZielTyp.ZieltypTxt, tblZiel.ZielTyp, tblZielBericht.ZielBerJahr;

CREATE VIEW vBerTPopFuerAngezeigteArt0 AS
SELECT tblAktionsplan.ApArtId, tblPopulation.PopId, tblTeilpopulation.TPopId, ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS ApStatus, tblAktionsplan.ApJahr, DomainApUmsetzung.DomainTxt AS ApUmsetzung, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopBekanntSeit, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft, tblTeilpopulation.TPopApBerichtRelevant
FROM ((((ArtenDb_tblFloraSisf INNER JOIN ((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId;

CREATE VIEW vAuswTPopInUmgebung00 AS 
SELECT ArtenDb_tblFloraSisf.Name, tblAktionsplan.ApArtId, tblAktionsplan.ApStatus, tblPopulation.PopNr, tblPopulation.PopHerkunft, tblPopulation.PopName, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopHerkunft, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblKonstanten.XKoord, tblKonstanten.YKoord, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, SQRT((XKoord-TPopXKoord)*(XKoord-TPopXKoord)+(YKoord-TPopYKoord)*(YKoord-TPopYKoord)) AS "DistanzZurXYKoord"
FROM tblKonstanten, ArtenDb_tblFloraSisf INNER JOIN ((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId
WHERE (((tblTeilpopulation.TPopXKoord) Is Not Null) AND ((tblTeilpopulation.TPopYKoord) Is Not Null) AND ((SQRT((XKoord-TPopXKoord)*(XKoord-TPopXKoord)+(YKoord-TPopYKoord)*(YKoord-TPopYKoord)))<=tblKonstanten.Distanz))
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

CREATE VIEW vAuswTPopInUmgebung0 AS
SELECT vAuswTPopInUmgebung00.Name, vAuswTPopInUmgebung00.ApArtId, DomainApBearbeitungsstand.DomainTxt AS ApStatus, vAuswTPopInUmgebung00.PopNr, vAuswTPopInUmgebung00.PopName, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, vAuswTPopInUmgebung00.TPopNr, vAuswTPopInUmgebung00.TPopGemeinde, vAuswTPopInUmgebung00.TPopFlurname, DomainPopHerkunft_1.HerkunftTxt AS TPopHerkunft, vAuswTPopInUmgebung00.XKoord, vAuswTPopInUmgebung00.YKoord, vAuswTPopInUmgebung00.TPopXKoord, vAuswTPopInUmgebung00.TPopYKoord, vAuswTPopInUmgebung00.DistanzZurXYKoord
FROM ((vAuswTPopInUmgebung00 LEFT JOIN DomainApBearbeitungsstand ON vAuswTPopInUmgebung00.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainPopHerkunft ON vAuswTPopInUmgebung00.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON vAuswTPopInUmgebung00.TPopHerkunft = DomainPopHerkunft_1.HerkunftId
ORDER BY vAuswTPopInUmgebung00.Name, vAuswTPopInUmgebung00.PopNr, vAuswTPopInUmgebung00.TPopNr;

CREATE VIEW vAuswKontrolleProBearbeiterBestJahr0 AS 
SELECT tblAdresse.AdrName AS BearbeiterIn, tblTeilpopulation.TPopGemeinde AS Gemeinde, tblTeilpopulation.TPopFlurname AS "Flurname aus Teilpopulation", DomainApBearbeitungsstand.DomainTxt AS "Bearbeitungsstand AP", ArtenDb_tblFloraSisf.Name AS Art, tblTeilpopulation.TPopNr, tblTeilPopFeldkontrolle.TPopKontrJahr AS Jahr, tblTeilPopFeldkontrolle.TPopKontrTyp AS Kontrolltyp, tblTeilPopFeldkontrolle.TPopKontrDatum, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit1, DomainTPopKontrMethode.BeurteilTxt AS TPopKontrMethode1, tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS TPopKontrZaehleinheit2, DomainTPopKontrMethode_1.BeurteilTxt AS TPopKontrMethode2, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS TPopKontrZaehleinheit3, DomainTPopKontrMethode_2.BeurteilTxt AS TPopKontrMethode3, tblTeilPopFeldkontrolle.TPopKontrAnz3, tblTeilPopFeldkontrolle.TPopKontrJungpfl, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, tblTeilPopFeldkontrolle.TPopKontrUeberleb, DomainTPopEntwicklung.EntwicklungTxt AS TPopKontrEntwicklung, tblTeilPopFeldkontrolle.TPopKontrUrsach, tblTeilPopFeldkontrolle.TPopKontrUrteil, tblTeilPopFeldkontrolle.TPopKontrAendUms, tblTeilPopFeldkontrolle.TPopKontrAendKontr, tblTeilPopFeldkontrolle.TPopKontrTxt, tblTeilPopFeldkontrolle.TPopKontrLeb, tblTeilPopFeldkontrolle.TPopKontrFlaeche, tblTeilPopFeldkontrolle.TPopKontrLebUmg, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht, tblTeilPopFeldkontrolle.TPopKontrBodenTyp, tblTeilPopFeldkontrolle.TPopKontrBodenAbtrag, tblTeilPopFeldkontrolle.TPopKontrWasserhaushalt, tblTeilPopFeldkontrolle.TPopKontrHandlungsbedarf, tblTeilPopFeldkontrolle.TPopKontrUebFlaeche, tblTeilPopFeldkontrolle.TPopKontrPlan, tblTeilPopFeldkontrolle.TPopKontrVeg, tblTeilPopFeldkontrolle.TPopKontrNaBo, tblTeilPopFeldkontrolle.TPopKontrUebPfl, tblTeilPopFeldkontrolle.TPopKontrJungPflJN, tblTeilPopFeldkontrolle.TPopKontrVegHoeMax, tblTeilPopFeldkontrolle.TPopKontrVegHoeMit, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung
FROM (((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN (((((((tblTeilPopFeldkontrolle LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainTPopEntwicklung ON tblTeilPopFeldkontrolle.TPopKontrEntwicklung = DomainTPopEntwicklung.EntwicklungCode
WHERE (((tblTeilPopFeldkontrolle.TPopKontrTyp) Not Like "Ziel"))
ORDER BY tblAdresse.AdrName, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, ArtenDb_tblFloraSisf.Name, tblTeilpopulation.TPopNr, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrTyp;

CREATE VIEW vAuswFreiwKontrAnzBestJahr01 AS 
SELECT ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS BearbeitungsstandAp, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrTyp, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS Zaehleinheit, tblTeilPopFeldkontrolle.TPopKontrAnz1 AS Anzahl
FROM (DomainApBearbeitungsstand INNER JOIN (ArtenDb_tblFloraSisf INNER JOIN (((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) ON DomainApBearbeitungsstand.DomainCode = tblAktionsplan.ApStatus) INNER JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode
WHERE (tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle");

CREATE VIEW vAuswFreiwKontrAnzBestJahr02 AS
SELECT ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS BearbeitungsstandAp, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrTyp, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS Zaehleinheit, tblTeilPopFeldkontrolle.TPopKontrAnz2 AS Anzahl
FROM (DomainApBearbeitungsstand INNER JOIN (ArtenDb_tblFloraSisf INNER JOIN (((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) ON DomainApBearbeitungsstand.DomainCode = tblAktionsplan.ApStatus) INNER JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit.ZaehleinheitCode
WHERE (tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle");

CREATE VIEW vAuswFreiwKontrAnzBestJahr03 AS 
SELECT ArtenDb_tblFloraSisf.Name, DomainApBearbeitungsstand.DomainTxt AS BearbeitungsstandAp, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrTyp, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS Zaehleinheit, tblTeilPopFeldkontrolle.TPopKontrAnz3 AS Anzahl
FROM (DomainApBearbeitungsstand INNER JOIN (ArtenDb_tblFloraSisf INNER JOIN (((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) ON DomainApBearbeitungsstand.DomainCode = tblAktionsplan.ApStatus) INNER JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit.ZaehleinheitCode
WHERE (((tblTeilPopFeldkontrolle.TPopKontrTyp)="Freiwilligen-Erfolgskontrolle"));

CREATE VIEW vAuswFreiwKontrAnzBestJahr00 AS
SELECT vAuswFreiwKontrAnzBestJahr01.Name, vAuswFreiwKontrAnzBestJahr01.BearbeitungsstandAp, vAuswFreiwKontrAnzBestJahr01.TPopKontrJahr, vAuswFreiwKontrAnzBestJahr01.TPopKontrTyp, vAuswFreiwKontrAnzBestJahr01.Zaehleinheit, vAuswFreiwKontrAnzBestJahr01.Anzahl FROM vAuswFreiwKontrAnzBestJahr01
UNION SELECT vAuswFreiwKontrAnzBestJahr02.Name, vAuswFreiwKontrAnzBestJahr02.BearbeitungsstandAp, vAuswFreiwKontrAnzBestJahr02.TPopKontrJahr, vAuswFreiwKontrAnzBestJahr02.TPopKontrTyp, vAuswFreiwKontrAnzBestJahr02.Zaehleinheit, vAuswFreiwKontrAnzBestJahr02.Anzahl FROM vAuswFreiwKontrAnzBestJahr02
UNION SELECT vAuswFreiwKontrAnzBestJahr03.Name, vAuswFreiwKontrAnzBestJahr03.BearbeitungsstandAp, vAuswFreiwKontrAnzBestJahr03.TPopKontrJahr, vAuswFreiwKontrAnzBestJahr03.TPopKontrTyp, vAuswFreiwKontrAnzBestJahr03.Zaehleinheit, vAuswFreiwKontrAnzBestJahr03.Anzahl FROM vAuswFreiwKontrAnzBestJahr03;

CREATE VIEW vAuswFreiwKontrAnzBestJahrBearb0 AS
select tblAdresse.AdrName AS AdrName,ArtenDb_tblFloraSisf.Name AS Art,vAuswLetzteAnzAnz.TPopKontrjahr AS TPopKontrjahr,vAuswLetzteAnzAnz.TPopKontrTyp AS TPopKontrTyp,vAuswLetzteAnzAnz.Zaehleinheit AS Zaehleinheit,vAuswLetzteAnzAnz.Anzahl AS Anzahl from ((ArtenDb_tblFloraSisf join tblAktionsplan on((ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId))) join (tblPopulation join (tblTeilpopulation join ((vAuswLetzteAnzAnz join tblTeilPopFeldkontrolle on((vAuswLetzteAnzAnz.TPopKontrId = tblTeilPopFeldkontrolle.TPopKontrId))) left join tblAdresse on((tblAdresse.AdrId = tblTeilPopFeldkontrolle.TPopKontrBearb))) on((tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId))) on((tblPopulation.PopId = tblTeilpopulation.PopId))) on((tblAktionsplan.ApArtId = tblPopulation.ApArtId))) group by tblAdresse.AdrName,ArtenDb_tblFloraSisf.Name,vAuswLetzteAnzAnz.TPopKontrjahr,vAuswLetzteAnzAnz.TPopKontrTyp,vAuswLetzteAnzAnz.Zaehleinheit,vAuswLetzteAnzAnz.Anzahl having (vAuswLetzteAnzAnz.TPopKontrTyp = 'Freiwilligen-Erfolgskontrolle') order by tblAdresse.AdrName,ArtenDb_tblFloraSisf.Name,vAuswLetzteAnzAnz.TPopKontrjahr,vAuswLetzteAnzAnz.TPopKontrTyp,vAuswLetzteAnzAnz.Zaehleinheit,vAuswLetzteAnzAnz.Anzahl;

CREATE VIEW vKontr AS
SELECT ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS "AP Art", DomainApBearbeitungsstand.DomainTxt AS "AP Status", tblAktionsplan.ApJahr AS "AP Start im Jahr", DomainApUmsetzung.DomainTxt AS "AP Stand Umsetzung", tblAdresse_1.AdrName AS "AP verantwortlich", tblPopulation.PopGuid AS "Pop Guid", tblPopulation.PopNr AS "Pop Nr", tblPopulation.PopName AS "Pop Name", DomainPopHerkunft.HerkunftTxt AS "Pop Herkunft", tblPopulation.PopBekanntSeit AS "Pop bekannt seit", tblTeilpopulation.TPopGuid AS "TPop Guid", tblTeilpopulation.TPopNr AS "TPop Nr", tblTeilpopulation.TPopGemeinde AS "TPop Gemeinde", tblTeilpopulation.TPopFlurname AS "TPop Flurname", DomainPopHerkunft_1.HerkunftTxt AS "TPop Status", tblTeilpopulation.TPopHerkunftUnklar AS "TPop Status unklar", tblTeilpopulation.TPopHerkunftUnklarBegruendung AS "TPop Begründung für unklaren Status", tblTeilpopulation.TPopXKoord AS "TPop X-Koordinaten", tblTeilpopulation.TPopYKoord AS "TPop Y-Koordinaten", tblTeilpopulation.TPopRadius AS "TPop Radius m", tblTeilpopulation.TPopHoehe AS "TPop Höhe", tblTeilpopulation.TPopExposition AS "TPop Exposition", tblTeilpopulation.TPopKlima AS "TPop Klima", tblTeilpopulation.TPopNeigung AS "TPop Hangneigung", tblTeilpopulation.TPopBeschr AS "TPop Beschreibung", tblTeilpopulation.TPopKatNr AS "TPop Kataster-Nr", tblAdresse_2.AdrName AS "TPop verantwortlich", DomainPopHerkunft_1.HerkunftTxt AS "TPop Herkunft", tblTeilpopulation.TPopApBerichtRelevant AS "TPop für AP-Bericht relevant", tblTeilpopulation.TPopBekanntSeit AS "TPop bekannt seit", tblTeilpopulation.TPopEigen AS "TPop EigentümerIn", tblTeilpopulation.TPopKontakt AS "TPop Kontakt vor Ort", tblTeilpopulation.TPopNutzungszone AS "TPop Nutzungszone", tblTeilpopulation.TPopBewirtschafterIn AS "TPop BewirtschafterIn", tblTeilpopulation.TPopBewirtschaftung AS "TPop Bewirtschaftung", tblTeilpopulation.TPopPop AS "TPop Lage repräsentiert Population", tblTeilPopFeldkontrolle.TPopKontrGuid AS "Kontr Guid", tblTeilPopFeldkontrolle.TPopKontrJahr AS "Kontr Jahr", tblTeilPopFeldkontrolle.TPopKontrDatum AS "Kontr Datum", DomainTPopFeldkontrTyp.DomainTxt AS "Kontr Typ", tblAdresse.AdrName AS "Kontr BearbeiterIn", DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS "Kontr Zaehleinheit 1", DomainTPopKontrMethode.BeurteilTxt AS "Kontr Methode 1", tblTeilPopFeldkontrolle.TPopKontrAnz1 AS "Kontr Anzahl 1", DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS "Kontr Zaehleinheit 2", DomainTPopKontrMethode_2.BeurteilTxt AS "Kontr Methode 2", tblTeilPopFeldkontrolle.TPopKontrAnz2 AS "Kontr Anzahl 2", DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS "Kontr Zaehleinheit 3", DomainTPopKontrMethode_1.BeurteilTxt AS "Kontr Methode 3", tblTeilPopFeldkontrolle.TPopKontrAnz3 AS "Kontr Anzahl 3", tblTeilPopFeldkontrolle.TPopKontrUeberleb AS "Kontr Ueberlebensrate", tblTeilPopFeldkontrolle.TPopKontrVitalitaet AS "Kontr Vitalitaet", DomainPopEntwicklung.EntwicklungTxt AS "Kontr Entwicklung", tblTeilPopFeldkontrolle.TPopKontrUrsach AS "Kontr Ursachen", tblTeilPopFeldkontrolle.TPopKontrUrteil AS "Kontr Erfolgsbeurteilung", tblTeilPopFeldkontrolle.TPopKontrAendUms AS "Kontr Aend-Vorschlaege Umsetzung", tblTeilPopFeldkontrolle.TPopKontrAendKontr AS "Kontr Aend-Vorschlaege Kontrolle", tblTeilpopulation.TPopXKoord AS "Kontr X-Koord", tblTeilpopulation.TPopYKoord AS "Kontr Y-Koord", tblTeilPopFeldkontrolle.TPopKontrTxt AS "Kontr Bemerkungen", tblTeilPopFeldkontrolle.TPopKontrLeb AS "Kontr Lebensraum Delarze", tblTeilPopFeldkontrolle.TPopKontrLebUmg AS "Kontr angrenzender Lebensraum Delarze", tblTeilPopFeldkontrolle.TPopKontrVegTyp AS "Kontr Vegetationstyp", tblTeilPopFeldkontrolle.TPopKontrKonkurrenz AS "Kontr Konkurrenz", tblTeilPopFeldkontrolle.TPopKontrMoosschicht AS "Kontr Moosschicht", tblTeilPopFeldkontrolle.TPopKontrKrautschicht AS "Kontr Krautschicht", tblTeilPopFeldkontrolle.TPopKontrStrauchschicht AS "Kontr Strauchschicht", tblTeilPopFeldkontrolle.TPopKontrBaumschicht AS "Kontr Baumschicht", tblTeilPopFeldkontrolle.TPopKontrBodenTyp AS "Kontr Bodentyp", tblTeilPopFeldkontrolle.TPopKontrBodenKalkgehalt AS "Kontr Boden Kalkgehalt", tblTeilPopFeldkontrolle.TPopKontrBodenDurchlaessigkeit AS "Kontr Boden Durchlaessigkeit", tblTeilPopFeldkontrolle.TPopKontrBodenHumus AS "Kontr Boden Hmusgehalt", tblTeilPopFeldkontrolle.TPopKontrBodenNaehrstoffgehalt AS "Kontr Boden Naehrstoffgehalt", tblTeilPopFeldkontrolle.TPopKontrBodenAbtrag AS "Kontr Oberbodenabtrag", tblTeilPopFeldkontrolle.TPopKontrWasserhaushalt AS "Kontr Wasserhaushalt", DomainTPopKontrIdBiotUebereinst.DomainTxt AS TPopKontrIdealBiotopUebereinst, tblTeilPopFeldkontrolle.TPopKontrHandlungsbedarf, tblTeilPopFeldkontrolle.TPopKontrUebFlaeche, tblTeilPopFeldkontrolle.TPopKontrFlaeche AS "Kontr Flaeche m2", tblTeilPopFeldkontrolle.TPopKontrPlan AS "Kontr auf Plan eingezeichnet", tblTeilPopFeldkontrolle.TPopKontrVeg AS "Kontr Deckung durch Vegetation", tblTeilPopFeldkontrolle.TPopKontrNaBo AS "Kontr Deckung nackter Boden", tblTeilPopFeldkontrolle.TPopKontrUebPfl AS "Kontr Deckung durch ueberpruefte Art", tblTeilPopFeldkontrolle.TPopKontrJungPflJN AS "Kontr auch junge Pflanzen", tblTeilPopFeldkontrolle.TPopKontrVegHoeMax AS "Kontr maximale Veg-hoehe cm", tblTeilPopFeldkontrolle.TPopKontrVegHoeMit AS "Kontr mittlere Veg-hoehe cm", tblTeilPopFeldkontrolle.TPopKontrGefaehrdung AS "Kontr Gefaehrdung", tblTeilPopFeldkontrolle.MutWann, tblTeilPopFeldkontrolle.MutWer
FROM DomainPopHerkunft AS DomainPopHerkunft_1 RIGHT JOIN (tblAdresse AS tblAdresse_2 RIGHT JOIN ((((((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN ((((((tblTeilPopFeldkontrolle LEFT JOIN DomainTPopFeldkontrTyp ON tblTeilPopFeldkontrolle.TPopKontrTyp = DomainTPopFeldkontrTyp.DomainTxt) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainPopEntwicklung ON tblTeilPopFeldkontrolle.TPopKontrEntwicklung = DomainPopEntwicklung.EntwicklungId) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrIdBiotUebereinst ON tblTeilPopFeldkontrolle.TPopKontrIdealBiotopUebereinst = DomainTPopKontrIdBiotUebereinst.DomainCode) LEFT JOIN tblAdresse AS tblAdresse_1 ON tblAktionsplan.ApBearb = tblAdresse_1.AdrId) ON tblAdresse_2.AdrId = tblTeilpopulation.TPopVerantw) ON DomainPopHerkunft_1.HerkunftId = tblTeilpopulation.TPopHerkunft
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr;

CREATE VIEW vKontrFuerGis AS
SELECT tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name AS Artname, DomainApBearbeitungsstand.DomainTxt AS ApStatus, tblAktionsplan.ApJahr, DomainApUmsetzung.DomainTxt AS ApUmsetzung, tblPopulation.PopGuid, tblPopulation.PopNr, tblPopulation.PopName, DomainPopHerkunft.HerkunftTxt AS PopHerkunft, tblPopulation.PopBekanntSeit, tblTeilpopulation.TPopGuid, tblTeilpopulation.TPopNr, tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, tblTeilpopulation.TPopBekanntSeit, tblTeilPopFeldkontrolle.TPopKontrGuid, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrDatum, DomainTPopFeldkontrTyp.DomainTxt AS TPopKontrTyp, tblAdresse.AdrName AS TPopKontrBearb, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS TPopKontrZaehleinheit1, DomainTPopKontrMethode.BeurteilTxt AS TPopKontrMethode1, tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS TPopKontrZaehleinheit2, DomainTPopKontrMethode_2.BeurteilTxt AS TPopKontrMethode2, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS TPopKontrZaehleinheit3, DomainTPopKontrMethode_1.BeurteilTxt AS TPopKontrMethode3, tblTeilPopFeldkontrolle.TPopKontrAnz3, tblTeilPopFeldkontrolle.TPopKontrUeberleb, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, DomainPopEntwicklung.EntwicklungTxt AS TPopKontrEntwicklung, tblTeilPopFeldkontrolle.TPopKontrUrsach, tblTeilPopFeldkontrolle.TPopKontrUrteil, tblTeilPopFeldkontrolle.TPopKontrAendUms, tblTeilPopFeldkontrolle.TPopKontrAendKontr, tblTeilpopulation.TPopXKoord AS X, tblTeilpopulation.TPopYKoord AS Y, tblTeilPopFeldkontrolle.TPopKontrLeb, tblTeilPopFeldkontrolle.TPopKontrFlaeche, tblTeilPopFeldkontrolle.TPopKontrLebUmg, tblTeilPopFeldkontrolle.TPopKontrVegTyp, tblTeilPopFeldkontrolle.TPopKontrKonkurrenz, tblTeilPopFeldkontrolle.TPopKontrMoosschicht, tblTeilPopFeldkontrolle.TPopKontrKrautschicht, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht, tblTeilPopFeldkontrolle.TPopKontrBaumschicht, tblTeilPopFeldkontrolle.TPopKontrBodenTyp, tblTeilPopFeldkontrolle.TPopKontrBodenKalkgehalt, tblTeilPopFeldkontrolle.TPopKontrBodenDurchlaessigkeit, tblTeilPopFeldkontrolle.TPopKontrBodenHumus, tblTeilPopFeldkontrolle.TPopKontrBodenNaehrstoffgehalt, tblTeilPopFeldkontrolle.TPopKontrBodenAbtrag, tblTeilPopFeldkontrolle.TPopKontrWasserhaushalt, DomainTPopKontrIdBiotUebereinst.DomainTxt AS TPopKontrIdealBiotopUebereinst, tblTeilPopFeldkontrolle.TPopKontrUebFlaeche, tblTeilPopFeldkontrolle.TPopKontrPlan, tblTeilPopFeldkontrolle.TPopKontrVeg, tblTeilPopFeldkontrolle.TPopKontrNaBo, tblTeilPopFeldkontrolle.TPopKontrUebPfl, tblTeilPopFeldkontrolle.TPopKontrJungPflJN, tblTeilPopFeldkontrolle.TPopKontrVegHoeMax, tblTeilPopFeldkontrolle.TPopKontrVegHoeMit, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung, tblTeilPopFeldkontrolle.MutWann, tblTeilPopFeldkontrolle.MutWer
FROM ((((((((ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN ((((((tblTeilPopFeldkontrolle LEFT JOIN DomainTPopFeldkontrTyp ON tblTeilPopFeldkontrolle.TPopKontrTyp = DomainTPopFeldkontrTyp.DomainTxt) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainPopEntwicklung ON tblTeilPopFeldkontrolle.TPopKontrEntwicklung = DomainPopEntwicklung.EntwicklungId) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) LEFT JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrIdBiotUebereinst ON tblTeilPopFeldkontrolle.TPopKontrIdealBiotopUebereinst = DomainTPopKontrIdBiotUebereinst.DomainCode
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, tblTeilPopFeldkontrolle.TPopKontrJahr, tblTeilPopFeldkontrolle.TPopKontrDatum;

CREATE VIEW vKontrOhneTPop AS
SELECT tblTeilPopFeldkontrolle.TPopKontrGuid AS "Kontr Guid", tblTeilPopFeldkontrolle.TPopKontrJahr AS "Kontr Jahr", tblTeilPopFeldkontrolle.TPopKontrDatum AS "Kontr Datum", DomainTPopFeldkontrTyp.DomainTxt AS "Kontr Typ", tblAdresse.AdrName AS "Kontr BearbeiterIn", DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS "Kontr Zaehleinheit 1", DomainTPopKontrMethode.BeurteilTxt AS "Kontr Methode 1", tblTeilPopFeldkontrolle.TPopKontrAnz1 AS "Kontr Anzahl 1", DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS "Kontr Zaehleinheit 2", DomainTPopKontrMethode_2.BeurteilTxt AS "Kontr Methode 2", tblTeilPopFeldkontrolle.TPopKontrAnz2 AS "Kontr Anzahl 2", DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS "Kontr Zaehleinheit 3", DomainTPopKontrMethode_1.BeurteilTxt AS "Kontr Methode 3", tblTeilPopFeldkontrolle.TPopKontrAnz3 AS "Kontr Anzahl 3", tblTeilPopFeldkontrolle.TPopKontrUeberleb AS "Kontr Ueberlebensrate", tblTeilPopFeldkontrolle.TPopKontrVitalitaet AS "Kontr Vitalitaet", DomainPopEntwicklung.EntwicklungTxt AS "Kontr Entwicklung", tblTeilPopFeldkontrolle.TPopKontrUrsach AS "Kontr Ursachen", tblTeilPopFeldkontrolle.TPopKontrUrteil AS "Kontr Erfolgsbeurteilung", tblTeilPopFeldkontrolle.TPopKontrAendUms AS "Kontr Aend-Vorschlaege Umsetzung", tblTeilPopFeldkontrolle.TPopKontrAendKontr AS "Kontr Aend-Vorschlaege Kontrolle", tblTeilpopulation.TPopXKoord AS "Kontr X-Koord", tblTeilpopulation.TPopYKoord AS "Kontr Y-Koord", tblTeilPopFeldkontrolle.TPopKontrTxt AS "Kontr Bemerkungen", tblTeilPopFeldkontrolle.TPopKontrLeb AS "Kontr Lebensraum Delarze", tblTeilPopFeldkontrolle.TPopKontrLebUmg AS "Kontr angrenzender Lebensraum Delarze", tblTeilPopFeldkontrolle.TPopKontrVegTyp AS "Kontr Vegetationstyp", tblTeilPopFeldkontrolle.TPopKontrKonkurrenz AS "Kontr Konkurrenz", tblTeilPopFeldkontrolle.TPopKontrMoosschicht AS "Kontr Moosschicht", tblTeilPopFeldkontrolle.TPopKontrKrautschicht AS "Kontr Krautschicht", tblTeilPopFeldkontrolle.TPopKontrStrauchschicht AS "Kontr Strauchschicht", tblTeilPopFeldkontrolle.TPopKontrBaumschicht AS "Kontr Baumschicht", tblTeilPopFeldkontrolle.TPopKontrBodenTyp AS "Kontr Bodentyp", tblTeilPopFeldkontrolle.TPopKontrBodenKalkgehalt AS "Kontr Boden Kalkgehalt", tblTeilPopFeldkontrolle.TPopKontrBodenDurchlaessigkeit AS "Kontr Boden Durchlaessigkeit", tblTeilPopFeldkontrolle.TPopKontrBodenHumus AS "Kontr Boden Hmusgehalt", tblTeilPopFeldkontrolle.TPopKontrBodenNaehrstoffgehalt AS "Kontr Boden Naehrstoffgehalt", tblTeilPopFeldkontrolle.TPopKontrBodenAbtrag AS "Kontr Oberbodenabtrag", tblTeilPopFeldkontrolle.TPopKontrWasserhaushalt AS "Kontr Wasserhaushalt", DomainTPopKontrIdBiotUebereinst.DomainTxt AS TPopKontrIdealBiotopUebereinst, tblTeilPopFeldkontrolle.TPopKontrHandlungsbedarf, tblTeilPopFeldkontrolle.TPopKontrUebFlaeche, tblTeilPopFeldkontrolle.TPopKontrFlaeche AS "Kontr Flaeche m2", tblTeilPopFeldkontrolle.TPopKontrPlan AS "Kontr auf Plan eingezeichnet", tblTeilPopFeldkontrolle.TPopKontrVeg AS "Kontr Deckung durch Vegetation", tblTeilPopFeldkontrolle.TPopKontrNaBo AS "Kontr Deckung nackter Boden", tblTeilPopFeldkontrolle.TPopKontrUebPfl AS "Kontr Deckung durch ueberpruefte Art", tblTeilPopFeldkontrolle.TPopKontrJungPflJN AS "Kontr auch junge Pflanzen", tblTeilPopFeldkontrolle.TPopKontrVegHoeMax AS "Kontr maximale Veg-hoehe cm", tblTeilPopFeldkontrolle.TPopKontrVegHoeMit AS "Kontr mittlere Veg-hoehe cm", tblTeilPopFeldkontrolle.TPopKontrGefaehrdung AS "Kontr Gefaehrdung", tblTeilPopFeldkontrolle.MutWann, tblTeilPopFeldkontrolle.MutWer
FROM ((((tblTeilpopulation RIGHT JOIN ((((((tblTeilPopFeldkontrolle LEFT JOIN DomainTPopFeldkontrTyp ON tblTeilPopFeldkontrolle.TPopKontrTyp = DomainTPopFeldkontrTyp.DomainTxt) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainPopEntwicklung ON tblTeilPopFeldkontrolle.TPopKontrEntwicklung = DomainPopEntwicklung.EntwicklungId) ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrIdBiotUebereinst ON tblTeilPopFeldkontrolle.TPopKontrIdealBiotopUebereinst = DomainTPopKontrIdBiotUebereinst.DomainCode
WHERE tblTeilpopulation.TPopId Is Null;

CREATE VIEW vBeob AS
SELECT alexande_beob.tblBeob.BeobId, alexande_beob.tblBeob.NO_NOTE AS "ID Info Flora", alexande_beob.tblBeob.IdEvab AS "ID EvAB", ArtenDb_tblFloraSisf.NR AS ApArtId, ArtenDb_tblFloraSisf.Name AS Artname, tblPopulation.PopGuid, tblPopulation.PopNr, tblTeilpopulation.TPopGuid, tblTeilpopulation.TPopNr, CONCAT(tblPopulation.PopNr, ".", tblTeilpopulation.TPopNr) AS "TPop-Nr", alexande_beob.tblBeob.PROJET AS Projekt, alexande_beob.tblBeob.NOM_COMMUNE AS RaumGde, alexande_beob.tblBeob.DESC_LOCALITE AS Ort, alexande_beob.tblBeob.xGIS AS X, alexande_beob.tblBeob.yGIS AS Y, alexande_beob.tblBeob.A_NOTE AS "Datum Jahr", alexande_beob.tblBeob.M_NOTE AS "Datum Monat", alexande_beob.tblBeob.J_NOTE AS "Datum Tag", alexande_beob.tblBeob.Autor, alexande_beob.tblBeob.MutWann, alexande_beob.tblBeob.MutWer
FROM (ArtenDb_tblFloraSisf INNER JOIN tblAktionsplan ON ArtenDb_tblFloraSisf.NR = tblAktionsplan.ApArtId) INNER JOIN (tblPopulation INNER JOIN (tblTeilpopulation INNER JOIN alexande_beob.tblBeob ON tblTeilpopulation.TPopId = alexande_beob.tblBeob.TPopId) ON tblPopulation.PopId = tblTeilpopulation.PopId) ON tblAktionsplan.ApArtId = tblPopulation.ApArtId
ORDER BY ArtenDb_tblFloraSisf.Name, tblPopulation.PopNr, tblTeilpopulation.TPopNr, alexande_beob.tblBeob.M_NOTE DESC, alexande_beob.tblBeob.J_NOTE DESC;


CREATE VIEW vExportNachEvab_Alle AS 
SELECT ArtenDb_tblFloraSisf.GUID AS Projekt_Id, CONCAT("AP Flora ZH: ", ArtenDb_tblFloraSisf.Name) AS Projekt_Name, CAST(IF(tblAktionsplan.ApJahr Is Not Null,CONCAT("01.01.", tblAktionsplan.ApJahr),"") AS CHAR) AS Projekt_Eröffnung, "Topos" AS Projekt_Autor, CAST(CONCAT("Aktionsplan: ", DomainApBearbeitungsstand.DomainTxt, IF(tblAktionsplan.ApJahr Is Not Null,CONCAT("; Start im Jahr: ", tblAktionsplan.ApJahr),""), IF(tblAktionsplan.ApUmsetzung Is Not Null,CONCAT("; Stand Umsetzung: ", DomainApUmsetzung.DomainTxt),"")) AS CHAR) AS Projekt_Bemerkungen, tblPopulation.PopGuid AS Raum_Id, CAST(CONCAT(tblPopulation.PopName, IF(tblPopulation.PopNr Is Not Null,CONCAT(" (Nr. ", tblPopulation.PopNr + ")"),"")) AS CHAR) AS Raum_Name, CAST(IF(tblPopulation.PopHerkunft Is Not Null,CONCAT("Status: ", DomainPopHerkunft.HerkunftTxt, IF(tblPopulation.PopBekanntSeit Is Not Null,CONCAT("; Bekannt seit: ", tblPopulation.PopBekanntSeit),"")),"") AS CHAR) AS Raum_Bemerkungen, tblTeilpopulation.TPopGuid AS Ort_Id, CAST(CONCAT(tblTeilpopulation.TPopFlurname, IF(tblTeilpopulation.TPopNr Is Not Null,CONCAT(" (Nr. ", tblTeilpopulation.TPopNr, ")"),"")) AS CHAR) AS Ort_Name, tblTeilpopulation.TPopHoehe AS Ort_ObergrenzeHöhe, tblTeilpopulation.TPopXKoord AS Ort_X, tblTeilpopulation.TPopYKoord AS Ort_Y, "+-20m" AS Ort_Genauigkeit, tblTeilpopulation.TPopGemeinde AS Ort_Gemeinde, tblTeilpopulation.TPopFlurname AS Ort_Flurname, tblTeilpopulation.TPopExposition AS Ort_Exposition, tblTeilpopulation.TPopNeigung AS Ort_Hangneigung, tblTeilPopFeldkontrolle.TPopKontrLeb AS Ort_Lebensraum, tblTeilPopFeldkontrolle.TPopKontrLebUmg AS Ort_UmgebungDelarze, tblTeilPopFeldkontrolle.ZeitGuid AS Zeit_Id, CAST(IF(tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null,CONCAT(tblTeilPopFeldkontrolle.TPopKontrDatum,"01.01.", tblTeilPopFeldkontrolle.TPopKontrJahr),"") AS CHAR) AS Zeit_Datum, CAST(IF(tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null,"Tag","Jahr") AS CHAR) AS Zeit_GenauigkeitDatum, tblTeilPopFeldkontrolle.TPopKontrMoosschicht AS Zeit_DeckungMoose, tblTeilPopFeldkontrolle.TPopKontrKrautschicht AS Zeit_DeckungKräuter, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht AS Zeit_DeckungSträucher, tblTeilPopFeldkontrolle.TPopKontrBaumschicht AS Zeit_DeckungBäume, tblTeilPopFeldkontrolle.TPopKontrGuid AS Beob_Id, tblAdresse.AdrName AS Beob_BeobachterinName, tblAktionsplan.ApArtId AS Beob_NR, ArtenDb_tblFloraSisf.Name AS Beob_WissenschArtname, ArtenDb_tblFloraSisf.Deutsch AS Beob_DeutscherArtname, "Feldbeobachtung" AS Beob_TypDerMeldung, tblTeilPopFeldkontrolle.TPopKontrAnz1 AS Beob_Anzahl1, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS Beob_Einheit1, DomainTPopKontrMethode.BeurteilTxt AS Beob_Genauigkeit1, tblTeilPopFeldkontrolle.TPopKontrAnz2 AS Beob_Anzahl2, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS Beob_Einheit2, DomainTPopKontrMethode_1.BeurteilTxt AS Beob_Genauigkeit2, tblTeilPopFeldkontrolle.TPopKontrAnz3 AS Beob_Anzahl3, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS Beob_Einheit3, DomainTPopKontrMethode_2.BeurteilTxt AS Beob_Genauigkeit3, DomainPopHerkunft_1.ZdsfHerkunft AS Beob_Herkunft, DomainPopHerkunft_1.ZdsfVorhanden AS Beob_Vorhandensein, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung AS Beob_Gefährdung, tblTeilPopFeldkontrolle.TPopKontrVitalitaet AS Beob_VitalitätPflanze, tblTeilpopulation.TPopBeschr AS Beob_BeschreibungStandort
FROM ((((((((((((((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId
WHERE (((tblTeilpopulation.TPopXKoord) Is Not Null) AND ((tblTeilpopulation.TPopYKoord) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrDatum) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrTyp)="Zwischenbeurteilung" Or (tblTeilPopFeldkontrolle.TPopKontrTyp)="Freiwilligen-Erfolgskontrolle") AND ((tblTeilpopulation.TPopHerkunft)<>1198167213)) OR (((tblTeilpopulation.TPopXKoord) Is Not Null) AND ((tblTeilpopulation.TPopYKoord) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrTyp)="Zwischenbeurteilung" Or (tblTeilPopFeldkontrolle.TPopKontrTyp)="Freiwilligen-Erfolgskontrolle") AND ((tblTeilpopulation.TPopHerkunft)<>1198167213) AND ((tblTeilPopFeldkontrolle.TPopKontrJahr) Is Not Null))
ORDER BY ArtenDb_tblFloraSisf.Name, CONCAT(tblPopulation.PopName, IF(tblPopulation.PopNr Is Not Null,CONCAT(" (Nr. ", tblPopulation.PopNr, ")"),"")), CONCAT(tblTeilpopulation.TPopFlurname, IF(tblTeilpopulation.TPopNr Is Not Null,CONCAT(" (Nr. ", tblTeilpopulation.TPopNr, ")"),"")), IF(tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null,tblTeilPopFeldkontrolle.TPopKontrDatum,CONCAT("01.01.", tblTeilPopFeldkontrolle.TPopKontrJahr)), ArtenDb_tblFloraSisf.Name;

CREATE VIEW vExportNachEvab_Beob AS
SELECT ArtenDb_tblFloraSisf.GUID AS Projekt_Id, tblPopulation.PopGuid AS Raum_Id, tblTeilpopulation.TPopGuid AS Ort_Id, tblTeilPopFeldkontrolle.ZeitGuid AS Zeit_Id, tblTeilPopFeldkontrolle.TPopKontrGuid AS Beob_Id, tblAdresse.AdrName AS Beob_BeobachterinName, tblAktionsplan.ApArtId AS Beob_NR, ArtenDb_tblFloraSisf.Name AS Beob_WissenschArtname, ArtenDb_tblFloraSisf.Deutsch AS Beob_DeutscherArtname, "Feldbeobachtung" AS Beob_TypDerMeldung, tblTeilPopFeldkontrolle.TPopKontrAnz1 AS Beob_Anzahl1, DomainTPopKontrZaehleinheit.ZaehleinheitTxt AS Beob_Einheit1, DomainTPopKontrMethode.BeurteilTxt AS Beob_Genauigkeit1, tblTeilPopFeldkontrolle.TPopKontrAnz2 AS Beob_Anzahl2, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt AS Beob_Einheit2, DomainTPopKontrMethode_1.BeurteilTxt AS Beob_Genauigkeit2, tblTeilPopFeldkontrolle.TPopKontrAnz3 AS Beob_Anzahl3, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt AS Beob_Einheit3, DomainTPopKontrMethode_2.BeurteilTxt AS Beob_Genauigkeit3, DomainPopHerkunft_1.ZdsfHerkunft AS Beob_Herkunft, DomainPopHerkunft_1.ZdsfVorhanden AS Beob_Vorhandensein, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung AS Beob_Gefährdung, tblTeilPopFeldkontrolle.TPopKontrVitalitaet AS Beob_VitalitätPflanze, tblTeilpopulation.TPopBeschr AS Beob_BeschreibungStandort
FROM ((((((((((((((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId
WHERE (((tblTeilpopulation.TPopXKoord) Is Not Null) AND ((tblTeilpopulation.TPopYKoord) Is Not Null)) OR (((tblTeilpopulation.TPopXKoord) Is Not Null) AND ((tblTeilpopulation.TPopYKoord) Is Not Null))
GROUP BY ArtenDb_tblFloraSisf.GUID, tblPopulation.PopGuid, tblTeilpopulation.TPopGuid, tblTeilPopFeldkontrolle.ZeitGuid, tblTeilPopFeldkontrolle.TPopKontrGuid, tblAdresse.AdrName, tblAktionsplan.ApArtId, ArtenDb_tblFloraSisf.Name, ArtenDb_tblFloraSisf.Deutsch, "Feldbeobachtung", tblTeilPopFeldkontrolle.TPopKontrAnz1, DomainTPopKontrZaehleinheit.ZaehleinheitTxt, DomainTPopKontrMethode.BeurteilTxt, tblTeilPopFeldkontrolle.TPopKontrAnz2, DomainTPopKontrZaehleinheit_1.ZaehleinheitTxt, DomainTPopKontrMethode_1.BeurteilTxt, tblTeilPopFeldkontrolle.TPopKontrAnz3, DomainTPopKontrZaehleinheit_2.ZaehleinheitTxt, DomainTPopKontrMethode_2.BeurteilTxt, DomainPopHerkunft_1.ZdsfHerkunft, DomainPopHerkunft_1.ZdsfVorhanden, tblTeilPopFeldkontrolle.TPopKontrGefaehrdung, tblTeilPopFeldkontrolle.TPopKontrVitalitaet, tblTeilpopulation.TPopBeschr, tblTeilPopFeldkontrolle.TPopKontrDatum, tblTeilPopFeldkontrolle.TPopKontrTyp, tblTeilpopulation.TPopHerkunft, tblTeilPopFeldkontrolle.TPopKontrJahr
HAVING (((tblTeilPopFeldkontrolle.TPopKontrDatum) Is Not Null) AND ((tblTeilPopFeldkontrolle.TPopKontrTyp)="Zwischenbeurteilung" Or (tblTeilPopFeldkontrolle.TPopKontrTyp)="Freiwilligen-Erfolgskontrolle") AND ((tblTeilpopulation.TPopHerkunft)<>1198167213)) OR (((tblTeilPopFeldkontrolle.TPopKontrTyp)="Zwischenbeurteilung" Or (tblTeilPopFeldkontrolle.TPopKontrTyp)="Freiwilligen-Erfolgskontrolle") AND ((tblTeilpopulation.TPopHerkunft)<>1198167213) AND ((tblTeilPopFeldkontrolle.TPopKontrJahr) Is Not Null))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW vExportNachEvab_Zeit AS
SELECT ArtenDb_tblFloraSisf.GUID AS Projekt_Id, tblPopulation.PopGuid AS Raum_Id, tblTeilpopulation.TPopGuid AS Ort_Id, tblTeilPopFeldkontrolle.ZeitGuid AS Zeit_Id, CAST(IF(tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null,tblTeilPopFeldkontrolle.TPopKontrDatum,CONCAT("01.01." + tblTeilPopFeldkontrolle.TPopKontrJahr)) AS CHAR) AS Zeit_Datum, IF(tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null,"Tag","Jahr") AS Zeit_GenauigkeitDatum, tblTeilPopFeldkontrolle.TPopKontrMoosschicht AS Zeit_DeckungMoose, tblTeilPopFeldkontrolle.TPopKontrKrautschicht AS Zeit_DeckungKräuter, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht AS Zeit_DeckungSträucher, tblTeilPopFeldkontrolle.TPopKontrBaumschicht AS Zeit_DeckungBäume
FROM ((((((((((((((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId
WHERE ((tblTeilpopulation.TPopXKoord Is Not Null) AND (tblTeilpopulation.TPopYKoord Is Not Null) AND (tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null) AND (tblTeilPopFeldkontrolle.TPopKontrTyp="Zwischenbeurteilung" Or tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle") AND (tblTeilpopulation.TPopHerkunft<>1198167213)) OR ((tblTeilpopulation.TPopXKoord Is Not Null) AND (tblTeilpopulation.TPopYKoord Is Not Null) AND (tblTeilPopFeldkontrolle.TPopKontrTyp="Zwischenbeurteilung" Or tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle") AND (tblTeilpopulation.TPopHerkunft<>1198167213) AND (tblTeilPopFeldkontrolle.TPopKontrJahr Is Not Null))
GROUP BY ArtenDb_tblFloraSisf.GUID, tblPopulation.PopGuid, tblTeilpopulation.TPopGuid, tblTeilPopFeldkontrolle.ZeitGuid, IF(tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null,tblTeilPopFeldkontrolle.TPopKontrDatum,CONCAT("01.01." + tblTeilPopFeldkontrolle.TPopKontrJahr)), IF(tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null,"Tag","Jahr"), tblTeilPopFeldkontrolle.TPopKontrMoosschicht, tblTeilPopFeldkontrolle.TPopKontrKrautschicht, tblTeilPopFeldkontrolle.TPopKontrStrauchschicht, tblTeilPopFeldkontrolle.TPopKontrBaumschicht
ORDER BY IF(tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null,tblTeilPopFeldkontrolle.TPopKontrDatum,tblTeilPopFeldkontrolle.TPopKontrJahr);

CREATE VIEW vExportNachEvab_Ort AS
SELECT ArtenDb_tblFloraSisf.GUID AS Projekt_Id, tblPopulation.PopGuid AS Raum_Id, tblTeilpopulation.TPopGuid AS Ort_Id, CAST(CONCAT(tblTeilpopulation.TPopFlurname, IF(tblTeilpopulation.TPopNr Is Not Null,CONCAT(" (Nr. ", tblTeilpopulation.TPopNr, ")"),"")) AS CHAR) AS Ort_Name, tblTeilpopulation.TPopHoehe AS Ort_ObergrenzeHöhe, tblTeilpopulation.TPopXKoord AS Ort_X, tblTeilpopulation.TPopYKoord AS Ort_Y, "+-20m" AS Ort_Genauigkeit, tblTeilpopulation.TPopGemeinde AS Ort_Gemeinde, tblTeilpopulation.TPopFlurname AS Ort_Flurname, tblTeilpopulation.TPopExposition AS Ort_Exposition, tblTeilpopulation.TPopNeigung AS Ort_Hangneigung, tblTeilPopFeldkontrolle.TPopKontrLeb AS Ort_Lebensraum, tblTeilPopFeldkontrolle.TPopKontrLebUmg AS Ort_UmgebungDelarze
FROM ((((((((((((((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId
WHERE ((tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null) AND (tblTeilPopFeldkontrolle.TPopKontrTyp="Zwischenbeurteilung" Or tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle") AND (tblTeilpopulation.TPopHerkunft<>1198167213)) OR ((tblTeilPopFeldkontrolle.TPopKontrTyp="Zwischenbeurteilung" Or tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle") AND (tblTeilpopulation.TPopHerkunft<>1198167213) AND (tblTeilPopFeldkontrolle.TPopKontrJahr Is Not Null))
GROUP BY ArtenDb_tblFloraSisf.GUID, tblPopulation.PopGuid, tblTeilpopulation.TPopGuid, CONCAT(tblTeilpopulation.TPopFlurname, IF(tblTeilpopulation.TPopNr Is Not Null,CONCAT(" (Nr. ", tblTeilpopulation.TPopNr, ")"),"")), tblTeilpopulation.TPopHoehe, tblTeilpopulation.TPopXKoord, tblTeilpopulation.TPopYKoord, "+-20m", tblTeilpopulation.TPopGemeinde, tblTeilpopulation.TPopFlurname, tblTeilpopulation.TPopExposition, tblTeilpopulation.TPopNeigung, tblTeilPopFeldkontrolle.TPopKontrLeb, tblTeilPopFeldkontrolle.TPopKontrLebUmg
HAVING ((tblTeilpopulation.TPopXKoord Is Not Null) AND (tblTeilpopulation.TPopYKoord Is Not Null)) OR ((tblTeilpopulation.TPopXKoord Is Not Null) AND (tblTeilpopulation.TPopYKoord Is Not Null))
ORDER BY tblTeilpopulation.TPopFlurname,tblTeilpopulation.TPopNr;

CREATE VIEW vExportNachEvab_Raum AS
SELECT ArtenDb_tblFloraSisf.GUID AS Projekt_Id, tblPopulation.PopGuid AS Raum_Id, CAST(CONCAT(tblPopulation.PopName, IF(tblPopulation.PopNr Is Not Null,CONCAT(" (Nr. ", tblPopulation.PopNr, ")"),"")) AS CHAR) AS Raum_Name, CAST(IF(tblPopulation.PopHerkunft Is Not Null,CONCAT("Status: ", DomainPopHerkunft.HerkunftTxt, IF(tblPopulation.PopBekanntSeit Is Not Null,CONCAT("; Bekannt seit: ", tblPopulation.PopBekanntSeit),"")),"") AS CHAR) AS Raum_Bemerkungen
FROM ((((((((((((((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId
WHERE ((tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null) AND (tblTeilPopFeldkontrolle.TPopKontrTyp="Zwischenbeurteilung" Or tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle") AND (tblTeilpopulation.TPopHerkunft<>1198167213) AND (tblTeilpopulation.TPopXKoord Is Not Null) AND (tblTeilpopulation.TPopYKoord Is Not Null)) OR ((tblTeilPopFeldkontrolle.TPopKontrTyp="Zwischenbeurteilung" Or tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle") AND (tblTeilpopulation.TPopHerkunft<>1198167213) AND (tblTeilpopulation.TPopXKoord Is Not Null) AND (tblTeilpopulation.TPopYKoord Is Not Null) AND (tblTeilPopFeldkontrolle.TPopKontrJahr Is Not Null))
GROUP BY ArtenDb_tblFloraSisf.GUID, tblPopulation.PopGuid, CONCAT(tblPopulation.PopName, IF(tblPopulation.PopNr Is Not Null,CONCAT(" (Nr. ", tblPopulation.PopNr, ")"),"")), IF(tblPopulation.PopHerkunft Is Not Null,CONCAT("Status: ", DomainPopHerkunft.HerkunftTxt, IF(tblPopulation.PopBekanntSeit Is Not Null,CONCAT("; Bekannt seit: ", tblPopulation.PopBekanntSeit), "")),"")
ORDER BY tblPopulation.PopName, tblPopulation.PopNr;

CREATE VIEW vExportNachEvab_Projekt AS
SELECT ArtenDb_tblFloraSisf.GUID AS Projekt_Id, CONCAT("AP Flora ZH: ", ArtenDb_tblFloraSisf.Name) AS Projekt_Name, CAST(IF(tblAktionsplan.ApJahr Is Not Null,CONCAT("01.01.", tblAktionsplan.ApJahr),"") AS CHAR) AS Projekt_Eröffnung, "Topos" AS Projekt_Autor, CAST(CONCAT("Aktionsplan: ", DomainApBearbeitungsstand.DomainTxt, IF(tblAktionsplan.ApJahr Is Not Null,CONCAT("; Start im Jahr: ", tblAktionsplan.ApJahr),""), IF(tblAktionsplan.ApUmsetzung Is Not Null,CONCAT("; Stand Umsetzung: ", DomainApUmsetzung.DomainTxt),""),"") AS CHAR) AS Projekt_Bemerkungen
FROM ((((((((((((((tblAktionsplan INNER JOIN tblPopulation ON tblAktionsplan.ApArtId = tblPopulation.ApArtId) INNER JOIN tblTeilpopulation ON tblPopulation.PopId = tblTeilpopulation.PopId) INNER JOIN tblTeilPopFeldkontrolle ON tblTeilpopulation.TPopId = tblTeilPopFeldkontrolle.TPopId) INNER JOIN DomainApBearbeitungsstand ON tblAktionsplan.ApStatus = DomainApBearbeitungsstand.DomainCode) INNER JOIN ArtenDb_tblFloraSisf ON tblAktionsplan.ApArtId = ArtenDb_tblFloraSisf.NR) LEFT JOIN DomainApUmsetzung ON tblAktionsplan.ApUmsetzung = DomainApUmsetzung.DomainCode) LEFT JOIN DomainPopHerkunft ON tblPopulation.PopHerkunft = DomainPopHerkunft.HerkunftId) LEFT JOIN tblAdresse ON tblTeilPopFeldkontrolle.TPopKontrBearb = tblAdresse.AdrId) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_2 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit3 = DomainTPopKontrZaehleinheit_2.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit AS DomainTPopKontrZaehleinheit_1 ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit2 = DomainTPopKontrZaehleinheit_1.ZaehleinheitCode) LEFT JOIN DomainTPopKontrZaehleinheit ON tblTeilPopFeldkontrolle.TPopKontrZaehleinheit1 = DomainTPopKontrZaehleinheit.ZaehleinheitCode) LEFT JOIN DomainTPopKontrMethode ON tblTeilPopFeldkontrolle.TPopKontrMethode1 = DomainTPopKontrMethode.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_1 ON tblTeilPopFeldkontrolle.TPopKontrMethode2 = DomainTPopKontrMethode_1.BeurteilCode) LEFT JOIN DomainTPopKontrMethode AS DomainTPopKontrMethode_2 ON tblTeilPopFeldkontrolle.TPopKontrMethode3 = DomainTPopKontrMethode_2.BeurteilCode) LEFT JOIN DomainPopHerkunft AS DomainPopHerkunft_1 ON tblTeilpopulation.TPopHerkunft = DomainPopHerkunft_1.HerkunftId
WHERE ((tblTeilPopFeldkontrolle.TPopKontrDatum Is Not Null) AND (tblTeilPopFeldkontrolle.TPopKontrTyp="Zwischenbeurteilung" Or tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle") AND (tblTeilpopulation.TPopHerkunft<>1198167213) AND (tblTeilpopulation.TPopXKoord Is Not Null) AND (tblTeilpopulation.TPopYKoord Is Not Null)) OR ((tblTeilPopFeldkontrolle.TPopKontrTyp="Zwischenbeurteilung" Or tblTeilPopFeldkontrolle.TPopKontrTyp="Freiwilligen-Erfolgskontrolle") AND (tblTeilpopulation.TPopHerkunft<>1198167213) AND (tblTeilpopulation.TPopXKoord Is Not Null) AND (tblTeilpopulation.TPopYKoord Is Not Null) AND (tblTeilPopFeldkontrolle.TPopKontrJahr Is Not Null))
GROUP BY ArtenDb_tblFloraSisf.GUID, CONCAT("AP Flora ZH: ", ArtenDb_tblFloraSisf.Name), IF(tblAktionsplan.ApJahr Is Not Null,CONCAT("01.01.", tblAktionsplan.ApJahr),""), "Topos", CONCAT("Aktionsplan: ", DomainApBearbeitungsstand.DomainTxt, IF(tblAktionsplan.ApJahr Is Not Null,CONCAT("; Start im Jahr: ", tblAktionsplan.ApJahr),""), IF(tblAktionsplan.ApUmsetzung Is Not Null,CONCAT("; Stand Umsetzung: ", DomainApUmsetzung.DomainTxt), ""))
ORDER BY ArtenDb_tblFloraSisf.Name;

CREATE VIEW name AS 

CREATE VIEW name AS

CREATE VIEW name AS 

CREATE VIEW name AS






















CREATE VIEW name AS 

CREATE VIEW vTblTeilpopulationMitLfnr AS 
SELECT (Select Count (*) FROM tblTeilpopulation as Temp WHERE Temp.TPopId < tblTeilpopulation.TPopId)+1 AS LaufNummer, tblTeilpopulation.*
FROM tblTeilpopulation;





CREATE TRIGGER TPopKontrGuid_insert BEFORE INSERT ON tblTeilPopFeldkontrolle
FOR EACH ROW
SET NEW.TPopKontrGuid = UUID()


DistZurTPop: QWurzel((XGis-Formulare!frmAktionsplan!frmPopulation.Form!frmTPop.Form!TPopXKoord)*(XGis-Formulare!frmAktionsplan!frmPopulation.Form!frmTPop.Form!TPopXKoord)+(YGis-Formulare!frmAktionsplan!frmPopulation.Form!frmTPop.Form!TPopYKoord)*(YGis-Formulare!frmAktionsplan!frmPopulation.Form!frmTPop.Form!TPopYKoord))

QWurzel((XKoord-TPopXKoord)*(XKoord-TPopXKoord)+(YKoord-TPopYKoord)*(YKoord-TPopYKoord))


SQRT

















