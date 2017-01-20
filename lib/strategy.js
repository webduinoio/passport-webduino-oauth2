var util = require('util'),
  OAuth2Strategy = require('passport-oauth2');

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://id.webduino.io/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://id.webduino.io/oauth/token';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'webduino';
  this._userProfileURL = options.userProfileURL || 'https://id.webduino.io/profile';
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    if (err) {
      return done(err);
    }

    var json;
    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    json.provider = 'webduino';
    json._raw = body;
    done(null, json);
  });
}

module.exports = Strategy;
