
module.exports = function(passport) {
  var route = require('express').Router();
  var conn = require('../../config/mysql/config');
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  route.post(
    '/login',
    passport.authenticate(
      'local',
      {
        successRedirect: '/topic',
        failureRedirect: '/auth/login',
        failureFlash: false
      }
    )
  );
  //facebook은 로컬과 다르게 2개의 라우트가 있다.
  //passport가 페북으로 리다이렉션 시킨다. 데이터를 가지고 (url)
  route.get(
    '/facebook',
    passport.authenticate(
      'facebook',
      {scope:'email'}
    )
  );
  //확인을 누르면 다시 콜백이 일어난다.
  //페스포트가 페이스북이 전송한 데이터를 해석해서 콜백을해온다.
  //비동기식 떄문에 로그인 성공하여도 밑에처럼고쳐주어야한다.
  route.get(
    '/facebook/callback',
    passport.authenticate(
      'facebook',
      {
        failureRedirect: '/auth/login'
      }
    ), function(req,res) {
      req.session.save(function(){
        res.redirect('/topic');
      })
    }
  );

  route.post('/register', function(req, res){
    hasher({password:req.body.password}, function(err, pass, salt, hash){
      var user = {
        authID:'local:'+req.body.username,
        username:req.body.username,
        password:hash,
        salt:salt,
        displayName:req.body.displayName
      };
      var sql = "INSERT INTO users SET ?";
      conn.query(sql, user, function(err, results){
        if(err) {
          console.log(err);
          res.status(500);
        } else {
          //passport의 로그인 방식을 사용한다. (no middleware or router) 대신 메소드 사용
          req.login(user, function(err){
            req.session.save(function(){
              res.redirect('/topic');
            });
          })
        }
      });
    });
  });
  route.get('/register', function(req, res){
    var sql = 'SELECT * FROM topic';
    conn.query(sql,function(err,topics,field){
    res.render('auth/register',{topics:topics});
  });
});

  route.get('/login', function(req, res){
    var sql = 'SELECT * FROM topic';
    conn.query(sql,function(err,topics,field){
    res.render('auth/login',{topics:topics});

  });
});

  route.get('/logout', function(req, res){
    req.logout();
    req.session.save(function(){
      res.redirect('/topic');
    });
  });

  return route;
}
