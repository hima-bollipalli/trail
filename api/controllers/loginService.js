'use strict';
var userlog = require('../domain/login');
var Logger = require('bunyan');
var jwt = require('jsonwebtoken');
var validator = require('node-validator');
var log = new Logger.createLogger({
    name: 'log-errors',
    streams: [
        {  level: 'info',
            stream: process.stdout
    },
    {
        level: 'error',
        path: '/my-error.log'
    }],
    serializers: { req: Logger.stdSerializers.req }
});
module.exports = {
    
    getloginDetails: getloginDetails,
   
};



function getloginDetails(req, res) { 

    
     console.log(req.swagger.params.name.value);
     var check=validator.isObject().withRequired('name',validator.isString({message: "Enter valid user id"} ))
     validator.run(check,{"name":req.swagger.params.name.value},function(errcount,errors) {
    
        if(errcount==0){
            (new userlog()).DetailsById(req.swagger.params.name.value,
                function(err, content) {
                                        console.log(content.data);
                    if (err) {
                        var response = { "status": "400", "error": err }
                        res.json(response);
                       
                    } else if (content.data && content.data.length > 0) {
                        var resObj = { "status": "200",  "token": jwt.sign(content.data[0].name, 'RESTFULAPIs') }
                        console.log(resObj)
                        res.json(resObj);
                    } else {
                        var resObj = { "status": "401", "data": { "message": " details not found" } }
                        res.json(resObj);
                    }
                    
                });
        }
           
    })
}