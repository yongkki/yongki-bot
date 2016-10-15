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
}

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
                message += row[i].field + "파트" + row[i].name + " ";
              }
              message += "입니다.";
              res.json({
                message : {
                  text : message
                }
              })
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
    })
  }
  else if (req.body.content == "명렁어"){
    res.json({
      message : {
        text : "생일/인사/제작자"
      }
    });
  }
  else if (req.body.content == "인사"){
    res.json({
      message : {
        text : "안녕하세요"
      }
    });
  }
  else if (req.body.content == "제작자"){
    res.json({
      message : {
        text : "용키"
      }
    });
  }
  else {
    res.json({
      message : {
        text : "아직 구현중"
      }
    });
  }
});


module.exports = router;
