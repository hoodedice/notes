var express = require('express');
var router = express.Router();
var entity = require('html-entities');

var Note = require("./Note").Note;

/** submitNote 
 * send the new paste to the databasthrowe
 * Should only be called by callback of router.post('/'...
 */
async function SubmitNewAnonNote(note) {
  const SENDANONNOTEquery = 'CALL `addNewAnonNote`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  var inserts = note.getNoteForDB();


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

router.post('/', async function (req, res, next) {
  //bare minimum required content to upload is just the paste
  try {
    if (req.body.content != "") {
      let note = new Note(
        entity.encode(req.body.content),
        req.session.username,
        req.body.indent_style,
        req.body.indent_size,
        req.body.is_private,
        req.body.folder,
        req.body.tags,
        entity.encode(req.body.title),
        req.body.filetype,
        entity.encode(req.body.description),
        entity.encode(req.body.language),
        req.body.wrap_style
      );
      if (req.session.user == null) {
        const result = await SubmitNewAnonNote(note);
        //redirect user to their submitted paste
        //res.redirect('/pastes/' + luser + uniqURL);
        console.log("success");
      }
    }
  } catch (err) { throw err; }
});

module.exports = router;
