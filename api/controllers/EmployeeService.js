'use strict';
var Employee = require('../domain/employee');
var Logger = require('bunyan');
var validator = require('node-validator');
var log = new Logger.createLogger({
    name: 'trail-errors',
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
    createEmployee: createEmployee,
    getDetails: getDetails,
    getDetailsById: getDetailsById,
   updateDetails: updateDetails,
  deleteDetails: deleteDetails,

};
function createEmployee(req, res) {
   
    var check=validator.isObject()
    .withRequired('name',validator.isString({message:"Please enter name"}))
    .withOptional('email',validator.isString({message:"enter email.."}))
    var toValidate=req.swagger.params.body.value;
    validator.run(check, toValidate, function(errorCount, errors) {
        if (errorCount == 0) {
    (new Employee(req.swagger.params.body.value)).save(function(err, content) {
        if (err) {
            var response = { "status": "400", "error": err }
            res.json(response);
            log.error("TraceId : %s, Error : %s", traceId, JSON.stringify(err));
        } else {                      
            log.error("create employee called...");
            var response = {};
            response.status = 200;
            response.data = {};
            response.data.message = content.message || "Employee created successfully";
            res.json(response);
        }
    });
    } else {
        var response = { "status": "400", "error": errors }
        res.json(response);
    }
    });
};
//get details by id
function getDetailsById(req,res)
 { 
     console.log(req.swagger.params.eId.value);
     var check=validator.isObject().withRequired('eId',validator.isString({message: "Enter valid Employee id"} ))
     validator.run(check,{"eId": req.swagger.params.eId.value},function(errcount,errors)
    {
        if(errcount==0){
            (new Employee()).DetailsById(req.swagger.params.eId.value,
                function(err, content) {
                                        console.log(content.data);
                    if (err) {
                        var response = { "status": "400", "error": err }
                        res.json(response);
                       
                    } else if (content.data && content.data.length > 0) {
                        var resObj = { "status": "200", "data": content.data }
                        console.log(resObj)
                        res.json(resObj);
                    } else {
                        var resObj = { "status": "200", "data": { "message": " details not found" } }
                        res.json(resObj);
                    }
                    
                });
        }
           
    })
}

function getDetails(req,res)
 {
    var limit = req.limit ? req.limit : 10;
    var page = req.page ? req.page : 1
    var skip = (page - 1) * limit;
    (new Employee()).findAll(
        function(err, content) {
            console.log('content==>',content)
            if (err) {
                var response = { "status": "400", "error": err }
                res.json(response);
               // log.error("TraceId : %s, Error : %s", traceId, JSON.stringify(err));
            } else if (content.data && content.data.length > 0) {
                var resObj = { "status": "200", "data": content.data }
                res.json(resObj);
            } else {
                var resObj = { "status": "200", "data": { "message": "no Details found" } }
                res.json(resObj);
            }
        });
}

function updateDetails(req, res) {
    console.log("update called")  
    console.log(req.user)
 if(req.user === undefined){
    res.set('Content-Employee', 'application/json');
    var resObj = {};
    resObj.status = 401;
    resObj.data = {}
    resObj.data.message = "un authorized user";
    res.json(resObj);
    
    // res.json(resObj);
    // var response = { "status": "401", "error": "user not Authorized"}
    //  res.json(response);
 }else 
 {
     console.log(req.user);
    (new Employee(req.swagger.params.body.value)).updateDetails(req.swagger.params.eId.value,
        function(err, content) {
            if (err) {
                var response = { "status": "400", "error": err }
                res.json(response);
                // log.error("TraceId : %s, Error : %s", traceId, JSON.stringify(err));
            }
            res.set('Content-Employee', 'application/json');
            var resObj = {};
            resObj.status = 200;
            resObj.data = {}
            resObj.data.message = content.message || "updated successfully";
            res.json(resObj);
        });           
    }
};
function deleteDetails(req, res) {
    var eId = req.swagger.params.eId.value;
   
    (new Employee()).deleteDetails(req.swagger.params.eId.value,
        function(err, content) {
            if (err) {
                
                var response = { "status": "400", "error": err }
                res.json(response);
               
            } else if (content) {
                 res.set('Content-Employee', 'application/json');
                var resObj = {};
                resObj.status = 200;
                resObj.data = {};
                resObj.data.message = content.message || "deleted successfully";
                res.json(resObj);
            } 
            
        });
           
    }
