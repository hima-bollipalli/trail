'use strict';
var dbconfig = require('../../config/db'),
Ldata = require('../helpers/transformer/logdata');
var rdb = require('rethinkdbdash')({
    pool: true,
    cursor: false,
    port: dbconfig.rethinkdb.port,
    host: dbconfig.rethinkdb.host,
    db: dbconfig.rethinkdb.db
});

const uuidv4 = require('uuid/v4');

userlog.prototype.data = {}

function userlog(data) {
    userlog.prototype.data = data;
}

userlog.prototype.getData = function() {
    return userlog.prototype.data;
}

userlog.prototype.get = function(name) {
    return this.data[name];
}

userlog.prototype.set = function(name, value) {
    this.data[name] = value;
}
userlog.prototype.save = (cb) => {   
    console.log('create ....',userlog.prototype.data);
    var ldata = new Ldata(userlog.prototype.data).getData();
    console.log(ldata)
    rdb.table("userlog").insert(ldata).run().then(function(ldata) {
        cb(null, ldata);
    }).catch(function(e) {
        cb(e);
    })       
}
userlog.prototype.findAll = (cb) =>
{
    
    rdb.table("userlog")
        .run().then(function(result) {
            console.log(result)
            var resObj = { "status": "200", "data": result }
            cb(null, resObj);
        }).catch(function(err) {
            log.error(" Error : %s",JSON.stringify(err));
            cb(response);
        });
                        
}
 

module.exports = userlog;