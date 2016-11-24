var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db_config = require('../config/db_config.json');

var pool = mysql.createPool({
   host : db_config.host,
   port : db_config.port,
   user : db_config.user,
   password : db_config.password,
   database : db_config.database,
   connectionLimit : db_config.connectionLimit,
});


router.get('/', function(req, res, next){
  res.render('index');
});


router.get('/insertForm', function(req, res, next){
  res.render('insert');
});

router.get('/messages', function(req, res, next){
  pool.getConnection(function(error, connection){
    if (error)
      console.log("getConnection Error" + error);
    else{
      connection.query('select question, answer from message', [req.body.question, req.body.answer], function(error, rows){
        if (error){
          console.log("Connection Error" + error);
          res.sendStatus(500);
        }
        else {
          res.render('list', {message : rows});
        }
      });
    }
  });
});


router.post('/messages', function(req, res, next) {
  if (req.body.password == ""){
    pool.getConnection(function(error, connection){
      if (error)
        console.log("getConnection Error" + error);
      else{
        connection.query('insert into message(question, answer) values(?,?)', [req.body.question, req.body.answer], function(error, rows){
          if (error){
            console.log("Connection Error" + error);
            res.sendStatus(500);
          }
          else {
            res.status(201).send('<p>등록완료</p></br><a href="/admin">메인으로</a>');
          }
        });
      }
    });
  }
  else {
    res.status(401).send("비밀번호가 틀렸습니다.");
  }
});


module.exports = router;
