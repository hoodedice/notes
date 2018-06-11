var express = require('express');
var router = express.Router();
var entity = require('html-entities').AllHtmlEntities;

var db = require("./Database");
var Note = require("./Note").Note;

/* submitNote */
async function SubmitNewNote(note, user_id) {
  const SUBMITNOTEquery = 'CALL `addNewAnonNote`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  var inserts = note.getNoteForDB();
  inserts.push(user_id);

  try {
    const result = await db.connect(SUBMITNOTEquery, inserts);
    //console.log(result);
    return await true;
  } catch (err) { throw err }
}

router.post('/', async function (req, res, next) {
  //bare minimum required content to upload is just the paste
  if (req.body.content != "") {
    let note = returnNewNote(req);
    try {
      //submit note and redirect user to their submitted paste
      if (note.user == null) {
        const result = await SubmitNewNote(note, 1);
        res.redirect('/anon/' + note.note_id);
      } else {
        const result = await SubmitNewNote(note, req.session.user.id);
        res.redirect('/' + req.session.user.name + '/' + note.note_id);
      }
    } catch (err) { 
      //TODO: Handle unique note_id already existing on the database
      throw err; 
    }
  }
});

function returnNewNote(req) {
  if (req.session.user == null) var user = null;
  return new Note(
    entity.encode(req.body.content),
    user,
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
}

module.exports = router;