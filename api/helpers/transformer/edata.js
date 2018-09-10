'use strict'

edata.prototype.employee = {};

function edata(data) {
    edata.prototype.employee = {};
    var typedata;
    if ((typeof data) === "string") {
        typedata = JSON.parse(data);
    } else {
        typedata = data;
    }

    edata.prototype.employee.name = typedata.name;
    edata.prototype.employee.email = typedata.email;
   

}

edata.prototype.getData = function() {
    return edata.prototype.employee;
}

module.exports = edata;