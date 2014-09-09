var express = require('express');
var logger = require('morgan');
var address = require('network-address');

var app = express();

app.use(logger('tiny'));
app.use(express.static('../'));

app.listen(9090);
console.info('melchiorjs examples server started on '+address()+':9090');
