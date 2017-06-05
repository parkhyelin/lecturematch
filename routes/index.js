var express = require('express');
var router = express.Router();
var session = require('express-session');
var bodyParser = require('body-parser');
var dbconfig = require('../database.js');
var mysql      = require('mysql');

var conn = mysql.createConnection(dbconfig);
/*
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'tbffl20327',
  database : 'instagram'
});
*/

/* GET home page. */
router.get('/logout',function(req,res,next){
  delete req.session.authId;
  req.session.save(function(){
    res.redirect('/');
  });
});

router.get('/', function(req, res, next) {
    res.render('index', { title: 'home' });
//conn.query("INSERT INTO user(user_id,password) VALUES ('jiwondh','2222')");
});

router.post('/',function(req, res, next){
  email = req.body.email;
  name = req.body.name;
  user_name = req.body.username;
  password = req.body.password;

  var sql = "INSERT INTO `instauser` (`email`, `name`, `username`, `password`) VALUES (?,?,?,?);";

  conn.query(sql, [email, name, user_name, password], function(error, results, fields){
    try{
      console.log('results', results);
      console.log('fields',fields);
      req.session.authId = user_name;
      req.session.save(function(){
        console.log('가입성공');
      });
    }catch(error){
      console.log(error);
    }

  });
  res.end('{"success" : "Updated Successfully", "status" : 200}');
});

router.get('/login', function(req, res, next) {
//  conn.connect();
//  conn.query('SELECT * FROM user', function (error, results, fields) {
//    if (error) throw error;
//    console.log(results);
//  });
//  conn.end();
  res.render('login', { title: 'login' });
});

router.post('/login', function (req,res) {
  /*
  var user = {
    name : 'asdf',
    password : 'asdf'
  };
  var uname = req.body.name;
  var pwd = req.body.password;
  if(uname === user.name && pwd === user.password){
    req.session.name = user.name;
    req.session.password = user.password;
    res.json({status:"success", redirect:'/mypage'});
  }else{
    res.json({status:"success", redirect:'/login'});
  }
  */
  user_name = req.body.id;
  user_password = req.body.password;

  var sql = "SELECT * FROM instauser WHERE username=?";

  conn.query(sql,[user_name], function (error, results, fields) {
    try{  var user = results[0];
      if(user_password == user.password){
        console.log('same password!');
        req.session.authId = user_name;
        req.session.save(function(){
          console.log('성공');
        });
      }else{
        console.log('실패');
      }
    }catch(error){
      console.log(error);
    }
  });
  res.end('{"success":"Updated Successfully", "status" : 200}');
});

router.get('/mypage', function(req, res, next) {
  if(req.session.authId){
    res.render('mypage', { title: 'mypage' });
  }else{
    res.render('login',{title: 'login'});
  }
});

router.get('/mypage2', function(req, res, next) {
  if(req.session.authId){
  res.render('mypage2', { title: 'mypage2' });
}else{
  res.render('login',{title:'login'});
}
});

module.exports = router;
