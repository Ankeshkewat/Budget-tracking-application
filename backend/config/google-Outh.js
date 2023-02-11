var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport=require('passport');

passport.use(new GoogleStrategy({
    clientID: '349963049201-sbf494upkvi2odqtli89ip28gj76kbm0.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "https://sore-tan-gecko-tam.cyclic.app/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    
    //console.log(profile)
  }
));

module.exports={passport}