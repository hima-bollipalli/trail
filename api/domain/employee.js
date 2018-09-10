'use strict';
var dbconfig = require('../../config/db'),
Edata = require('../helpers/transformer/edata');
/*var Logger=require('bunyan');
var log=new Logger.createLogger({
    name:'family-labs',
    serializers: { req: Logger.stdSerializers.req }

});*/
var rdb = require('rethinkdbdash')({
    pool: true,
    cursor: false,
    port: dbconfig.rethinkdb.port,
    host: dbconfig.rethinkdb.host,
    db: dbconfig.rethinkdb.db
});

const uuidv4 = require('uuid/v4');

employee.prototype.data = {}

function employee(data) {
    employee.prototype.data = data;
}

employee.prototype.getData = function() {
    return employee.prototype.data;
}

employee.prototype.get = function(name) {
    return this.data[name];
}

employee.prototype.set = function(name, value) {
    this.data[name] = value;
}

/**
 * save family details
 */
employee.prototype.save = (cb) => {   
    console.log('create employee model....',employee.prototype.data);
    //var edata = JSON.parse(employee.prototype.data);
    var edata = new Edata(employee.prototype.data).getData();
    console.log(edata)
    rdb.table("employee").insert(edata).run().then(function(edata) {
        cb(null, edata);
    }).catch(function(e) {
        cb(e);
    })       
}
employee.prototype.findAll = (cb) =>
{
    var response = {
        message: "Cannot Get all Details.",
        statusCode: 404,
        errorCode: "code1"
    }
    rdb.table("employee")
        //.orderBy('eId')
        .run().then(function(result) {

            console.log(result)
            var resObj = { "status": "200", "data": result }
            cb(null, resObj);
        }).catch(function(err) {
            log.error("TraceId : %s, Error : %s", traceId, JSON.stringify(err));
            cb(response);
        });
                        
}
 /* get badge details by badgeId
 */
employee.prototype.DetailsById = (eId, cb) => {
    /*var response = {
        message: "Cannot Get Details by Id" + eId,
        statusCode: 404,
        errorCode: "code1"
    }*/
    rdb.table("employee")
        .filter({ 'eId': eId})
        .run()
        .then(function(result) {            
                var resObj = { "status": "200", "data": result }
                cb(null, resObj);
            })
};
employee.prototype.updateDetails = (eId,cb) => {
    var edata = new Edata(employee.prototype.data).getData();
edata.updatedDTS = new Date();
    rdb.table("employee").filter({ 'eId': eId})
        .update(edata).run().then(function(result) {
            cb(null, result);
        }).catch(function(err) {
            //log.error("TraceId : %s, Error : %s", traceId, JSON.stringify(err));
            cb(err);
        })
}
employee.prototype.deleteDetails= (eId, cb) => {
   /* var response = {
        message: "Cannot delete  by Id" + familyId,
        statusCode: 404,
        errorCode: "code1"
    }*/
    rdb.table("employee")
        .filter({ 'eId': eId})
        .delete()
        .run()
        .then(function(result) {   
            console.log("deleted")           
            cb(null,result);  
            console.log(result.data)          
        }).catch(function(err) {
            cb(result);
        });
}
module.exports = employee;