import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as OpenIDConnectStrategy } from 'passport-openidconnect';
import { Strategy as DiscordStrategy } from 'passport-discord';
// Nota: Si no tienes instalada la de twitter de superface, usa la normal de passport-twitter
import { Strategy as TwitterStrategy } from '@superfaceai/passport-twitter-oauth2';

const router = express.Router();
// Estrategia Facebook
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'photos', 'email']
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// Estrategia GitHub
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.CALLBACK_URL}/github/callback`,
  scope: ['openid', 'profile', 'email'],
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// Estrategia LinkedIn con OpenID Connect
passport.use('linkedin', new OpenIDConnectStrategy({
  issuer: 'https://www.linkedin.com/oauth',
  authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
  userInfoURL: 'https://api.linkedin.com/v2/userinfo',
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: `${process.env.CALLBACK_URL}/linkedin/callback`,
  scope: ['openid', 'profile', 'email']
}, (issuer, profile, done) => {
  return done(null, profile);
}));

// Estrategia Twitter (OAuth 2.0)
passport.use(new TwitterStrategy({
  clientID: process.env.TWITTER_API_KEY,
  clientSecret: process.env.TWITTER_API_SECRET,
  clientType: 'confidential',
  callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// Estrategia Discord
passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: `${process.env.CALLBACK_URL}/discord/callback`,
  scope: ['identify', 'email']
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// Serialización
passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((obj, done) => { done(null, obj); });

// Rutas de autenticación
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => { res.redirect('/profile'); }
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => { res.redirect('/profile'); }
);

router.get('/linkedin', passport.authenticate('linkedin'));
router.get('/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/' }),
  (req, res) => { res.redirect('/profile'); }
);

router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  (req, res) => { res.redirect('/profile'); }
);

router.get('/discord', passport.authenticate('discord'));
router.get('/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => { res.redirect('/profile'); }
);

router.get('/logout', (req, res) => {
  req.logout(() => { res.redirect('/'); });
});

export default router;