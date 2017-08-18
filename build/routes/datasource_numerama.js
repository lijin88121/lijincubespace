'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FeedParser = require("feedparser");
var request = require('request'); // for fetching the feed

var router = _express2.default.Router();
var count = 0;
var numeramas = [];

router.get('/', function (req, res) {
	var req = request('http://www.numerama.com/feed/');
	req.setMaxListeners(50);
	var feedparser = new FeedParser();

	// Define our handlers
	req.on('response', function (res) {
		if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
		res.pipe(feedparser);
	});

	feedparser.on('error', function (error) {
		res.end();
		console.log(error);
		throw error;
	});

	function parseArticle(rawdata) {
		var numerama = {};
		numerama.title = rawdata.title;
		numerama.url = rawdata.link;
		numerama.content = rawdata.date;
		return numerama;
	}

	feedparser.on('readable', function () {
		if (count < 10) {
			var post;
			while (post = this.read()) {
				numeramas.push(parseArticle(post));
				count++;
			}
		} else {
			res.send(JSON.stringify(numeramas, null, 2));
			res.end();
		}
	});
});

exports.default = router;