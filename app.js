var config = require('config');

require('./dist').default.listen(config.port, function () {
  console.log('Server started on port ' + config.port);
  console.log('Open url -  http://localhost:' + config.port);
});
