const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const keys = require('./configkeys');
//require Strategies
  const facebookStrategy = require('passport-facebook').Strategy; //her
  const TwitterStrategy = require('passport-twitter').Strategy;
  const {Facebook_App_Secret} = keys.fbConfig;
  const {Facebook_App_Id} = keys.fbConfig;
  const {TWITTER_CONSUMER_KEY} = keys.twitterConfig;
  const {TWITTER_CONSUMER_SECRET} = keys.twitterConfig;
app.set(express.static(path.join(__dirname+'views')))
app.engine('handlebars', exphbs({defaultLayout:'layout'}));

app.set('view engine', 'handlebars');
app.use(passport.initialize())
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
const fbOpts = {
    clientID : Facebook_App_Id,
    clientSecret : Facebook_App_Secret,
    callbackURL : '/auth/facebook/callback',
    profileFields : ['emails','id','displayName','friends']
    
};
const twitterOpts = {
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "/auth/twitter/callback"
  };
const fbCallback = function(accessToken, refreshToken, profile, cb) {
    var data_fb = JSON.parse(profile._raw)
    console.log('number of friends',data_fb.friends.summary.total_count)
    cb(null,profile)
};
const twitterCallback = function(token, tokenSecret, profile, cb) {   
  var data_twitter = JSON.parse(profile._raw)
  console.log(data_twitter.followers_count)
  cb(null,profile)
}
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
    console.log(req.isAuthenticated())
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.render('index',{user_twitter : ''});
	}
}

app.use(flash())
passport.use(new facebookStrategy(fbOpts,fbCallback))
passport.use('twitter-authz',new TwitterStrategy(twitterOpts,twitterCallback));
app.use(bodyParser.json());
app.use(session({
    secret : 'dcdsadudhfdj',
    resave : true ,
    saveUninitialized : true
}))
app.use(passport.session())
app.get('/',(req,res)=>{
  var display_acc_to_twitter = "none";

    res.render('index',{display_acc_to_twitter})
})

app.get('/share/:name&:data_fb&:data_twitter' ,(req,res)=>{
  res.send(JSON.stringify(req.params))
} )
app.get('/auth/facebook',passport.authenticate('facebook',{scope : [' user_friends ',' user_likes ']}))

app.get('/auth/facebook/callback',passport.authenticate('facebook',{scope : ['user_friends' ,' user_likes ']}),(req,res)=>{
            //  console.log(err);
            console.log('facebook logged')
            var display_acc_to_fb="none";
            display_acc_to_twitter = ''
            res.render('index',{user_fb:req.session.passport.user.displayName ,display_acc_to_fb,display_acc_to_twitter})
            // console.log('auth/facebook/callback');
    
})
app.get('/auth/twitter',
  passport.authorize('twitter-authz', { successRedirect : '/', failureRedirect: '/' })
);
app.get('/auth/twitter/callback',
  passport.authorize('twitter-authz', { successRedirect : '/', failureRedirect: '/' }),
  function(req, res) {
    console.log('twitter logged')
    var data_fb = JSON.parse(req.session.passport.user._raw)
    var data_twitter = JSON.parse(req.account._raw)
    console.log(data_twitter.followers_count)

    var display_acc_to_fb = "none"
    var display_acc_to_twitter = "none"
    var URL = 'http://localhost:3000/share/'+req.account.username+'&'+data_fb+'&'+data_twitter
    res.render('index',{user_fb : req.session.passport.user.displayName ,
      user_twitter : req.account.username,
      display_acc_to_fb,display_acc_to_twitter,
      data_fb : data_fb.friends.summary.total_count,
      data_twitter : data_twitter.followers_count,
      URL:'http://localhost:3000/share/'+req.account.username+'&'+data_fb.friends.summary.total_count+'&'+data_twitter.followers_count
    })
  }
);
app.listen(3000,function(){
    console.log('server fine')
})