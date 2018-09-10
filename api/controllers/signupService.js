'use strict';
var userlog = require('../domain/signup');
var Logger = require('bunyan');
var validator = require('node-validator');
var isemail = require("isemail");

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
    createSignup: createSignup,
    getsignupDetails: getsignupDetails,
    

};
function createSignup(req, res) {
   
    var check=validator.isObject()
    .withRequired('name',validator.isString({message:"Please enter name"}))
    .withRequired('email',validator.isString({message:"please enter email"}));
    var toValidate=req.swagger.params.body.value;
    console.log(req.swagger.params.body.value);
    var email=req.swagger.params.body.value.email;
    console.log(email);
    var r = isemail.validate(email);
    console.log(r);
    if(r === true){
    validator.run(check, toValidate, function(errorCount, errors) {
        if (errorCount == 0) {
    (new userlog(req.swagger.params.body.value)).save(function(err, content) {
        if (err) {
            var response = { "status": "400", "error": err }
            res.json(response);
            log.error("Error : %s", JSON.stringify(err));
        } else {                      
            log.error("create user called...");
            var response = {};
            response.status = 200;
            response.data = {};
            response.data.message = content.message || "user created successfully";
            res.json(response);
        }
    });
    } else {
        var response = { "status": "400", "error": errors }
        res.json(response);
    }
    });} else {
        res.json("invalid useremail");
        console.log("error");
    }
};




function getsignupDetails(req,res) {
 
    var limit = req.limit ? req.limit : 10;
    var page = req.page ? req.page : 1
    var skip = (page - 1) * limit;
    (new userlog()).findAll(
        function(err, content) {
            console.log('content==>',content)
            if (err) {
                var response = { "status": "400", "error": err }
                res.json(response);
            } else if (content.data && content.data.length > 0) {
                var resObj = { "status": "200", "data": content.data }
                res.json(resObj);
            } else {
                var resObj = { "status": "200", "data": { "message": "no Details found" } }
                res.json(resObj);
            }
        });
}

