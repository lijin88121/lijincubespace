'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _datasource_weather = require('./routes/datasource_weather');

var _datasource_weather2 = _interopRequireDefault(_datasource_weather);

var _datasource_amazon = require('./routes/datasource_amazon');

var _datasource_amazon2 = _interopRequireDefault(_datasource_amazon);

var _datasource_stock = require('./routes/datasource_stock');

var _datasource_stock2 = _interopRequireDefault(_datasource_stock);

var _datasource_numerama = require('./routes/datasource_numerama');

var _datasource_numerama2 = _interopRequireDefault(_datasource_numerama);

var _datasource_wiki = require('./routes/datasource_wiki');

var _datasource_wiki2 = _interopRequireDefault(_datasource_wiki);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// PARSE HTML BODY

var app = (0, _express2.default)();
var port = 3000;
var devPort = 3001;

app.use(_bodyParser2.default.json());

if (process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');

    var config = require('../webpack.dev.config');
    var compiler = (0, _webpack2.default)(config);
    var devServer = new _webpackDevServer2.default(compiler, config.devServer);
    devServer.listen(devPort, function () {
        console.log('webpack-dev-server is listening on port', devPort);
    });
}
app.use('/', _express2.default.static(__dirname + '/../public'));
app.use('/js', _express2.default.static(__dirname + '/../node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', _express2.default.static(__dirname + '/../node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', _express2.default.static(__dirname + '/../node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.get('/hi', function (req, res) {
    return res.send('Can you hear me?');
});

app.use('/weather', _datasource_weather2.default);

app.use('/amazon', _datasource_amazon2.default);

app.use('/stock', _datasource_stock2.default);

app.use('/numerama', _datasource_numerama2.default);

app.use('/wiki', _datasource_wiki2.default);

var server = app.listen(port, function () {
    console.log('Express listening on port', port);
});