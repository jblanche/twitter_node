var sys = require('sys')
var restler   = require('./vendor/restler/lib/restler');

function TweetHose(options){
  this.options = options;

  if (!options.username || !options.password || !options.filterParams)
    throw new Error("username, password and filterParams must be specified");

  var urlString = "http://" +
                  options.username +
                  ":" +
                  options.password +
                  "@stream.twitter.com" +
                  "/1/statuses/filter.json"

  var stream = restler.post(urlString, { data : options.filterParams } )
  var twitterEmitter = this;


  var previous = "";

  stream._responseHandler = function(response){
    response.setBodyEncoding("utf8");
    response.addListener("body", function(newStatus){
      var tweets = newStatus.split("\r\n")
      for(var i = 0; i < tweets.length; i++){
        var tweet = previous + tweets[i];
        if (tweet.length == 0) continue;
        try {
          var result = JSON.parse(tweet);
          previous = ""
          twitterEmitter.emit("newTweet", result);
        } catch(e) {
          previous = tweet;
        }
      }
    })
  }
}

process.inherits(TweetHose, process.EventEmitter);

exports.TweetHose = TweetHose;
