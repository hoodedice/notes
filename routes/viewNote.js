var express = require('express');
var router = express.Router();

var entity = require('html-entities').AllHtmlEntities;

var db = require("./Database");
var Note = require("./Note").Note;

async function getLatestNote(note_id, username) {
  const GETNOTEquery = 'CALL `getLatestNote`(?, ?)';

  try {
    const [result, fields] = await db.connect(GETNOTEquery, [note_id, username]);
    //console.log(result);
    //console.log(result[0]);
    //console.log(result[0][0]);
    return result[0][0];
  } catch (err) { throw err; }
}
/*
db.execute(findquery, [req.params.uniqURL, userName], function (err, rows, fields) {
  if (!rows.length) res.status(404);
  if (err) {
    throw err;
  }
  if (!rows.length) res.redirect("/");
  else {
    db.execute(selquery, [req.params.uniqURL], function (err, rows, fields) {
      if (err) {
        throw err;
      }
      if (!rows.length) res.redirect("/");
      content = rows[0].content;
      title = rows[0].title;
      desc = rows[0].description;

      res.render('view_note.ejs', { title: title, paste: content, description: desc });
      db.end();
    });
  }
});*/
//TODO Call a function to do some backend stuff before we send it over
//TODO Rather, we need to push the file below into that function, and THEN modify
// it within that function itself

router.get('/', function (req, res, next) {
  res.redirect('/index');
});

router.get('/:username/:noteid/', async function (req, res, next) {
  try {
    const result = await getLatestNote(req.params.noteid, req.params.username);
    //console.log(result);
    if (result.length == 0) res.status(404);
    else {
      res.render('view_note.ejs', {
        title: result.title,
        content: result.content,
        description: result.description
      });
    }
  } catch (err) { throw err; }


});

/*
router.get('/:uniqURL', function (req, res, next) {
  selquery = 'SELECT * FROM `pastes` WHERE `uid` = ? AND isprivate = 0';
 
  var db = connect();
 
  db.execute(selquery, [req.params.uniqURL], function (err, rows, fields) {
    if (err) {
      throw err;
    }
    if (!rows.length) res.redirect("/");
    else {
      content = rows[0].content;
      title = rows[0].title;
      desc = rows[0].description;
 
      db.end();
    }
    res.render('view_note.ejs', { title: title, paste: content, description: desc });
  });
  //TODO Call a function to do some backend stuff before we send it over
  //TODO Rather, we need to push the file below into that function, and THEN modify
  // it within that function itself
});
 
 
router.get('/pastes/raw/:uniqURL', function (req, res) {
  selquery = 'SELECT `content` FROM `pastes` WHERE `uid` = ? AND `isprivate` = 0';
  var txt = 'IT DOESNT WORK';
 
  var db = connect();
 
  db.execute(selquery, [req.params.uniqURL], function (err, rows, fields) {
    if (err) {
      throw err;
    }
    txt = rows[0].content;
    res.set('content/text');
    res.send(txt);
  });
 
  db.end();
 
});
*/
module.exports = router;