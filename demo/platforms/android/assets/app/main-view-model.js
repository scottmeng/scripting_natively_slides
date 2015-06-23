var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var observable = require("data/observable");
var observableArray = require("data/observable-array");
var frameModule = require("ui/frame");
var http = require("http");

var KEY_STATUS = 'status';

var HelloWorldModel = (function (_super) {
    __extends(HelloWorldModel, _super);
    
    function HelloWorldModel() {
        _super.call(this);
        this.counter = 10;
        this.set("message", this.counter + " taps left");
        this.tasks = new observableArray.ObservableArray([]);
        this.accessToken = "logging in...";

        // http.getJSON("http://www.reddit.com/r/aww.json?limit=30")
        //     .then(function (result) {
        //         console.log(result);
        //             // result is JSON Object
        //     });
        
        // http.getJSON("http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC")
        //     .then(function(result) {

        //       imgSrc = result.data[1].images["fixed_height"].url;
        //       imgSrc = "http://www.yamaha-keyboard-guide.com/images/36-key-keyboard-notes.jpg";
        //       console.log(imgSrc);
        //     });
        loginTwitter();
    }

    Object.defineProperty(HelloWorldModel.prototype, "status", {
        get: function () {
            var _this = this;
            if (!this._status) {
              this._status = 'loading...';
              var bearerToken = getTwitterBearerToken();
              twitterAppAuth(bearerToken, function(err, res) {
                if (err) {
                  console.log('twitter app auth on err: ' + e);
                  return;
                }
                console.log(res['token_type']);
                console.log(res);
                console.log(res['access_token']);
                if (res['token_type'] === 'bearer') {
                  _this._accessToken = res['access_token'];
                  console.log(_this._accessToken);
                  _this.status = 'busy';

                  _this.notify({ object: _this, eventName: observable.Observable.propertyChangeEvent, propertyName: KEY_STATUS, value: 'ready' });
                  console.log(_this);
                  console.log(_this._status);
                }
              });
            }
            return this._status;
        },
        enumerable: true,
        configurable: true
    });


    function loginTwitter() {
        // compute bearer token
        var bearerToken = getTwitterBearerToken();
        twitterAppAuth(bearerToken);
    }

    function getTwitterBearerToken() {
        var CONSUMER_KEY = "uhBZ0SfC0KvAq47dyInLqfacP";
        var CONSUMER_SECRET = "Ygx7SMhdRweSMoHNObQktNMMlVqMKG6qQ4P91ePrMruVkxTXyJ";

        return base64_encode(encodeURIComponent(CONSUMER_KEY).concat(":").concat(encodeURIComponent(CONSUMER_SECRET)));
    }

    function twitterAppAuth(bearerToken, callback) {
        console.log(bearerToken);
        var body = "grant_type=client_credentials";
        var _this = this;

        var options = {
            url: "https://api.twitter.com/oauth2/token",
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Content-Length': body.length,
                'Authorization': 'Basic '.concat(bearerToken)
            },
            content: body
        };

        http.request(options)
            .then(function(res) {
              console.log('success');
              var response = res.content.toJSON();
              console.log(JSON.stringify(response));
              console.log(response['token_type']);
              console.log(response['access_token']);
              callback(null, response);
            }, function(e) {
              console.log('error');
              console.log(e);
              callback(e);
            });
    }

    function fetchTweets(token, callback) {
      console.log('start fetch tweets');
      console.log(token);

      var options = {
          url: "https://api.twitter.com/1.1/statuses/user_timeline.json?count=5&screen_name=kaizhimeng",
          method: 'GET',
          headers: {
              'Authorization': 'Bearer '.concat(token)
          }
      };
      console.log('about to start');
      console.log(options);

      http.request(options)
          .then(function(res) {
            console.log('fetch tweets success');
            callback(null, res.content.toJSON());
          }, function(err) {
            console.log('fetch tweets failed');
            console.log(e);
            callback(e);
          });
    };

    function base64_encode(data) {
      var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = '',
        tmp_arr = [];

      if (!data) {
        return data;
      }

      do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
      } while (i < data.length);

      enc = tmp_arr.join('');

      var r = data.length % 3;

      return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
    }

    HelloWorldModel.prototype.tapAction = function () {
        this.counter--;
        this.tasks.push({'name': this.counter});
        if (this.counter <= 0) {
            this.set("message", "Hoorraaay! You unlocked the NativeScript clicker achievement!");
        }
        else {
            this.set("message", this.counter + " taps left");
        }
    };
    HelloWorldModel.prototype.navToList = function() {
        frameModule.topmost().navigate({
            moduleName: "list-page",
            context: 'test'
        });
    };

    HelloWorldModel.prototype.fetchTweets = function() {
      console.log('fetch tweets start');
        fetchTweets(this._accessToken, function(err, res) {
          if (err) {
            return;
          }
          console.log(res);
        });
    };
    return HelloWorldModel;
})(observable.Observable);

exports.HelloWorldModel = HelloWorldModel;
exports.mainViewModel = new HelloWorldModel();
