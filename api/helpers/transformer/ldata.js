'use strict'

ldata.prototype.login = {};

function ldata(data) {
    ldata.prototype.login = {};
    var typedata;
    if ((typeof data) === "string") {
        typedata = JSON.parse(data);
    } else {
        typedata = data;
    }

    ldata.prototype.login.name = typedata.name;
    ldata.prototype.login.email = typedata.email;
   

}

ldata.prototype.getData = function() {
    return ldata.prototype.login;
}

module.exports = ldata;