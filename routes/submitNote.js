var express = require('express');
var router = express.Router();

/** submitNote 
 * send the new paste to the databasthrowe
 * Should only be called by callback of router.post('/'...
 * sb is the callback function for this function
 */
function submitNote(note, cb, res) {
    INSERTNOTEquery = 'INSERT INTO `pastes` VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    CONNECTUSER = 'INSERT INTO `userpaste` VALUES(?, ?, ?)';
  
  
    console.log(thisNote.dump());
    if (userName != "") {
      thisNote.isprivate = 1;
    }
    var inserts = [thisNote.dump()];
  
    var db = connect();
  
  
    db.execute(INSERTNOTEquery, thisNote.dump(), function (err, rows, fields) {
      if (err) throw err;
      else {
        console.log("success");
      }
      if (userName != "") {
        db.execute(CONNECTUSER, [thisNote.uid, userName, 1], function (err, rows, fields) {
          if (err) throw err;
          console.log("success with logged in person");
        })
      }
      db.end();
      callback = cb(res);
    });
  }
  
module.exports = router;