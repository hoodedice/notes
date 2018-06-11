var express = require('express');
var router = express.Router();

var entity = require('html-entities').AllHtmlEntities;

var db = require("./Database");
var Note = require("./Note").Note;

async function getLatestNote(note_id, username) {
  const GETNOTEquery = 'CALL `getLatestNote`(?, ?)';

  try {
    const [result, fields] = await db.connect(GETNOTEquery, [note_id, username]);
    if (result[0].length > 1) throw new Error("Username Doesn't Exist");
    if (result[0][0] == null) return await null;
    const note = { ...result[0][0] };
    return await note;
  } catch (err) { throw err; }

}


router.get('/', function (req, res, next) {
  res.redirect('/index');
});

router.get('/:username/:noteid', async function (req, res, next) {
  try {
    const note = await getLatestNote(req.params.noteid, req.params.username);
    if (note == null) {
      res.render('error', {
        status: 404,
        message: "Note not found at this URL",
        error: null, stack: null
      });
      //res.status(404).send("Note not found");
    }
    else {
      let datetime = 
      res.render('view_note.ejs', {
        title: note.title,
        content: note.content,
        description: note.description,
        t_uploaded: note.datetime
      });
    }
  } catch (err) { throw err; }
});

router.get('/:username/:noteid/:options', async function (req, res, next) {
  try {
    const note = await getLatestNote(req.params.noteid, req.params.username);
    console.log(note);
    if (note.length == 0 || note == null) {
      res.status(404).send("Note not found");
    }
    else {
      //TODO: use Notes object
      switch (req.params.options) {

        case "raw":
          res.render('raw_note.ejs', {
            content: note.content
          });
          break;

        default:
          throw new Error("viewNote switch Error");
      }//end switch
    }//end else 
  } catch (err) {
    console.log(err);
    res.status(404).send("Note not found");
  }

});

module.exports = router;