DROP TRIGGER IF EXISTS newguidtpf;
DROP TRIGGER IF EXISTS newguid;

DELIMITER $$
CREATE TRIGGER newguid
  BEFORE INSERT
  ON tblTPopKontr
FOR EACH ROW
BEGIN
  set new.TPopKontrGuid = UUID();
  set new.ZeitGuid = UUID();
END $$
DELIMITER ;
  
DROP TRIGGER IF EXISTS newguidtpm;
CREATE TRIGGER newguidtpm
  BEFORE INSERT
  ON tblTPopMassn
  FOR EACH ROW
  set new.TPopMassnGuid = UUID();
  
DROP TRIGGER IF EXISTS newguidtp;
CREATE TRIGGER newguidtp
  BEFORE INSERT
  ON tblTPop
  FOR EACH ROW
  set new.TPopGuid = UUID();
  
DROP TRIGGER IF EXISTS newguidp;
CREATE TRIGGER newguidp
  BEFORE INSERT
  ON tblPop
  FOR EACH ROW
  set new.PopGuid = UUID();