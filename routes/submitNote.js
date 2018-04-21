var express = require('express');
var router = express.Router();
var entity = require('html-entities').AllHtmlEntities;

var db = require("./Database");
var Note = require("./Note").Note;

/** submitNote 
 */
async function SubmitNewNote(note) {
  const SUBMITNOTEquery = 'CALL `addNewAnonNote`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  var inserts = note.getNoteForDB();
  //console.log(note.note_id);
  //console.log(inserts);

  try {
    const result = await db.connect(SUBMITNOTEquery, inserts);
    //console.log(result);
    return;
  } catch (err) { throw err }
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
          const result = await SubmitNewNote(note);
          //redirect user to their submitted paste
          //res.redirect('/pastes/anon/' + uniqURL);
          //console.log("success");
          res.redirect('/index');
        }
      }
    } catch (err) { throw err; }
  });

  module.exports = router;
