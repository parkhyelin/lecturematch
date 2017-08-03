module.exports = function(app){
  var express = require('express');
  var router = express.Router();

  var mysql = require('mysql');
  var dbconfig = require('../database.js');
  var conn = mysql.createConnection(dbconfig);

  router.get('/', function(req,res,next){
    if(req.session.authId){
      res.render('ft_userHome',{
        user : req.session.authId,
        title : 'Home'
      });
    }else{
      res.render('ft_home',{
        title : 'Home'
      });
    }
  });

  //강의교환 GET - 페이지
  router.get('/matching',function(req,res,next){
 conn.query('SELECT * FROM class_info',function(err,result){
   if(err)
   throw err;
   else{
     res.render('ft_matching',{ result : result });
   }
 });
 });

  //강의교환 글쓰기 POST - 모달
  router.post('/writematching',function(req,res,next){
    writeremail = req.session.authId;
    class_name = req.body.class_name;
    prof_name = req.body.prof_name;
    time = req.body.time;
    change_class_name = req.body.change_class_name;
    change_prof_name = req.body.change_prof_name;
    change_time = req.body.change_time;
    post_date = req.body.post_date;

    var sql = "select * from ft_user where email = ?";
    var sql3 = "INSERT INTO `class_info` (`class_name`, `prof_name`,`time`,`change_class_name`,`change_prof_name`,`change_time`,`post_date`,`writer`,`writer_email`) VALUES (?,?,?,?,?,?,?,?,?);";
    conn.query(sql, [writeremail], function(error,results,fields){
      if(error){
        console.log(error);
      }else{
        writer = results[0].name;
        conn.query(sql3,[class_name, prof_name, time, change_class_name, change_prof_name, change_time, post_date, writer,writeremail], function(error, results, fields){
          if(error){
            console.log(error);
          }else{
            console.log('글쓰기 성공');
          }
        });//sql3_query
      }
    });//sql_query
    res.end('success');
  });

  //교환신청  get
  router.get('/exchangerequest/:id',function(req,res,next){
    recv_email = req.session.authId;
    var sql = "select * from class_info where id=?";

    conn.query(sql,[req.params.id],function(err,rows){
      res.render('ft_exchange_request_mail',{title :'교환신청',rows : rows});
    });
  });

  //교환신청 POST
  router.post('/exchangerequestmail/:id',function(req,res,next){
    send_email = req.session.authId;
    recv_email = req.body.recv_email;
    content = req.body.content;
    app_date = req.body.app_date;
    //var sql = "INSERT INTO `ft_mail` (`recv_email`, `send_email`,`content`,`date_sent`,`recv_name`,`send_name`) VALUES (?,?,?,?,?,?);";
    var sql = "insert into `request_ex` (`fk_class_info_id`,`app_name`,`app_email`,`content`, `app_date`,`recv_email`) values (?,?,?,?,?,?);"
    var sql2 = "select * from `ft_user` where email = ?";
    if(send_email == recv_email){
      res.end('error');
    }else{
      conn.query(sql2, [send_email],function(error,results1){
        if(error){console.log(error);}
        else{
          var myname = results1[0].name;
          conn.query(sql, [req.params.id, myname, send_email, content, app_date, recv_email],function(error, result2){
            if(error){console.log(error);}
            else {console.log('교환신청 성공');}
          }); //conn.query_sql
        }
      }); //conn.query_sql2

    /*
     conn.query(sql2, [send_email], function(error, results, fields){
      if(error){ console.log(error); }
      else{
        var myname = results[0].name;
        conn.query(sql2, [recv_email],function(error,results2, fields){
          if(error){ console.log(error); }
          else{
            var recvname = results2[0].name;
            conn.query(sql, [recv_email, send_email, content, date_sent,recvname,myname], function(error, results3, fields){
              if(error){
                console.log(error);
              }else{
                console.log('교환신청성공');
              }
            });//sql_query
          }
        });
      }
    });
    */
    res.end('success');
  }
  });



  //메일보내기 POST
  router.post('/sendmail',function(req,res,next){
    send_email = req.session.authId;
    recv_email = req.body.recv_email;
    content = req.body.content;
    date_sent = req.body.date_sent;

    var sql = "INSERT INTO `ft_mail` (`recv_email`, `send_email`,`content`,`date_sent`) VALUES (?,?,?,?);";
    var sql2 = "SELECT * FROM ft_user WHERE email=?";
    var sql3 = "UPDATE ft_mail SET recv_name = ? where recv_email = ?";
    var sql4 = "UPDATE ft_mail SET send_name = ? where send_email = ?";

    if(recv_email == send_email){
      res.end('error');
    }else{
    conn.query(sql, [recv_email, send_email, content, date_sent], function(error, results, fields) {
      if (error) {
        console.log(error);
      } else {
          conn.query(sql2, [recv_email], function (error, results, fields) {
            if(error){
              console.log(error);
            } else {
              var user = results[0];
              recv_name = user.name;
              conn.query(sql3, [recv_name, recv_email], function(error, results,fields){
                if(error){
                  console.log(error);
                } else {
                  conn.query(sql2, [send_email],function(error, results, fields){
                    if(error){
                      console.log(error);
                    }else{
                    var user = results[0];
                    send_name = user.name;
                    conn.query(sql4, [send_name, send_email], function(error,results,fields){
                      if(error){
                        console.log(error);
                      }else{
                        console.log('메일 보내기 성공');
                      }
                    });
                  }
                  });
                }
              });
            }

          });
        }
    });
    res.end('success');
  }//else
  });

  //교환신청 완료 후 페이지 GET
  router.get('/finishexchange/:id',function(req,res,next){
    var sql = "select * from class_info where id = ?"
    var sql2 = "select * from ft_user where email = ?"
    //var sql4 = "UPDATE class_info SET request = 'Y' where id = ?";
    email = req.session.authId;
    conn.query(sql, [req.params.id], function(err,rows){
      if(err){
        console.log(err);
      }else{
        conn.query(sql2, [email], function(err,results){
          if(err){
            console.log(err);
          }else{
            //    conn.query(sql4, [req.params.id],function(err,results3){
            //      if(err){
            //        console.log(err);
            //      }else{
                  res.render('ft_finishexchange',{title :'교환신청완료',results : results, rows : rows});
            //    }
            //    });
          }
        });

      }
    });
  });


  //답장보내기 get
  router.get('/replymodal/:id',function(req,res,next){
    recv_email = req.session.authId;
    var sql = "select * from ft_mail where id=?";

    conn.query(sql,[req.params.id],function(err,rows){
      res.render('ft_replymodal',{title :'답장보내기',rows : rows});
    });
  });

  //답장보내기 POST
  router.post('/replymail/:id',function(req,res,next){
    send_email = req.session.authId;
    recv_email = req.body.recv_email;
    content = req.body.content;
    date_sent = req.body.date_sent;

    var sql = "INSERT INTO `ft_mail` (`recv_email`, `send_email`,`content`,`date_sent`) VALUES (?,?,?,?);";
    var sql2 = "SELECT * FROM ft_user WHERE email=?";
    var sql3 = "UPDATE ft_mail SET recv_name = ? where recv_email = ?";
    var sql4 = "UPDATE ft_mail SET send_name = ? where send_email = ?";
    var sql5 = "select * from ft_mail where id = ?"

    conn.query(sql, [recv_email, send_email, content, date_sent], function(error, results, fields) {
      if (error) {
        console.log(error);
      } else {
          conn.query(sql2, [recv_email], function (error, results, fields) {
            if(error){
              console.log(error);
            } else {
              var user = results[0];
              recv_name = user.name;
              conn.query(sql3, [recv_name, recv_email], function(error, results,fields){
                if(error){
                  console.log(error);
                } else {
                  conn.query(sql2, [send_email],function(error, results, fields){
                    if(error){
                      console.log(error);
                    }else{
                    var user = results[0];
                    send_name = user.name;
                    conn.query(sql4, [send_name, send_email], function(error,results,fields){
                      if(error){
                        console.log(error);
                      }else{
                        console.log('답장 보내기 성공');
                      }
                    });
                  }
                  });
                }
              });
            }

          });
        }
    });
    res.end('success');
  });


    //게시글의 제목부분을 눌렀을때 게시글의 내용이 있는 새로운 페이지로 이동
    router.get('/title_content/:id',function(req,res){
      conn.query('select * from postboard where id=?',[req.params.id],function(err,rows){
        res.render('ft_title_content',{rows : rows});
      });
    });

    //게시판 글 보고 쪽지 보내기 get
    router.get('/boardsendmail/:id',function(req,res,next){
      recv_email = req.session.authId;
      var sql = "select * from postboard where id=?";

      conn.query(sql,[req.params.id],function(err,rows){
        res.render('ft_board_send_mail_modal',{title :'쪽지보내기',rows : rows});
      });
    });

    //게시판 글 보고 쪽지 보내기 POST
    router.post('/boardsendmail/:id',function(req,res,next){
      send_email = req.session.authId;
      recv_email = req.body.recv_email;
      content = req.body.content;
      date_sent = req.body.date_sent;

      var sql = "INSERT INTO `ft_mail` (`recv_email`, `send_email`,`content`,`date_sent`) VALUES (?,?,?,?);";
      var sql2 = "SELECT * FROM ft_user WHERE email=?";
      var sql3 = "UPDATE ft_mail SET recv_name = ? where recv_email = ?";
      var sql4 = "UPDATE ft_mail SET send_name = ? where send_email = ?";
      var sql5 = "select * from ft_mail where id = ?"
      if(send_email == recv_email){
        res.end('error');
      }else{
      conn.query(sql, [recv_email, send_email, content, date_sent], function(error, results, fields) {
        if (error) {
          console.log(error);
        } else {
            conn.query(sql2, [recv_email], function (error, results, fields) {
              if(error){
                console.log(error);
              } else {
                var user = results[0];
                recv_name = user.name;
                conn.query(sql3, [recv_name, recv_email], function(error, results,fields){
                  if(error){
                    console.log(error);
                  } else {
                    conn.query(sql2, [send_email],function(error, results, fields){
                      if(error){
                        console.log(error);
                      }else{
                      var user = results[0];
                      send_name = user.name;
                      conn.query(sql4, [send_name, send_email], function(error,results,fields){
                        if(error){
                          console.log(error);
                        }else{
                          console.log('쪽지 보내기 성공');
                        }
                      });
                    }
                    });
                  }
                });
              }

            });
          }
      });
      res.end('success');
    }
    });




  //마이페이지 GET
  router.get('/mypage',function(req,res,next){
    if(req.session.authId){
      user_email = req.session.authId;
      var sql = "select * from ft_user where email = ?"
      var sql2 = "select * from class_info where writer_email = ?";
      var sql3 = "select * from request_ex where app_email = ?";
      conn.query(sql,[user_email],function(err,rows){
        if(err){
          throw err;
        }else{
          conn.query('select * from postboard where writer=?',[req.session.authId],function(err,result){
            if(err)
            throw err;
            else{
              conn.query(sql2,[req.session.authId],function(err,result2){
                conn.query(sql3, [req.session.authId],function(err, result3){
                  res.render('ft_mypage',{ title : '마이페이지', result3 : result3, result2 : result2, result : result,  rows : rows, session : req.session.authId});
                })
              });
            }//else
          });//query
        }//else
      });
    }else{
        res.render('ft_login',{
          title : 'Login'
        }); //render
      }//else
  });



  //회원정보 GET
  router.get('/updateinfo',function(req,res,next){
    if(req.session.authId){
    user_email = req.session.authId;
    var sql = "select * from ft_user where email = ?"
    conn.query(sql,[user_email],function(err,rows){
            res.render('ft_updateinfo',{ title : '정보수정', rows : rows});
        });
      }else{
        res.render('ft_home',{
          title: 'Home'
        });
      }
  });

  //회원정보 수정 POST
  router.post('/updateinfo',function(req,res,next){
    user_email = req.session.authId;
    user_password = req.body.password;
    user_phone=req.body.phone;
    phoneopen=req.body.phoneopen;

    var sql = "UPDATE `ft_user` SET password = ?,phone =?, phoneopen = ? WHERE email = ?";

    conn.query(sql, [user_password, user_phone, phoneopen, user_email], function(error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log('수정성공');
      }
    });

    res.end('{"success" : "Updated Successfully", "status" : 200}');
  });

  //로그아웃 GET
  router.get('/logout',function(req,res,next){
    if(req.session.authId){
    delete req.session.authId;
    req.session.save(function(){
      res.redirect('/first_test/main/1');
    });
  }else{
    res.render('ft_main',{
      title: 'main',
      session : req.session.authId
    });
  }
  });

  //회원가입 GET 111
  router.get('/join1', function(req,res,next){
    res.render('ft_join1',{
      title:'강의교환 회원가입',
      session : req.session.authId
    });
  });

  router.post('/join1',function(req,res,next){
    agree = req.body.agree;
    req.session.agree = agree;

    if(req.session.agree){
      res.end('success');
    }else{
      res.end('error');
    }
  });

  //회원가입 GET 222
  router.get('/join2', function(req,res,next){
    if(req.session.agree){
      res.render('ft_join2',{
        title:'강의교환 회원가입',
        session : req.session.authId
      });
    req.session.destroy(function(){
      req.session;
    });
  }
    else if(!req.session.agree){
      res.redirect('/first_test/join1');
    }

  });

  //회원가입 GET 333
  router.get('/join3', function(req,res,next){
    res.render('ft_join3',{
      title:'강의교환 회원가입',
      session : req.session.authId
    });
  });

  //회원가입 POST222222
  router.post('/join2', function(req, res, next) {
    user_email = req.body.email;
    user_name= req.body.name;
    user_password = req.body.password;
    user_phone=req.body.phone;
    phoneopen=req.body.phoneopen;

    var sql = "INSERT INTO `ft_user` (`email`, `name`,`password`,`phone`,`phoneopen`) VALUES (?, ?,?,?,?);";


    conn.query(sql, [user_email, user_name, user_password, user_phone,phoneopen], function(error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log('results', results);
        req.session.authId = user_email;
        req.session.save(function() {
          console.log('가입 성공');
        });
      }
    });
    res.end('success');
  });


  //로그인 GET
  router.get('/login', function(req,res,next){
    res.render('ft_login',{
      title:'강의교환 로그인'
    });
  });

  //로그인 POST
  router.post('/login', function(req,res,next){
    user_email = req.body.email;
    user_password = req.body.password;

    var sql = "SELECT * FROM ft_user WHERE email=?";
    conn.query(sql, [user_email], function(error,results,fields){
      if(error){
        console.log(error);
      }else{
          var user = results[0];
          if(!user){
            res.end('error');
          }else if(user_password == user.password){
            console.log('same password!');
            req.session.authId = user_email;
            req.session.save(function(){
              console.log('성공');
            });
            res.end('success');
          }else{
            console.log('실패');
            res.end('error');
          }
      }
    });
  });

  //회원탈퇴 GET 111
  router.get('/leave1', function(req,res,next){
    if(req.session.authId){
    res.render('ft_leave1',{
      title:'leave',
      session : req.session.authId
    })
  }else{
        ///res.render('ft_main',{title : 'main', leng : Object.keys(result).length-1, page_num : 10, session : req.session.authId });
  }
  });
  //회원탈퇴 GET 222
  router.get('/leave2', function(req,res,next){
    if(req.session.authId){
    res.render('ft_leave2',{
      title:'leave',
      session : req.session.authId
    })
  }else{
    res.render('ft_main',{
      title: 'main',
      session : req.session.authId
    });
  }
  });

  //회원탈퇴 GET 333
  router.get('/leave3', function(req,res,next){
    if(req.session.authId){
    delete req.session.authId;

  }
    res.render('ft_leave3',{
      title:'leave',
      session : req.session.authId
    });
  });


  //회원탈퇴 POST
  router.post('/leave1', function(req, res, next) {
    user_email = req.session.authId;
    user_password = req.body.password;
    var sql = "DELETE FROM ft_user WHERE email=? AND password=?";
    var sql2 = "SELECT * FROM ft_user WHERE email=?";
    var sql3 = "delete from postboard where writer=?"; //email
    var sql4 = "delete from class_info where writer_email = ?";
    var sql5 = "delete from request_ex where app_email = ?";
    var sql6 = "delete from request_ex where recv_email =?";
    var sql7 = "delete from ft_mail where recv_email = ?";
    var sql8 = "delete from ft_mail where send_email = ?";

    conn.query(sql2, [user_email], function(error,results,fields){
      if(error){
        console.log(error);
      }else{
          var user = results[0];
          if(user_password == user.password){
            conn.query(sql3, [user_email],function(error, results){
              if(error){console.log(error);}
              else{
                conn.query(sql4, [user_email], function(error, results){
                  if(error){console.log(error);}
                  else{
                    conn.query(sql5, [user_email], function(error, results){
                      if(error){console.log(error);}
                      else{
                        conn.query(sql6, [user_email], function(error, results){
                          if(error){console.log(error);}
                          else{
                            conn.query(sql7, [user_email], function(error, results){
                              if(error){console.log(error);}
                            else{
                              conn.query(sql8, [user_email], function(error, results){
                                if(error){console.log(error);}
                                else{
                                  conn.query(sql, [user_email, user_password], function(error, results, fields) {
                                   if (error) {
                                     console.log(error);
                                   } else {
                                     console.log('성공');
                                     res.end('success');
                                   }
                                 });//sql_query
                               }//else
                             });// sql8_query
                           }//else
                         }); //sql7
                        }
                      });//sql6
                    }
                  });//sql5
                }
              });//sql4
            }
            });

          }else{
            console.log('실패');
            res.end('error');
          }
      }
    });
  });

  //이메일 중복체크
  router.post('/emailcheck', function(req, res, next) {
    user_email = req.body.email;
    var sql = "SELECT * FROM ft_user WHERE email=?";

    conn.query(sql, [user_email], function(error,results,fields){
      if(error){
        console.log(error);
      }else{
          var user = results[0];

          if(!user){
            console.log('사용가능한 이메일');
            res.end('success');
          }else if(user_email == user.email){
            console.log('이미 존재하는 이메일');
            res.end('error');
          }
      }
    });//query
  });

//상세 쪽지 모달 - 받은메일함
router.get('/contentViewModal/:id',function(req,res,next){
  var sql = "select * from ft_mail where id = ?";
  var sql2 = "UPDATE ft_mail SET recv_read = 'Y' where id = ?";
  conn.query(sql,[req.params.id],function(error,rows){
    if(error){
      console.log(error);
    }else{
      var selectedrow = rows[0];
      if(selectedrow.recv_read =='N'){
        conn.query(sql2, [req.params.id], function(error,rows){
          if(error){
            console.log(error);
          }else{
            console.log('recv_read N->Y 변경완료');
          }
        });
      }
    }
    res.render('ft_contentViewModal',{title :'받은쪽지상세함',rows : rows});
  });
});


//상세 쪽지 모달 - 보낸메일함
router.get('/SendcontentViewModal/:id',function(req,res,next){
  var sql = "select * from ft_mail where id = ?";
  conn.query(sql,[req.params.id],function(err,rows){
    res.render('ft_SendcontentViewModal',{title :'보낸쪽지상세함',rows : rows});
  });
});

/*
  //마이페이지에서 신청자보기버튼 클릭시 모달
  router.get('/showapp/:fk_class_info_id', function(req,res,next){
    var sql = "select * from request_ex where fk_class_info_id = ?";
    conn.query(sql,[req.params.fk_class_info_id], function(err, results){
      console.log(results);
      res.render('ft_showapp',{title : "신청자보기", results : results});
    });
  });
*/
////////////////////////////test///////////////////////////////
router.get('/showapp_test1111/:fk_class_info_id', function(req,res,next){
  var sql = "select * from request_ex where fk_class_info_id = ?";
  conn.query(sql,[req.params.fk_class_info_id], function(err, results){
    console.log(results);
    res.render('ft_showapp_test1111',{title : "신청자보기", results : results});
  });
});

// mypage 내가 신청한 게시물보기
router.get('/showpost/:id', function(req,res,next){
  var sql = "select * from request_ex where id = ?";
  var sql2 = "select * from class_info where id = ?";
  conn.query(sql, [req.params.id], function(err, results2){
    if(err){console.log(err);}
    else{
      var class_info_id = results2[0].fk_class_info_id;
      conn.query(sql2, [class_info_id], function(err, results){
        res.render('ft_showpost',{title : "게시물보기", results : results});
      });
    }
  });
});

// mypage 내가 신청한 거 신청취소하기
router.get('/requestdelete/:id',function(req,res){
  var sql = "DELETE FROM request_ex WHERE id = ?";
  conn.query(sql,[req.params.id],function(){
    res.redirect('/first_test/mypage');
    console.log('삭제완료');
  });
});

    //수락버튼 get
    router.get('/acceptModal/:id',function(req,res,next){
      recv_email = req.session.authId;
      var sql = "select * from request_ex where id=?";

      conn.query(sql,[req.params.id],function(err,rows){
        res.render('ft_acceptModal',{title :'수락',rows : rows});
      });
    });

    //수락버튼 POST
    router.post('/acceptModal/:id',function(req,res,next){
      send_email = req.session.authId;
      recv_email = req.body.recv_email;
      content = req.body.content;
      date_sent = req.body.date_sent;
      request_id = req.body.request_id;
      var sql = "INSERT INTO `ft_mail` (`recv_email`, `send_email`,`content`,`date_sent`) VALUES (?,?,?,?);";
      var sql2 = "SELECT * FROM ft_user WHERE email=?";
      var sql3 = "UPDATE ft_mail SET recv_name = ? where recv_email = ?";
      var sql4 = "UPDATE ft_mail SET send_name = ? where send_email = ?";
      var sql5 = "select * from ft_mail where id = ?"
      var sql6 = "UPDATE class_info SET request = 'Y' where id = ?";
      var sql8 = "update request_ex set accept = 'N' where fk_class_info_id = ?";
      var sql7 = "UPDATE request_ex SET accept = 'Y' where id = ?";
      conn.query(sql, [recv_email, send_email, content, date_sent], function(error, results, fields) {
        if (error) {
          console.log(error);
        } else {
            conn.query(sql2, [recv_email], function (error, results, fields) {
              if(error){
                console.log(error);
              } else {
                var user = results[0];
                recv_name = user.name;
                conn.query(sql3, [recv_name, recv_email], function(error, results,fields){
                  if(error){
                    console.log(error);
                  } else {
                    conn.query(sql2, [send_email],function(error, results, fields){
                      if(error){
                        console.log(error);
                      }else{
                      var user = results[0];
                      send_name = user.name;
                      conn.query(sql4, [send_name, send_email], function(error,results,fields){
                        if(error){
                          console.log(error);
                        }else{
                          conn.query(sql6, [request_id], function(error, results, fields){
                            if(error){
                              console.log(error);
                            }else{
                              conn.query(sql8, [request_id], function(error,results){
                                if(error){
                                  console.log(error);
                                }else{
                                    conn.query(sql7, [req.params.id], function(error, results){
                                      if(error){console.log(error);}
                                      else{console.log('수락 성공');}
                                    });
                                  }
                              });

                            }
                          });
                        }

                      });
                    }
                    });
                  }
                });
              }

            });
          }
      });
      res.end('success');
    });

  //받은 메일함
  router.get('/recvmailbox',function(req,res,next){
    recv_email = req.session.authId;
    var sql = "select * from ft_mail where recv_email=?";

    conn.query(sql,[recv_email],function(err,rows){
      res.render('ft_recvmailbox',{title :'받은메일함',rows : rows});
    });
  });
  //보낸 메일함
  router.get('/sendmailbox',function(req,res,next){
    send_email = req.session.authId;
    var sql = "select * from ft_mail where send_email=?";

    conn.query(sql,[send_email],function(err,rows){
      res.render('ft_sendmailbox',{title :'보낸메일함',rows : rows});
    });
  });

  //메일함 Get
  router.get('/mailbox',function(req,res,next){
    email = req.session.authId;
    var sql = "select * from ft_mail where recv_email = ?";
    var sql2 = "select * from ft_mail where send_email = ?";
    conn.query(sql, [email], function(err, rows){
      if(err){console.log(err);}
      else{
        conn.query(sql2, [email], function(err,rows2){
          res.render('ft_mailbox',{title :'메일함',rows2 : rows2, rows : rows});
        });
      }
    });
  });

  //쪽지삭제
  router.get('/deletemail/:id',function(req,res,next){
    email = req.session.authId;
    var sql = "select * from ft_mail where id = ?";
    var sql2 = "UPDATE ft_mail SET recv_del = 'Y' where id = ?";
    var sql3 = "UPDATE ft_mail SET send_del = 'Y' where id = ?";
    var sql4 = "DELETE FROM ft_mail WHERE id = ?";
    var recv_del_flag = false;
    var send_del_flag = false;
    conn.query(sql, [req.params.id], function(error,results){
      if(error){
        console.log(error);
      }else {
        var record = results[0];
        if(record.recv_del == 'N'){
          if(record.recv_email == email){
            conn.query(sql2,[req.params.id], function(error){
              if(error){
                console.log(error);
              }else{
                console.log('recv_del N->Y 수정완료');
                recv_del_flag = true;
                if(recv_del_flag == true && record.send_del == 'Y'){
                  conn.query(sql4, [req.params.id], function(error){
                    console.log('삭제완료');
                  });
                }
                res.redirect('/first_test/main/1');
              }
            });
          }
        }
        if(record.send_del =='N'){
          if(record.send_email == email){
            conn.query(sql3,[req.params.id], function(error){
              if(error){
                console.log(error);
              }else{
                console.log('send_del N->Y 수정완료');
                send_del_flag = true;
                if(send_del_flag == true && record.recv_del == 'Y'){
                  conn.query(sql4, [req.params.id], function(error){
                    console.log('삭제완료');
                  });
                }
                res.redirect('/first_test/main/1');
              }
          });
        }
      }//else-if
    }//else
    });

  });

  //메인페이지
  router.get('/main/:page',function(req,res,next){
    var sql1 = 'select * from postboard';
    var sql2 = 'select * from class_info';
    var page = req.params.page;
    var flag = false;
    if(!req.params.page){
      page = 1;
    }
    conn.query(sql1, function(err, result){
      if(err){console.log(err);}
      else{
        conn.query(sql2, function(err, result2){
          if(err){console.log(err);}
          else{
              res.render('ft_main',{title : 'main',result2 : result2, result : result, flag : flag, page : page, leng : Object.keys(result).length-1, leng2 : Object.keys(result2).length-1, page_num : 10, session : req.session.authId });
          }
        });
      }
    });
  });
/*
    //게시판페이지
      router.get('/main/:page', function(req, res, next){
        var page = req.params.page;
        var sql2 = 'select * from class_info';
        conn.query('SELECT * FROM postboard',function(err,result){
          if(err)
          throw err;
          else{
            conn.query(sql2, function(err,result2){
                if(err) throw err;
                else {
                  res.render('ft_main',{title : 'main',result2 : result2, result : result, page : page, leng : Object.keys(result).length-1, page_num : 10 ,session : req.session.authId});
                }
            })
          }
        });
        });
*/
        /*
  //게시판페이지
    router.get('/board/:page', function(req, res, next){
      var page = req.params.page;
      conn.query('SELECT * FROM postboard',function(err,result){
        if(err)
        throw err;
        else{
          res.render('ft_board',{title : 'main', result : result, page : page, leng : Object.keys(result).length-1, page_num : 10 });
        }
      });
      });
*/
  //삭제버튼을 눌렀을때 해당 게시글의 작성자가 맞는경우에만 게시글을 삭제
  router.get('/boarddelete/:id',function(req,res){
    var sql = "DELETE FROM postboard WHERE id = ? and writer =?";
    email = req.session.authId;
    conn.query(sql,[req.params.id, email],function(){
      res.redirect('/first_test/mypage');
      console.log('삭제완료');
    });
  });

  //마이페이지에서 교환완료 게시글삭제버튼 누를때
  router.get('/exchangedelete/:id',function(req,res){
    var sql = "DELETE FROM class_info WHERE id = ?";
    var sql2 = "delete from request_ex where fk_class_info_id = ?";
    conn.query(sql,[req.params.id],function(){
      conn.query(sql2,[req.params.id],function(){
        res.redirect('/first_test/mypage');
        console.log('삭제완료');
    });
  });
});



  //게시판 post
    router.post('/board',function(req,res,next){
      user_choice=req.body.choice;
      user_title=req.body.title;
      user_text=req.body.text;
      user_date=req.body.date;
      user_email=req.session.authId;
    var sql2 = 'select * from ft_user where email = ?'
    var sql='INSERT INTO `postboard`(`choice`,`title`,`date`,`writer`,`text`,`writer_name`) VALUES(?,?,?,?,?,?);';
    conn.query(sql2, [user_email], function(error,results){
      if(error){console.log(error)}
      else{
        var user_name = results[0].name;
        conn.query(sql,[user_choice,user_title,user_date,user_email,user_text,user_name],function(error, results, fields) {
          if (error) {
            console.log(error);
            res.end('error');
          } else {
            console.log('results', results);
            console.log('fields', fields);
            res.end('success');
          }
        }); // conn.query
      }
    });
  });

    //검색기능
    router.get('/search/:page',function(req,res){
      search=req.query.searchText;
      var page = req.params.page;
      var flag = true;
      console.log(search);
      var sql="SELECT * FROM postboard WHERE title LIKE ?";
      var sql2="select * from class_info where class_name LIKE ?";
      conn.query(sql,'%'+search+'%',function(error,result){
        if(error)
        console.log(error);
        else{
          conn.query(sql2,'%'+search+'%', function(error, result2){
            console.log(result);
            console.log('success');
            res.render('ft_main',{result2 : result2 ,result : result, qq : search, page : page,flag : flag, leng : Object.keys(result).length-1, leng2 : Object.keys(result2).length-1, page_num : 10, session : req.session.authId});
          });
        }
      })
    });

    router.get('/findID',function(req,res){
      res.render('ft_findID');
    });

    router.get('/findID_success',function(req,res){
      name = req.query.f_name;
      number = req.query.f_number;
/*
      var name = decodeURIComponent(uri_name);
      var number = decodeURIComponent(uri_number);
*/
      var sql = "select * from ft_user where name =? and phone =?";
      conn.query(sql, [name, number], function(error, result){
        if(error){console.log(error);}
        else{
          console.log(result);
          res.render('ft_findID_success',{result:result});
        }
      });
    });

    router.get('/findpwd_success', function(req,res){
      email = req.query.f_email;
      name = req.query.f_name;
      number = req.query.f_number;

      var sql = "select * from ft_user where email = ? and name = ? and phone =?";
      conn.query(sql, [email, name, number],function(error,result){
        if(error){console.log(error);}
        else{
          console.log(result);
          res.render('ft_findpwd_success', {result:result});
        }
      });
    });

/*
    router.post('/findID_success', function(req, res, next) {
      name = req.body.f_name;
      number = req.body.f_number;
      var sql = "SELECT * FROM ft_user WHERE name=? and phone=?";

      conn.query(sql, [name, number], function(error,results,fields){
        if(error){
          console.log(error);
        }else{
            var result = results[0];
            if(!result){
              console.log('잘못된 유저정보');
              res.end('error');
            }else{
              console.log('success');
              res.end('success');
            }
        }
      });//query
    });

    router.post('/findpwd_success', function(req, res, next) {
      name = req.body.f_name;
      number = req.body.f_number;
      email = req.body.f_email;
      var sql = "SELECT * FROM ft_user WHERE name=? and phone=? and email=?";

      conn.query(sql, [name, number, email], function(error,results,fields){
        if(error){
          console.log(error);
        }else{
            var result = results[0];
            if(!result){
              console.log('잘못된 유저정보');
              res.end('error');
            }else{
              console.log('success');
              res.end('success');
            }
        }
      });//query
    });

    router.get('/findID_success',function(req,res){
      res.render('ft_findID_success');
    });

    router.get('/findpwd_success', function(req,res){
      res.render('ft_findpwd_success');
    });
*/
  return router;
}
