'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _weatherJs = require('weather-js');

var _weatherJs2 = _interopRequireDefault(_weatherJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {

	function getWeather(placename) {
		return new Promise(function (resolve, reject) {
			_weatherJs2.default.find({ search: placename, degreeType: 'C' }, function (err, result) {
				if (err) {
					console.log(err);
					return reject(err);
				} else {
					if (result.length > 0) {
						var weather_info = {};
						weather_info.title = result[0].location.name;
						weather_info.temperature = result[0].current.temperature + "°C";
						weather_info.humidity = result[0].current.humidity + "%";
						weather_info.vents = result[0].current.winddisplay;
						weather_info.image = result[0].current.imageUrl;
						return resolve(weather_info);
					} else {
						return reject("No data has been returned.");
					}
				}
			});
		});
	}

	Promise.all([getWeather('La-Corene, QC, Canada'), getWeather('Amos, QC, Canada'), getWeather('Shenyang, Liaoning, China')]).then(function (result) {
		res.send(JSON.stringify(result, null, 2));
		res.end();
	}).catch(function (err) {
		res.end();
		console.log(err);
		throw err;
	});
});

exports.default = router;