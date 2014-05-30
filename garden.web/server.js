//setup Dependencies
var connect = require('connect')
  , express = require('express')
  , _ = require("underscore")
  , port = (process.env.PORT || 8081);

var pg = require('pg');
var conString = process.env.DATABASE_URL || 'postgres://postgres:test@localhost:5432/garden'



pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('create table if not exists measurement (' +
                'node varchar(60),' +
                'time integer,' +
                'temperature real)',
    [], function(err, result) {
      //call `done()` to release the client back to the pool
      done();
      if(err) {
        return console.error('error running query', err);
      }
  });
  client.query('create table if not exists note (' +
    'uuid text unique, ' +
    'writing text,' +
    'time integer)',
    [], function(err, result) {
      //call `done()` to release the client back to the pool
      done();
      if(err) {
        return console.error('error running query', err);
      }
    });
});



//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: { 
                  title : '404 - Not Found'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX' 
                },status: 404 });
    } else {
        res.render('500.jade', { locals: { 
                  title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                 ,error: err 
                },status: 500 });
    }
});
server.listen( port);


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.get('/', function(req,res){
  res.render('index.jade', {
    locals : { 
              title : 'Your Page Title'
             ,description: 'Your Page Description'
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});


//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

server.post("/rest/measurement", function(req,res){
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('insert into measurement(node, time, temperature) values ($1, $2, $3)',
                 [req.body.node, Math.round(new Date().getTime()/1000), req.body.temperature], function(err, result) {
      done();
      res.end();
      if(err) {
        return console.error('error running query', err);
      }
    });
  });
})

server.post("/rest/note", function(req,res){
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('insert into note(uuid, writing, time) values ($1, $2, $3)',
      [req.body.uuid, req.body.note, Math.round(req.body.time/1000)], function(err, result) {
        done();
        res.end();
        if(err) {
          return console.error('error running query', err);
        }
      });
  });
})
server.get("/rest/note", function(req,res){
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('select * from note',[], function(err, result) {
      res.end(JSON.stringify(_.map(result.rows, function(r){
        return {
          uuid: r.uuid,
          note: r.writing,
          time: r.time
        };
      })));
      done();
      if(err) {
        return console.error('error running query', err);
      }
    });
  });
})

server.get("/rest/measurement", function(req,res){
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('select * from measurement where temperature < 150',[], function(err, result) {
      console.log(JSON.stringify(result.rows))
        res.end(JSON.stringify(result.rows));
        done();
        if(err) {
          return console.error('error running query', err);
        }
      });
  });
})



//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://0.0.0.0:' + port );
