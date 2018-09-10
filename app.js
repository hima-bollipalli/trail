'use strict';
//changes to test
//change in remote
//change from local
const dotenv = require('dotenv');
dotenv.load();
var SwaggerRestify = require('swagger-restify-mw'),
    restify = require('restify'),
    dbUtils = require('./api/helpers/db/db'),
    jsonwebtoken = require("jsonwebtoken");

    
var app = restify.createServer(),
port = "8089";
app.use(restify.queryParser());
app.use(restify.bodyParser());
app.pre(function(req, res, next) {
    req.log.info({ req: req }, 'REQUEST');
    next();
});

dbUtils.initDB();
var config = {
    appRoot: __dirname,
    swaggerSecurityHandlers: {
        UserSecurity: function(req, authOrSecDef, scopesOrApiKey, next) { 
            console.log("enter to security")
            if (req.headers && req.headers.authorization ) {
                 console.log(req.user)
                 jsonwebtoken.verify(req.headers.authorization, 'RESTFULAPIs', function(err, decode) {
                     console.log(req.user)
                    if (err) req.user = undefined;
                        req.user = decode;
                        console.log(req.user)
                         return next();
                    });
          
                } else {
            req.user = undefined;
            return next();
            }
          
        }
    }
  };
  
  SwaggerRestify.create(config, function(err, swaggerRestify) {
    if (err) { throw err; }
  
    swaggerRestify.register(app);    
    app.listen(port);
     if (swaggerRestify.runner.swagger.paths['/swagger']) {
      console.log('try this:\ncurl http://127.0.0.1:' + port );
    }
  });

module.exports = app; 
