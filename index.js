'use strict';
var app = require('./app');
var PORT = process.env.PORT || 3412;

var server = app.listen(PORT, () => {
  console.log('Mail Service listening on port %s!', PORT);
});