Software zur Verwaltung des Aktionsplans Flora der Fachstelle Naturschutz des Kantons Zürich.

Sie löst die bestehende Access-Anwendung ab.

<a name="top"></a>
## Inhalt ##
* <a href="#machen">Was kann man mit AP Flora Web machen?</a>
* <a href="#Einschränkungen">Einschränkungen</a>
* <a href="#Roadmap">Roadmap</a>
* <a href="#Technik">Technische Umsetzung</a>
* <a href="#OpenSource">Open source</a>


<a name="machen"></a>
#Was kann man mit AP Flora Web machen?

**Aktionspläne verwalten:**

- Populationen und Teilpopulationen beschreiben
- Massnahmen zur Förderung dokumentieren
- Die Entwicklung der Teilpopulationen und den Erfolg der Massnahmen beurteilen
- Ziele und Erfolgskriterien bestimmen
- Jährliche Berichte verfassen
- Ideale Umweltfaktoren, ideale Biotope und assoziierte Arten beschreiben

**Beobachtungen den Teilpopulationen zuordnen:**

- Alle Beobachtungen der Info Flora innerhalb des Kantons Zürich
- Alle Beobachtungen aus Projekten der Fachstelle Naturschutz des Kantons Zürich
- Eigene Beobachtungen aus EvAB (vorgängig mit Access uploaden)

**Auf Luftbildern und Karten darstellen:**

- Aktionspläne, Populationen, Teilpopulationen und Beobachtungen auf Luftbildern anzeigen
- Nicht zugeordnete Beobachtungen und Teilpopulationen gemeinsam auf dem Luftbild anzeigen
- Teilpopulationen auf Luftbildern verorten
- Teilpopulationen und Beobachtungen im GIS-Browser des Kt. Zürich anzeigen

**Sich anleiten lassen:**

- Wichtige Felder, die in aller Regel auszufüllen sind, werden farblich hervorgehoben
- Bei erklärungsbedürftigen Feldern werden Informationen angezeigt, wenn man mit der Maus über den Feldnamen fährt

Diese beiden Features sind noch im Aufbau.

**Daten exportieren:**

- In den nächsten Tagen werden Exporte bereitgestellt

**Auf die Plätze, fertig, los!**

- "No hassle": Keine Installation, keine Installationskosten, automatische Updates
- Von ausserhalb und endlich auch innerhalb der Fachstelle Naturschutz arbeiten
- Ein moderner Browser wird vorausgesetzt. Getestet auf Google Chrome, Firefox und Safari (neuste Versionen). Funktioniert nicht auf Internet Explorer bis Version 9 (auf 10 nicht getestet)

**Sich rasch zurechtfinden:**

- Über einen dynamisch aufgebauten Strukturbaum navigieren und dabei die Übersicht über die komplexe Hierarchie behalten
- Rechts neben dem Baum die Daten der gewählten Struktur (= "node") bearbeiten

**Effizient arbeiten:**

- Die Anwendung wird mit AJAX gesteuert, um rasche Ladezeiten zu gewährleisten
- Nodes wie z.B. Teilpopulationen im Baum zu anderen nodes desselben Typs verschieben oder kopieren (rechte Maustaste oder drag and drop, wie im Windows explorer)
- im Baum suchen
- Beobachtungen Teilpopulationen zuordnen: Mit drag and drop im Strukturbaum, in einer nach Abstand zu den Teilpopulationen geordneten Liste im Formular oder auch mit drag and drop im Luftbild
- Daten löschen: Bei den gehaltvollen Daten (Pop, TPop, Feldkontrollen, Freiwilligen-Kontrollen, Massnahmen, AP-Berichte) kann das Löschen nachträglich rückgängig gemacht werden

**Anwendung effizient unterhalten:**

- Einfacheres Gesamtsystem mit weniger Abhängigkeiten
- Die Anwendung ist professioneller aufgebaut, im Code dokumentiert und einfacher zu warten

<a href="#top">&#8593; top</a>


<a name="Einschränkungen"></a>
#Einschränkungen

- Jahresberichte weiterhin von Access aus exportieren

<a href="#top">&#8593; top</a>


<a name="Roadmap"></a>
#Roadmap
- Die Anwendung enthält alle geplanten Funktionen
- Jetzt wird sie durch die AnwenderInnen getestet
- Bewährt sie sich, wird sie die bisherige Access-Anwendung ersetzen

<a href="#top">&#8593; top</a>


<a name="Technik"></a>
#Technische Umsetzung
Die Weboberfläche ([HTML](http://de.wikipedia.org/wiki/Hypertext_Markup_Language), [CSS](http://de.wikipedia.org/wiki/Cascading_Style_Sheets), [JavaScript](http://de.wikipedia.org/wiki/JavaScript), [jQuery](http://jquery.com/) und [jsTree](http://www.jstree.com/)) greift mithilfe von [PHP](http://de.wikipedia.org/wiki/PHP) auf eine [mySql-Datenbank](http://de.wikipedia.org/wiki/MySQL).

<a href="#top">&#8593; top</a>


<a name="OpenSource"></a>
#Open source
Die verwendete [Lizenz](https://github.com/barbalex/apflora/blob/master/License.md) ist sehr freizügig. Sie dürfen den Code sogar nehmen, weiterentwickeln und die verbesserte Anwendung der Fachstelle Naturschutz verkaufen! Neben dem Code steht auch die Datenstruktur als [Download](https://github.com/barbalex/apflora/downloads) zur Verfügung. Die eigentlichen Daten aber, mit denen gearbeitet wird, gehören der Fachstelle Naturschutz des Kantons Zürich und stehen nicht zur freien Verfügung.

<a href="#top">&#8593; top</a>