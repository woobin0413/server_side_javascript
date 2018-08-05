module.exports = function(){
  var conn = require('../../config/mysql/config');
  var route = require('express').Router();
  //하나의 파일을 만들기 위한 form tag
  route.get('/add', function(req,res){
    var sql = 'select * from topic'
    conn.query(sql, function(err,topics,field){
      if(err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.render('topic/add',{topics:topics, user:req.user});
      }
    });
  });

  //creating a file that contains 'title' and 'description'
  route.post('/add', function(req,res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'insert into topic (title, description, author) values (?,?,?)';

    conn.query(sql, [title,description,author], function(err,row,field){
      //form 을 생성 후 리다이렉트를 이용해 그 url로 보낸다
      //// DEBUG할시 res.send() 로 한다.
      if(err){
        res.status(500).send('Internal Server Error');
        console.log(err);
      } else {
        res.redirect('/topic/'+row.insertId);
      }
    });
  });

  //내어쓰기 ==  shift tap
  //들여쓰기 ==  tap
  //리스트에서 하나 선택후 수정을 누를시 원래저장되있던 내용을 DB에서가져온다.
  route.get('/:id/edit', function(req,res){
    var sql = 'SELECT * FROM topic';
    conn.query(sql, function(err,topics,field){
      var id = req.params.id;
      if(id) {
        var sql = 'SELECT * FROM topic WHERE id=?';
        conn.query(sql,[id], function(err,topic,field){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            res.render('topic/edit', {topics:topics, topic:topic[0],user:req.user});
          }
        });
      } else {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
    })
  });

  route.get('/:id/delete', function(req,res){
    var sql = 'select * from topic';
    var id = req.params.id;
    conn.query(sql,function(err,topics,field){
      var sql = 'SELECT * FROM topic WHERE id=?'
      conn.query(sql,[id], function(err,topic,field){
        if(err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          if(topic.length==0) {
            console.log('NO RECORD');
            res.status(500).send('Internal Server Error');
          } else {
            res.render('topic/delete', {topics:topics, topic:topic[0],user:req.user});
          }
        }
      });
    });
  });



  //수정 후 완료를 눌렀을시에 업데이트 문이 실행된다.
  route.post('/:id/edit', function(req, res){
    var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
    var id = req.params.id;
    var title = req.body.title;
    var desc = req.body.description;
    var author = req.body.author;
    conn.query(sql, [title,desc,author,id], function(err,row,field){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/topic/'+id)
      }
    });
  });

  //선택된 id 값을 지워준다.
  route.post('/:id/delete', function(req, res){
    var sql = 'DELETE FROM topic WHERE id=?';
    var id = req.params.id;
    conn.query(sql, [id], function(err,row,field){
      res.redirect('/topic/');
    });
  });


  //파일의 목록이 있거나 없을때 중복없이 하나의 get으로 가져온다.
  route.get(['/', '/:id'], function(req, res){
    var sql = 'SELECT * FROM topic';
    conn.query(sql,function(err,topics,field){
      var id = req.params.id;
      if(id) {
        var sql = 'SELECT * FROM topic WHERE id=?'
        conn.query(sql,[id], function(err,topic,field){
          if(err) {
            console.log(er);
            res.status(500).send('Internal Server Error');
          } else {
            res.render('topic/view', {topics:topics, topic:topic[0],user:req.user})
          }
        });
      } else {
        res.render('topic/view', {topics:topics,user:req.user});
      }
    });
    //모든 토픽을 보여줄때
  });

  return route;
}
