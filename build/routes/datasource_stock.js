'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ystocks = require("ystocks"),
    yahooapi = ystocks();

var router = _express2.default.Router();

router.get('/', function (req, res) {
	function parse(rawdata) {
		var stocks = [];
		var titles = ['Apple Computer Inc', 'Microsoft Corporation', 'Amazon.com, Inc', 'Google Inc'];
		var symbols = ['Apple (AAPL)', 'Microsoft (MSFT)', 'Amazon (AMZN)', 'Google (GOOG)'];
		var images = ['/images/apple.png', '/images/microsoft.png', '/images/amazon.png', '/images/google.png'];
		for (var index = 0; index < rawdata.length; index++) {
			var stock = {};
			stock.title = titles[index];
			stock.price = "$" + rawdata[index].Ask + " USD";
			stock.percentage = rawdata[index].PercentChange;
			stock.stockname = symbols[index];
			stock.image = images[index];
			if (parseFloat(stock.percentage) > 0) {
				stock.increased = 'true';
			} else {
				stock.increased = 'false';
			}
			stocks.push(stock);
		}
		return stocks;
	}

	yahooapi.quote(['AAPL', 'MSFT', 'AMZN', 'GOOG'], function (err, data, meta) {
		if (err) {
			res.end();
			console.log(err);
			throw err;
		} else {
			res.send(JSON.stringify(parse(data), null, 2));
			res.end();
		}
	});
});

exports.default = router;