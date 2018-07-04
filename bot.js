// Importing class and instantiating with 'AppID'
// npm install https://products.wolframalpha.com/api/libraries/javascript/wolfram-alpha-api-1.0.0-rc.1.tgz
var WolframAlphaApi = require('wolfram-alpha-api');
var waApi = WolframAlphaApi('AppID');

// Creating Twitter object to connect to Twitter API
// npm install twit
var Twit = require('twit');

//Pulling data from another file
var config = require('./config.js');
//Twit object for connection to API
var T = new Twit(config);
//Sets uo user stream
var stream = T.stream('user');

//When someone follows the bot account
stream.on('follow', followed);

//Funtion that post everytime someone follows the account
function followed(event) {
  var name = event.source.name;
  var screenName = event.source.screen_name
  var message = 'Followed by: @' + screenName;
  T.post('statuses/update', {
    status: message
  }, function(err, data, reponse) {
    console.log(data)
  });
}

//When someone tweets a question to the bot
stream.on('tweet', tweetEvent);

function tweetEvent(eventMsg) {
  // eventMsg is the question
  // Lets us see the tweet data more in depth
  var fs2 = require('fs');
  var json = JSON.stringify(eventMsg, null, 2);
  fs2.writeFile("tweet.json", json, (erro) => {});

  //who is in reply to?
  var replyto = eventMsg.in_reply_to_screen_name;
  //who sent the tweet
  var name = eventMsg.user.screen_name;
  // conversation thread
  var id = eventMsg.id_str;
  //what is the text
  var text = eventMsg.text;
  // answer when Wolfram Alpha API responds
  var answer = '';
  //the final message that is sent back to the user who asked the question
  var replyText = '';

  // get rid of the mention
  text = text.replace(/@William25414953/g, '');

  waApi.getShort(text).then(function(data) {
    //turns the callback to json file in order for us to read it
    var fs = require('fs');
    var json = JSON.stringify(data, null, 2);
    fs.writeFile('data.json', json, (error) => {});
    //answer of data
    answer = data

    if (replyto === 'William25414953') {
      replyText = '@' + name + ' \n Answer: ' + answer;
      //post the response
      T.post('statuses/update', {
        status: replyText,
        in_reply_to_status_id: id
      }, function(err, data, reponse) {
        console.log(data)
      });

    }
  }).catch(console.error);

}
