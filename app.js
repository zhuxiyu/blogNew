var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
// var multer = require('multer');
var routes = require('./routes/index');
var users = require('./routes/users');
var settings = require('./settings');

var app = express();
var passport = require('passport'),
  GithubStrategy = require('passport-github').Strategy;
var fs = require('fs');
var accessLog = fs.createWriteStream('access.log',{flag:'a'});
var errorLog = fs.createWriteStream('error.log',{flag:'a'});

// view engine setup
app.set('port',process.env.PROT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger({stream:accessLog}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (err, req, res, next) {
    var meta = '[' + new Date() +']' + req.url + '\n';
    errorLog.write(meta + err.stack + '\n');
    next();
})

app.use(session({
  secret:settings.cookieSecret,
  key:settings.db,//cookie name
  cookie:{maxAge:1000*60*60*24*30},//30 days
  store:new MongoStore({
    db:settings.db,
    host:settings.host,
    port:settings.port,
    url: 'mongodb://localhost/blog',
  })
}));

// app.use(multer({      //新版不支持改写法
//   dest:'./public/images',
//   rename:function(fieldname,filename){
//     return filename;
//   }
// }))
app.use(passport.initialize()); //初始化 passport
passport.use(new GithubStrategy({
  clientID:"7f684eea3d0931076c10",
  clientSecret:"c744ea1cf48b8be9be7f7bdfeb6018cfc8e79d60",
  callbackURL:"http://localhost:3000/login/github/callback"
},function(accessToken, refreshToken, profile, done){
  done(null,profile);
}))
routes(app);

app.listen(app.get('port'),function () {
  console.log('Express server listening on port '+app.get('port'));
});