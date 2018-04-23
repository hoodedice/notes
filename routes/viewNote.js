var express = require('express');
var router = express.Router();

var entity = require('html-entities').AllHtmlEntities;

var db = require("./Database");
var Note = require("./Note").Note;

async function getLatestNote(note_id, username) {
  const GETNOTEquery = 'CALL `getLatestNote`(?, ?)';

  try {
    const [result, fields] = await db.connect(GETNOTEquery, [note_id, username]);
    return result[0][0];
  } catch (err) { throw err; }

}


router.get('/', function (req, res, next) {
  res.redirect('/index');
});
 
router.get('/:username/:noteid/', async function (req, res, next) {
  try {
    const result = await getLatestNote(req.params.noteid, req.params.username);
    //console.log(result);
    if (result.length == 0 || result == null) {
      res.status(404).send("Note not found");
    }
    else {
      //TODO: use Notes object
      res.render('view_note.ejs', {
        title: result.title,
        content: result.content,
        description: result.description
      });
    }
  } catch (err) {
    res.status(404).send("Note not found");
  }

});

//TODO: raw note text "/raw/noteid/"

module.exports = router;