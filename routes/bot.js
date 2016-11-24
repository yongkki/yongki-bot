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

var keyboard = {
  "type" : "text"
};

/* GET home page. */
router.get('/keyboard', function(req, res, next) {
  res.json(keyboard);
});

router.post('/message', function(req, res, next) {
  if (req.body.content == "생일"){
    pool.getConnection(function(error, connection){
      if (error)
        console.log("getConnection Error" + error);
      else{
        connection.query('select name, field from birth where dayofmonth(birth_day) = dayofmonth(now()) and month(birth_day) = month(now())',function(error, rows){
          if (error)
            console.log("Connection Error" + error);
          else {
            if (rows.length > 0){
              var message = "오늘의 생일자는 ";
              for (var i = 0; i<rows.length; i++){
                message += rows[i].field + " 파트" + rows[i].name + " ";
              }
              message += "입니다.";
              res.json({
                message : {
                  text : message
                }
              });
            }
            else {
            res.json({
              message : {
                text : "오늘은 생일자가 없습니다."
              }
            });
            }
            connection.release();
          }
        });
      }
    });
  }
  else if (req.body.content == "치킨"){
    pool.getConnection(function(error, connection){
      if (error)
        console.log("getConnection Error" + error);
      else{
        connection.query('select * from chicken order by rand() limit 1',function(error, rows){
          if (error)
            console.log("Connection Error" + error);
          else {
            var message = "오늘의 추천 치킨은 " + rows[0].store + "의 " + rows[0].menu + "입니다.";
              res.json({message : {text : message}});
              connection.release();
            }
        });
      }
    });
  }
  else {
    pool.getConnection(function(error, connection){
      if (error)
        console.log("getConnection Error" + error);
      else{
        connection.query('select * from message where question = ?', req.body.content,function(error, rows){
          if (error)
            console.log("Connection Error" + error);
          else {
            if (rows.length > 0){
              res.json({message : {text : rows[0].answer}});
            }
            else {
              res.json({message : {text : "응답 문구 준비중... ([명령어]를 치시면 명령어 목록을 확인 할 수 있어요.)"}});
            }
            connection.release();
          }
        });
      }
    });
  }
});


module.exports = router;
