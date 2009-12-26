var sys   = require('sys'),
    http  = require('http');

var TweetHose = require('../tweet_hose').TweetHose;
var config    = require('../config').configuration;

var Module = this.Module = function(data, connection){
};

Module.prototype.onData = function(data, connection){
  var tweetHose = new TweetHose(config);
  tweetHose.addListener("newTweet", function(new_tweet){
    json_tweet = JSON.stringify(new_tweet);
    sys.puts(json_tweet);
    connection.send(json_tweet);
  });
};
