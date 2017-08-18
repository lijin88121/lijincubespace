'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('request'); // for fetching the feed
var cheerio = require('cheerio');
var toText = require("textversionjs");

var router = _express2.default.Router();
// title: 'Steve Jobs',
// content: 'Steve Jobs is a great person...',
// url: 'content1'	
function parse(pages) {
	var wikis = [];
	for (var key in pages) {
		if (pages.hasOwnProperty(key)) {
			var page = pages[key];
			var wiki = {};
			wiki.title = page.title;
			wiki.url = "https://fr.wikipedia.org/wiki?curid=" + page.pageid;
			var textVersion = toText(page.extract);
			wiki.content = textVersion.substring(0, 80) + "..";
			wikis.push(wiki);
		}
	}
	return wikis;
}

router.get('/', function (req, res) {
	request('https://fr.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&generator=random&grnnamespace=0&grnlimit=10', function (error, response, body) {
		if (error) {
			res.end();
			console.log(error);
			throw error;
		} else {
			var obj = JSON.parse(body);
			res.send(JSON.stringify(parse(obj.query.pages), null, 2));
			res.end();
		}
	});
});
// 'http://fr.wikipedia.org/wiki/Special:Randompage'

exports.default = router;