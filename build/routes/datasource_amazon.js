'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FeedParser = require("feedparser");
var request = require('request'); // for fetching the feed
var cheerio = require('cheerio');

var router = _express2.default.Router();
var count = 0;
var products = [];
router.get('/', function (req, res) {
	var req = request('https://www.amazon.com/gp/rss/bestsellers/electronics/ref=zg_bs_electronics_rsslink');
	req.setMaxListeners(50);
	var feedparser = new FeedParser();

	// Define our handlers
	req.on('response', function (res) {
		if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
		res.pipe(feedparser);
	});

	feedparser.on('error', function (error) {
		console.log(error);
		res.end();
		throw error;
	});

	function parse(rawdata) {
		var product = {};
		// product.title = rawdata.title;
		product.url = rawdata.link;

		var $ = cheerio.load(rawdata.description);
		product.title = $('.riRssTitle').children('a').html();
		product.title = product.title.replace('&quot;', '"');
		product.price = $('font').children('b').html();
		product.image = $('.url').children('img').attr('src');
		return product;
	}

	feedparser.on('readable', function () {
		if (count < 10) {
			var post;
			while (post = this.read()) {
				products.push(parse(post));
				count++;
			}
		} else {
			res.send(JSON.stringify(products, null, 2));
			res.end();
		}
	});
});

exports.default = router;