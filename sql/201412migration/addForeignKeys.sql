ALTER TABLE `pop` ADD CONSTRAINT `tblpop_popid` FOREIGN KEY (`ApArtId`) REFERENCES `apflora`.`ap`(`ApArtId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `ber` ADD CONSTRAINT `tblber_apartid` FOREIGN KEY (`ApArtId`) REFERENCES `apflora`.`ap`(`ApArtId`) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE `assozart` ADD CONSTRAINT `tblassozarten_apartid` FOREIGN KEY (`AaApArtId`) REFERENCES `apflora`.`ap`(`ApArtId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `idealbiotop` ADD CONSTRAINT `tblidealbiotop_apartid` FOREIGN KEY (`IbApArtId`) REFERENCES `apflora`.`ap`(`ApArtId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `popber` ADD CONSTRAINT `tblpopber_apartid` FOREIGN KEY (`PopId`) REFERENCES `apflora`.`pop`(`PopId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `popmassnber` ADD CONSTRAINT `tblpopmassnber_popid` FOREIGN KEY (`PopId`) REFERENCES `apflora`.`pop`(`PopId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tpopber` ADD CONSTRAINT `tbltpopber_tpopid` FOREIGN KEY (`TPopId`) REFERENCES `apflora`.`tpop`(`TPopId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tpopkontr` ADD  CONSTRAINT `tbltpopkontr_tpopid` FOREIGN KEY (`TPopId`) REFERENCES `apflora`.`tpop`(`TPopId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tpop` ADD  CONSTRAINT `tbltpop_popid` FOREIGN KEY (`PopId`) REFERENCES `apflora`.`pop`(`PopId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `beobzuordnung` ADD  CONSTRAINT `tblbeobzuordnung_tpopid` FOREIGN KEY (`TPopId`) REFERENCES `apflora`.`tpop`(`TPopId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tpopkontrzaehl` ADD  CONSTRAINT `tpopkontrzaehl_tpopkontrid` FOREIGN KEY (`TPopKontrId`) REFERENCES `apflora`.`tpopkontr`(`TPopKontrId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tpopmassn` ADD  CONSTRAINT `tbltpopmassn_tpopid` FOREIGN KEY (`TPopId`) REFERENCES `apflora`.`tpop`(`TPopId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tpopmassnber` ADD  CONSTRAINT `tbltpopmassnber_tpopid` FOREIGN KEY (`TPopId`) REFERENCES `apflora`.`tpop`(`TPopId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `zielber` ADD  CONSTRAINT `tblzielber_zielid` FOREIGN KEY (`ZielId`) REFERENCES `apflora`.`ziel`(`ZielId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `apber` ADD CONSTRAINT `tbljber_apartid` FOREIGN KEY (`ApArtId`) REFERENCES `apflora`.`ap`(`ApArtId`) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE `erfkrit` ADD CONSTRAINT `tblerfkrit_apartid` FOREIGN KEY (`ApArtId`) REFERENCES `apflora`.`ap`(`ApArtId`) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE `ziel` ADD CONSTRAINT `tblziel_apartid` FOREIGN KEY (`ApArtId`) REFERENCES `apflora`.`ap`(`ApArtId`) ON DELETE NO ACTION ON UPDATE CASCADE;




select TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME,REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME from INFORMATION_SCHEMA.KEY_COLUMN_USAGE where REFERENCED_COLUMN_NAME IS NOT NULL order by REFERENCED_COLUMN_NAME;

show fields from ziel where Field = 'ApArtId';
show fields from ap where Field = 'ApArtId';

ALTER TABLE pop DROP FOREIGN KEY tblpop_popid;
ALTER TABLE ber DROP FOREIGN KEY tblber_apartid;
ALTER TABLE assozart DROP FOREIGN KEY tblassozarten_apartid;
ALTER TABLE idealbiotop DROP FOREIGN KEY tblidealbiotop_apartid;
ALTER TABLE popber DROP FOREIGN KEY tblpopber_apartid;
ALTER TABLE popmassnber DROP FOREIGN KEY tblpopmassnber_popid;
ALTER TABLE tpopber DROP FOREIGN KEY tbltpopber_tpopid;
ALTER TABLE tpopkontr DROP FOREIGN KEY tbltpopkontr_tpopid;
ALTER TABLE tpop DROP FOREIGN KEY tbltpop_popid;
ALTER TABLE beobzuordnung DROP FOREIGN KEY tblbeobzuordnung_tpopid;
ALTER TABLE tpopkontrzaehl DROP FOREIGN KEY tpopkontrzaehl_tpopkontrid;
ALTER TABLE tpopmassn DROP FOREIGN KEY tbltpopmassn_tpopid;
ALTER TABLE tpopmassnber DROP FOREIGN KEY tbltpopmassnber_tpopid;
ALTER TABLE zielber DROP FOREIGN KEY tblzielber_zielid;

select * from information_schema.columns where table_name = 'apber' and column_name = 'ApArtId';
select * from information_schema.columns where table_name = 'ap' and column_name = 'ApArtId';


SELECT ENGINE, TABLE_COLLATION
FROM information_schema.TABLES
WHERE
  TABLE_SCHEMA='apflora';

mysqlcheck -u root --password=cA3c6FAYPk -A --auto-repair --all-databases

show create table tpop;