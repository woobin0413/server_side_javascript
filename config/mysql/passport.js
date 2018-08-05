
module.exports = function(app){
  var conn = require('./config');
  var bkfd2Password = require("pbkdf2-password");
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;
  var hasher = bkfd2Password();
  app.use(passport.initialize());
  app.use(passport.session());


  //만약 로그인시 성공했을때 user에는 users[i]가들어간다.
  //세션에는 user.username 이 저장된다.
  //세션은 파일로 저장되지만 사용자의 회원정보는 메모리상에있기떄문에 휘발성이있다.
  passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user.authID);
  });

  //clinet가 다른페이지나 현재 페이지를 reload할시 deserializeUser로 인자 받은 user.username (세션에 등록된 값을)
  //이용하여 기존에 저장된 데이터와 일치하는 정보를 찾은후 done의 두번째 인자로 user를 전달
  //웹사이트다시접속할때 deserializeUser먼저실행되는게 약속되있어서 저장되있는 사용자의 식별자가 함수에 첫번째 인자의 값에 들어옴 (id)
  //사용자가 접속했을시 deserializeUser만 뜬다.
  passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  var sql = 'SELECT * FROM users WHERE authID = ?';
  conn.query(sql,[id], function(err,results){
    if(err){
      console.log(err);
      done('No user exists')
    } else {
      return done(null, results[0]);
    }
  });
  });

  //이 안에서 콜백함수로 인해서 로컬 전력이 만들어진다 또한 객체를 만든다.
  passport.use(new LocalStrategy(
  function(username, password, done){
    var uname = username;
    var pwd = password;
    var sql = 'SELECT * FROM users WHERE authID=?';
    conn.query(sql,['local:'+uname], function(err, results){
      if(!results[0]) {
        console.log('error : ' + err);
        return done('There is no user');
      }
        var user = results[0];
        return hasher({password:pwd, salt:user.salt}, function(err,pass,salt,hash){
          if(hash === user.password) {
            console.log('LocalStrategy', user);
            done(null,user);
          } else {
            return done('wrong password');
          }
        })
    });
  }
  ));
    // for(var i=0; i<users.length; i++){
    //   var user = users[i];
    //   if(uname === user.username) {
    //     //로그인시 쳣던 비번과 그 아이디값에 맞는 솔트를 찾아서 비밀번호 비교한다.
    //     return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
    //       //비밀번호가 맞으면 세션에 닉네임 넣어줌
    //       if(hash === user.password){
    //         console.log('LocalStrategy', user);
    //         done(null, user);
    //       } else {
    //         done(null, false);
    //       }
    //     });
    //   }
    // }
    //username 일치하는게 없을시
    // done(null, false);

  passport.use(new FacebookStrategy({
    clientID: '1879661032056929',
    clientSecret: '6134c02cf65b88e40505d3ac67676da3',
    callbackURL: "/auth/facebook/callback",
    profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    var authID = 'facebook:'+profile.id;
    sql = 'SELECT * FROM users WHERE authID = ?';
    conn.query(sql,[authID],function(err, results){
      //원소의 수 ({id,username,password}) 등등 데이터가있다면
      if(results.length>0) {
        done(null,results[0]);
      } else {
        var newuser = {
          'authID':authID,
          'displayName':profile.displayName,
          'email':profile.emails[0].value
        };
        var sql = 'INSERT INTO users SET ?'
        conn.query(sql,newuser,function(err,results){
          if(err) {
            console.log(err);
            done('Error');
          } else {
            done(null,newuser);
              }
            })
          }
        })
      }));
  return passport;
}
