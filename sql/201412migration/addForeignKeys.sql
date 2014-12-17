ALTER TABLE `tblPop` ADD CONSTRAINT `tblpop_popid` FOREIGN KEY (`ApArtId`) REFERENCES `apflora`.`tblAp`(`ApArtId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tblBer` ADD CONSTRAINT `tblber_apartid` FOREIGN KEY (`ApArtId`) REFERENCES `apflora`.`tblAp`(`ApArtId`) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE `tblAssozArten` ADD CONSTRAINT `tblassozarten_apartid` FOREIGN KEY (`AaApArtId`) REFERENCES `apflora`.`tblAp`(`ApArtId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tblIdealbiotop` ADD CONSTRAINT `tblidealbiotop_apartid` FOREIGN KEY (`IbApArtId`) REFERENCES `apflora`.`tblAp`(`ApArtId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tblPopBer` ADD CONSTRAINT `tblpopber_apartid` FOREIGN KEY (`PopId`) REFERENCES `apflora`.`tblPop`(`PopId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tblPopMassnBer` ADD CONSTRAINT `tblpopmassnber_popid` FOREIGN KEY (`PopId`) REFERENCES `apflora`.`tblPop`(`PopId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tblTPopBer` ADD CONSTRAINT `tbltpopber_tpopid` FOREIGN KEY (`TPopId`) REFERENCES `apflora`.`tblTPop`(`TPopId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tblTPopKontr` ADD  CONSTRAINT `tbltpopkontr_tpopid` FOREIGN KEY (`TPopId`) REFERENCES `apflora`.`tblTPop`(`TPopId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tblTPop` ADD  CONSTRAINT `tbltpop_popid` FOREIGN KEY (`PopId`) REFERENCES `apflora`.`tblPop`(`PopId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tblBeobZuordnung` ADD  CONSTRAINT `tblbeobzuordnung_tpopid` FOREIGN KEY (`TPopId`) REFERENCES `apflora`.`tblTPop`(`TPopId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tblTPopKontrZaehl` ADD  CONSTRAINT `tpopkontrzaehl_tpopkontrid` FOREIGN KEY (`TPopKontrId`) REFERENCES `apflora`.`tblTPopKontr`(`TPopKontrId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tblTPopMassn` ADD  CONSTRAINT `tbltpopmassn_tpopid` FOREIGN KEY (`TPopId`) REFERENCES `apflora`.`tblTPop`(`TPopId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tblTPopMassnBer` ADD  CONSTRAINT `tbltpopmassnber_tpopid` FOREIGN KEY (`TPopId`) REFERENCES `apflora`.`tblTPop`(`TPopId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tblZielBer` ADD  CONSTRAINT `tblzielber_zielid` FOREIGN KEY (`ZielId`) REFERENCES `apflora`.`tblZiel`(`ZielId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tblJBer` ADD CONSTRAINT `tbljber_apartid` FOREIGN KEY (`ApArtId`) REFERENCES `apflora`.`tblAp`(`ApArtId`) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE `tblErfKrit` ADD CONSTRAINT `tblerfkrit_apartid` FOREIGN KEY (`ApArtId`) REFERENCES `apflora`.`tblAp`(`ApArtId`) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE `tblZiel` ADD CONSTRAINT `tblziel_apartid` FOREIGN KEY (`ApArtId`) REFERENCES `apflora`.`tblAp`(`ApArtId`) ON DELETE NO ACTION ON UPDATE CASCADE;




select TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME,REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME from INFORMATION_SCHEMA.KEY_COLUMN_USAGE where REFERENCED_COLUMN_NAME IS NOT NULL order by REFERENCED_COLUMN_NAME;

show fields from tblZiel where Field = 'ApArtId';
show fields from tblAp where Field = 'ApArtId';

ALTER TABLE tblPop DROP FOREIGN KEY tblpop_popid;
ALTER TABLE tblBer DROP FOREIGN KEY tblber_apartid;
ALTER TABLE tblAssozArten DROP FOREIGN KEY tblassozarten_apartid;
ALTER TABLE tblIdealbiotop DROP FOREIGN KEY tblidealbiotop_apartid;
ALTER TABLE tblPopBer DROP FOREIGN KEY tblpopber_apartid;
ALTER TABLE tblPopMassnBer DROP FOREIGN KEY tblpopmassnber_popid;
ALTER TABLE tblTPopBer DROP FOREIGN KEY tbltpopber_tpopid;
ALTER TABLE tblTPopKontr DROP FOREIGN KEY tbltpopkontr_tpopid;
ALTER TABLE tblTPop DROP FOREIGN KEY tbltpop_popid;
ALTER TABLE tblBeobZuordnung DROP FOREIGN KEY tblbeobzuordnung_tpopid;
ALTER TABLE tblTPopKontrZaehl DROP FOREIGN KEY tpopkontrzaehl_tpopkontrid;
ALTER TABLE tblTPopMassn DROP FOREIGN KEY tbltpopmassn_tpopid;
ALTER TABLE tblTPopMassnBer DROP FOREIGN KEY tbltpopmassnber_tpopid;
ALTER TABLE tblZielBer DROP FOREIGN KEY tblzielber_zielid;

select * from information_schema.columns where table_name = 'tblJBer' and column_name = 'ApArtId';
select * from information_schema.columns where table_name = 'tblAp' and column_name = 'ApArtId';


SELECT ENGINE, TABLE_COLLATION
FROM information_schema.TABLES
WHERE
  TABLE_SCHEMA='apflora';

mysqlcheck -u root --password=cA3c6FAYPk -A --auto-repair --all-databases

show create table tblTPop;