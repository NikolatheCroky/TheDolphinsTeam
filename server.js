//Dependensies
const
express = require('express'),
fs = require('fs'),
io = require('socket.io')(3050)

//Classes and inits
const app = express() 

//Variables
var
db = require('./db.json'),
users = db.users,
msgs = db.messages,
msg_ancs = msgs.private,
msg_main = msgs.main,
msg_prvt = msgs.private,
msg_stf = msgs.staff



setup();

//Chat server

const onUsers = [];

io.on('connection', socket => {

  socket.on('login-attempt', atempt => {
    const r = checkUser(atempt[0], atempt[1])
    if(r === false){
      console.log('Login of ' + atempt[0] + ' is ' + r);
      socket.emit('login-return', [atempt[0], r,  null])
      return
    }
    socket.emit('login-return', [atempt[0], r, users.find(user => user.username === atempt[0]).roles])
  })

  socket.on('message-list-request', data => {
    var abr = [];
    
    if(msg_main.legnth > 20){
      for(var i = (msg_main.length - 20); i < msg_main.length; i++){
        if(i > msg_main.lenght) break;
          abr.push([
            msg_main[i].senderUn,
            msg_main[i].content,
            users.find(user => user.username === msg_main[i].senderUn).avatarURL
        ])
      }
    } else {
      for(var i = 0; i < msg_main.length; i++){
        if(i > msg_main.lenght) break;
          abr.push([
            msg_main[i].senderUn,
            msg_main[i].content,
            users.find(user => user.username === msg_main[i].senderUn).avatarURL,
            i
        ])
      }
    }

    socket.emit('message-list-responce', abr)
    
  })

  socket.on('send-chat-message', message => {
    socket.emit('chat-message', [message[0], message[1], users.find(user => user.username === message[0]).avatarURL, users.find(user => user.username === message[0]).roles])
    db.messages.main.push({
      "senderUn": message[0],
      "content": message[1]
    })
    console.log(message)
    fs.writeFile('./db.json', JSON.stringify(db, null, 4), (err) => {if(err){console.log(err);}})
  })
})

app.listen(3000);/* Opening the server on port 3000. Can be accessed from localhost:3000 internally or TheDolphinsTeam.VITAR.BG externally. */

/* All functions */
function checkUser(username, password) {

  if(username === null || username === ''){
    return false
  }

  var r = false

  for (var i = 0; i <users.length; i++) {
    if ((username == users[i].username) && (password == users[i].password)) {
        r = true;
        break;
    }
  }

  return r;
}

//ExpressJS configuration and setup
function setup(){
  //Setup of pages and public files

  app.get('/res', function (req, res){ res.send('./files: Dev dependency only.')  }) 
  app.use('/res', express.static('public'))

  /*
   * Main page
   */
  app.set('view-engine', 'ejs') 
  app.get('/', function (req, res) { res.render('index.ejs') }) 

  /*
   * Chat
   */
  app.get('/Chat', function (req, res) { res.render('chat/index.ejs')})  /* Main chat */
  app.get('/Chat/Announcements', function (req, res) { res.render('chat/announcements.ejs')  })  /* Announcements */
  //app.get('/Chat/Private', function (req, res) { res.render('chat/pritvate.ejs')  })  /* Private chat */
  //app.get('/Chat/Staff', function (req, res) { res.render('chat/staff.ejs')  })  /* Private staff chat */

  /*
   * Portfolio
   */
  app.get('/portfolio/index0', function (req, res) { res.render('pages/portfolio/i0.ejs')  })  /* Portfolio page one */
  app.get('/portfolio/index1', function (req, res) { res.render('pages/portfolio/i1.ejs')  })  /* Portfolio page two */
  app.get('/portfolio/index2', function (req, res) { res.render('pages/portfolio/i2.ejs')  })  /* Portfolio page three */

  /*
   * Footer pages
   */
  app.get('/footer/Staff', function (req, res) { res.render('pages/footer/Staff.ejs')  })  /* Footer staff list */
  //app.get('/footer/Credits', function (req, res) { res.render('pages/footer/Credits.ejs')  })  /* Footer credits */
  app.get('/footer/File_archive', function (req, res) { res.render('pages/footer/Files_archive.ejs')  })  /* Footer file archive */
  app.get('/footer/Updates', function (req, res) { res.render('pages/footer/Updates.ejs')  })  /* Footer updates info */
  app.get('/footer/Make_a_suggestion', function (req, res) { res.render('pages/footer/Suggestions.ejs')  })  /* Footer suggestions portal */
  app.get('/footer/Report_a_bug', function (req, res) { res.render('pages/footer/Bug_reports.ejs')  })  /*  Footer bug report portal */
}
