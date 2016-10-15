var express = require('express');
var router = express.Router();

var keyboard = {
  "type" : "buttons",
  "buttons" : ["인사해", "사과해", "꼬부기는"]
}

/* GET home page. */
router.get('/keyboard', function(req, res, next) {
  res.json(keyboard);
});

router.post('/message', function(req, res, next) {
  if (req.body.content == "인사해"){
    res.json({message : "안녕하세요", keyboard : keyboard})
  }
  else if(req.body.content == "사과해"){
    res.json({message : "죄송합니다.", keyboard : keyboard})
  }
  else if(req.body.content == "꼬부기는"){
    res.json({message : "꼬북꼬북.", keyboard : keyboard})
  }
  else {
    res.json({message : "뭔소리야", keyboard : keyboard})
  }
});


module.exports = router;
