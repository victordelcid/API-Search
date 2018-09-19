var express = require('express'),
  app = express(),
  port = process.env.PORT || 3006,
  
  bodyParser = require('body-parser');
  
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  var routes = require('../dev/Routes/route');
  routes(app);

   app.listen(port);

   console.log('Api inicializado en el puerto: ' + port);
   
