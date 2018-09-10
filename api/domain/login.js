'use strict';
var dbconfig = require('../../config/db'),
Ldata = require('../helpers/transformer/ldata');
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

userlog.prototype.DetailsById = (name, cb) => {
    rdb.table("userlog")
        .filter({ 'name': name})
        .run()
        .then(function(result) {            
                var resObj = { "status": "200", "data": result }
                cb(null, resObj);
            })
};

module.exports = userlog;