var express = require('express');
var router = express.Router();
var db = require("../database.js");

// Middleware for recurring functions
function loadTeam(req, res, next){
  // parseInt sanitizes input, hoo-ray
  var sql = `SELECT * FROM teams WHERE id = ${parseInt(req.params.id)}`
  var params = []
  db.all(sql, params,(err, rows) => {
    if(err){
      next(new Error('Failed to load team ' + req.params.id));
    }else{
      req.team = rows[0];
      next();
    }
  });
}

/* GET teams listing. */
router.get('/', function(req, res, next) {
  console.log("Got a request for teams")
  var sql = "SELECT * FROM teams"
  var params = []
  db.all(sql, params,(err, rows) => {
    if(err){
      res.status(500).json({"error":err.message});
      return;
    }
    console.log(rows);
    res.json({
      "message":"success",
      "data":rows
    })
  });
});

/* GET individual team. */
router.get('/:id', loadTeam, function(req, res, next) {
  console.log("Got a request for team")
  if(req.team){
    res.json({
      "message":"success",
      "data":req.team
    })
    
    return;
  }else{
    res.status(404).json({"error":`Team with id ${req.params.id} not found.`});
  }
});

/* GET pokemon on a team. */
router.get('/:id/pokemon', function(req, res, next) {
  console.log("Got a request for team pokemon")
  var sql = `SELECT pokedex_id, kills FROM pokemon WHERE team_id = ${parseInt(req.params.id)}`
  var params = []
  db.all(sql, params,(err, rows) => {
    if(err){
      res.status(500).json({"error":err.message});
      return;
    }
    console.log(rows);
    res.json({
      "message":"success",
      "data":rows
    })
  });
});
module.exports = router;
