/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 17-1-5
 * Time: 上午11:01
 * To change this template use File | Settings | File Templates.
 */
var db = require('./db');

module.exports = {
    RoleList:function(callback){
        roleList(function(json){
            callback(json);
        });
    }
};

function roleList(callback){
    var connection = db.createConn();
    var sql = "select rolename,roleid from roles";
    connection.query(sql,function(err,rows){
        var json = '[';
        for(var i = 0 ; i < rows.length;i++)
        {
            var roleid = rows[i].roleid;
            var rolename  = rows[i].rolename;
            if(i >0)
            {
                json +=",";
            }
            json += '{\"roleid\":\"'+roleid+'\",\"rolename\":\"'+rolename+'\"}';
        }
        json += ']';
        callback(json);
    });
}