const router = require("express").Router({ mergeParams: true })
const express = require("express");
const app = express();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;


const userModel = require('../../../../models/user');


passport.use(new FacebookStrategy({
    clientID: "6356140671179385",
    clientSecret: "fdc3166e84e67112cec055b94d38fb9e",
    callbackURL: 'http://localhost:5518/meta-login/auth/facebook/callback'
}, async (accessToken, refreshToken, profile, done) => {

    const user = await userModel.findOne({ facebookId: profile.id });


    if (!user) {
        const newUser = new userModel({
            facebookId: profile.id,
            name: profile.displayName,
            provider: profile.provider
        });

        await newUser.save();

        done(null, user);
    }
}));

app.use(passport.initialize());
app.use(passport.session());

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: "/meta-login/success",
    failureRedirect: '/meta-login/login'
}));

router.get('/login', (req, res) => {
    res.status(400).send('login Fail');
});
router.get('/success', (req, res) => {
    res.status(200).send('login Success');
});


module.exports = router;