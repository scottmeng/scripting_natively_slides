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

var HelloWorldModel = (function (_super) {
    __extends(HelloWorldModel, _super);
    function HelloWorldModel() {
        _super.call(this);
        this.counter = 10;
        this.set("message", this.counter + " taps left");
        this.tasks = new observableArray.ObservableArray([]);

        console.log("get json");
        // http.getJSON("http://www.reddit.com/r/aww.json?limit=30")
        //     .then(function (result) {
        //         console.log(result);
        //             // result is JSON Object
        //     });
        
        http.getJSON("http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC")
            .then(function(result) {

              imgSrc = result.data[1].images["fixed_height"].url;
              imgSrc = "http://www.yamaha-keyboard-guide.com/images/36-key-keyboard-notes.jpg";
              console.log(imgSrc);
            });
        // requestTweets();
    }

    function requestTweets() {
        // compute bearer token
        var bearerToken = getTwitterBearerToken();
        twitterAppAuth(bearerToken);
    }

    function getTwitterBearerToken() {
        var CONSUMER_KEY = "uhBZ0SfC0KvAq47dyInLqfacP";
        var CONSUMER_SECRET = "Ygx7SMhdRweSMoHNObQktNMMlVqMKG6qQ4P91ePrMruVkxTXyJ";

        return base64_encode(base64_encode(CONSUMER_KEY).concat(":").concat(base64_encode(CONSUMER_SECRET)));
    }

    function twitterAppAuth(bearerToken) {
        var body = "grant_type=client_credentials";

        var options = {
            hostname: 'api.twitter.com',
            path: '/oauth2/token',
            method: 'POST',
            auth: bearerToken,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': body.length
            }
        };

        var authReq = http.request(options, function(res) {
            res.on('data', function(response) {
                console.log("response: " + response);
            });
        });
        authReq.write(body);
        authReq.end();
    }

    function base64_encode(data) {
      //  discuss at: http://phpjs.org/functions/base64_encode/
      // original by: Tyler Akins (http://rumkin.com)
      // improved by: Bayron Guevara
      // improved by: Thunder.m
      // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // improved by: Rafał Kukawski (http://kukawski.pl)
      // bugfixed by: Pellentesque Malesuada
      //   example 1: base64_encode('Kevin van Zonneveld');
      //   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
      //   example 2: base64_encode('a');
      //   returns 2: 'YQ=='

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
    return HelloWorldModel;
})(observable.Observable);

exports.HelloWorldModel = HelloWorldModel;
exports.mainViewModel = new HelloWorldModel();
