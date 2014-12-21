/*
 * diese Views hängen von anderen ab, die in viewsGenerieren2.sql erstellt werden
 * daher muss diese Date NACH viewsGenerieren2.sql ausgeführt werden
 */

CREATE OR REPLACE VIEW vTPopAnzKontrInklLetzteKontrUndLetzterTPopBer AS
SELECT apfloraViews.vTPopAnzKontrInklLetzteKontr.ApArtId, apfloraViews.vTPopAnzKontrInklLetzteKontr.Familie, apfloraViews.vTPopAnzKontrInklLetzteKontr.`AP Art`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`AP Status`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`AP Start im Jahr`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`AP Stand Umsetzung`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`AP verantwortlich`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Pop Guid`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Pop Nr`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Pop Name`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Pop Herkunft`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Pop bekannt seit`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop ID`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Guid`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Nr`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Gemeinde`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Flurname`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Status`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop bekannt seit`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Status unklar`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Begruendung fuer unklaren Status`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop X-Koordinaten`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Y-Koordinaten`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Radius m`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Hoehe`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Exposition`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Klima`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Hangneigung`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Beschreibung`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Kataster-Nr`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop fuer AP-Bericht relevant`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop EigentuemerIn`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Kontakt vor Ort`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Nutzungszone`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop BewirtschafterIn`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Bewirtschaftung`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop Anzahl Kontrollen`, apfloraViews.vTPopAnzKontrInklLetzteKontr.TPopKontrId, apfloraViews.vTPopAnzKontrInklLetzteKontr.TPopId, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Guid`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Jahr`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Datum`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Typ`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr BearbeiterIn`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Ueberlebensrate`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Vitalitaet`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Entwicklung`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Ursachen`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Erfolgsbeurteilung`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Aenderungs-Vorschlaege Umsetzung`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Aenderungs-Vorschlaege Kontrolle`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr X-Koord`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Y-Koord`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Bemerkungen`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Lebensraum Delarze`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr angrenzender Lebensraum Delarze`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Vegetationstyp`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Konkurrenz`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Moosschicht`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Krautschicht`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Strauchschicht`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Baumschicht`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Bodentyp`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Boden Kalkgehalt`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Boden Durchlaessigkeit`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Boden Humusgehalt`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Boden Naehrstoffgehalt`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Oberbodenabtrag`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Wasserhaushalt`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Uebereinstimmung mit Idealbiotop`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Handlungsbedarf`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Ueberpruefte Flaeche`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Flaeche der Teilpopulation m2`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr auf Plan eingezeichnet`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Deckung durch Vegetation`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Deckung nackter Boden`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Deckung durch ueberpruefte Art`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr auch junge Pflanzen`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr maximale Veg-hoehe cm`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr mittlere Veg-hoehe cm`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontr Gefaehrdung`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontrolle zuletzt geaendert`, apfloraViews.vTPopAnzKontrInklLetzteKontr.`Kontrolle zuletzt geaendert von`, apfloraViews.vTPopBerMitLetzterId.AnzTPopBer, apfloraViews.vTPopBerMitLetzterId.TPopBerId, apfloraViews.vTPopBerMitLetzterId.`TPopBer Jahr`, apfloraViews.vTPopBerMitLetzterId.`TPopBer Entwicklung`, apfloraViews.vTPopBerMitLetzterId.`TPopBer Bemerkungen`, apfloraViews.vTPopBerMitLetzterId.`TPopBer  MutWann`, apfloraViews.vTPopBerMitLetzterId.`TPopBer MutWer`
FROM apfloraViews.vTPopAnzKontrInklLetzteKontr LEFT JOIN apfloraViews.vTPopBerMitLetzterId ON apfloraViews.vTPopAnzKontrInklLetzteKontr.`TPop ID` = apfloraViews.vTPopBerMitLetzterId.TPopId;