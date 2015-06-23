var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

// modules
var observable = require("data/observable");
var observableArray = require('data/observable-array');
var frameModule = require("ui/frame");


var HelloWorldModel = (function (_super) {
    __extends(HelloWorldModel, _super);
    
    function HelloWorldModel() {
        _super.call(this);
        this.counter = 42;
        this.items = new observableArray.ObservableArray([]);
        this.set("items", this.items);
        this.set("message", this.counter + " taps left");
    }

    HelloWorldModel.prototype.tapAction = function () {
        this.counter--;
        if (this.counter <= 0) {
            this.set("message", "Hoorraaay! You unlocked the NativeScript clicker achievement!");
        }
        else {
            this.set("message", this.counter + " taps left");
        }
    };

    HelloWorldModel.prototype.addItem = function() {
        this.items.push({
            'name': 'item',
            'content': this.items.length
        });
    };

    HelloWorldModel.prototype.jumpAway = function() {
        frameModule.topmost().navigate({
            moduleName: "second-page",
            context: {
                'content': this.counter
            }
        });
    };

    return HelloWorldModel;
})(observable.Observable);
exports.HelloWorldModel = HelloWorldModel;
exports.mainViewModel = new HelloWorldModel();
