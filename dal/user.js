/**
 * Created by Administrator on 16-11-4.
 */
var db = require('./db');
var crypto = require('crypto');
module.exports = {
    main:function(userid,callback){
        UserInfo(userid,function(data){
            callback(data);
        });
    },
    RestPwd:function(userid,callback){
        restUser(userid,function(data){
            callback(data);
        });
    },
    UserListData:function(pageindex,pagesize,tbuser,callback){
        GetUserListData(pageindex,pagesize,tbuser,function(data){
            var json = '{\"total\":\"'+data["total"]+'\",\"rows\":[';
            for(var i = 0; i< data["rows"].length; i++ )
            {
                var userid = data["rows"][i].userid;
                var username  = data["rows"][i].username;
                if(i >0)
                {
                    json +=",";
                }
                json += '{\"userid\":\"'+userid+'\",\"username\":\"'+username+'\"}';
            }
            json += ']}';
            callback(json);
        });
    },
    delUser:function(userid,callback){
        DelUser(userid,function(result){
            callback(result);
        });
    },
    ShowMenuByJson:function(userid,callback){
        showLeftTree(userid,function(result){
            var json = '[';
            for (var i =0; i < result.length; i++) {
                if (json!="[") {
                    json+=",";
                }
                url="";
                id = result[i].id;
                pid = result[i].pid;
                name = result[i].name;
                isparent = "";
                if (result[i].isparent=="1") {
                    isparent = ",\"isParent\":true";
                }
                if (result[i].url!="") {
                    url=",\"myurl\":\"" + result[i].url + "\"";
                }

                json += "{\"id\":\"" + id + "\",\"pId\":\"" + pid + "\",\"open\":true,\"name\":\"" + name + "\"" + isparent + url + "}";
            };
            json += ']';
            callback(json);
        });
    },
    AddUser:function(userid,username,roles,callback){
        addUser(userid,username,roles,function(result){
            callback(result);
        });
    }
};

function addUser(userid,username,roles,callback)
{
    var roleids = roles.split(',')
    var sqlParamsEntity = [];
    var sql1 = "insert into users(userid,userpassword,username) values('"+userid+"','202cb962ac59075b964b07152d234b70','"+username+"')";
    sqlParamsEntity.push(sql1);
    for(var i = 0;i<roleids.length;i++)
    {
        console.info(roleids[i]);
    }
    db.execTrans(sqlParamsEntity, function(err, info){
        if(err){
            console.error("事务执行失败");
        }else{
            console.log("done.");
        }
        callback('1212');
    })
}

function DelUser(userid,callback)
{
    var connection  = db.createConn();
    var sql = "delete from users where userid = '"+userid+"'";
    connection.query(sql,function(err,result){
        if(err) throw err;
        callback(result.affectedRows);
    });
}

function restUser(userid,callback)
{
    var md5 = crypto.createHash('md5');
    var password = md5.update('1234').digest('hex');
    var connection  = db.createConn();
    var sql = "update users set userpassword = '"+password+"' where userid = '"+userid+"'";
    connection.query(sql,function(err,result){
        if(err) throw err;
        callback(result.affectedRows);
    });
}

function showLeftTree(userid,callback)
{
    var connection = db.createConn();
    var sql="select id,name,pid,isparent,url from menu where roleid ='' or roleid in ( select roleid from userinrole where userid='"+userid+"') order by menuorder";
    connection.query(sql, function(err, rows) {
        if (err) throw err;
        callback(rows);
    });
}

function GetUserListData(pageindex,pagesize,tbuser,callback)
{
    var data = [];
    var connection = db.createConn();
    var sql = "select count(*) as zs from users where userid like '%"+tbuser+"%' or username like '%"+tbuser+"%' ";
    connection.query(sql,function(err,rows){
        if (err) throw err;
        data["total"] = rows[0]["zs"];
        GetUserListDataForList(pageindex,pagesize,tbuser,function(userlistdata){
            data["rows"] = userlistdata;
            callback(data);
        });
    });
}

function GetUserListDataForList(pageindex,pagesize,tbuser,callback)
{
    var connection = db.createConn();
    var sql = "select userid,username from users where userid like '%"+tbuser+"%' or username like '%"+tbuser+"%'";
    sql += " order by uptime desc";
    sql += " limit "+ (pageindex - 1) * pagesize + " ," +pagesize;
    connection.query(sql,function (err,rows){
        if (err) throw err;
        callback(rows);
    })
}

function UserInfo(userid,callback)
{
    var data = [];
    var connection = db.createConn();
    var sql = "select username from users where userid= '"+userid+"'";
    connection.query(sql, function(err, rows) {
        if (err) throw err;
        data['username'] = rows[0].username;
        data['userid'] = userid;
        RoleInfo(userid,function(rolename){
            data["rolename"] = rolename;
            callback(data);
        });
    });
}

function RoleInfo(userid,callback)
{
    var connection = db.createConn();
    var sql="select rolename from userinrole inner join roles on roles.roleid=userinrole.roleid where userid='"+userid+"'";
    connection.query(sql, function(err, rows) {
        if (err) throw err;
        var rolename = "";
        for(var i=0;i<rows.length;i++)
        {
            if(rolename == "")
            {
                rolename += rows[i].rolename;
            }
            else
            {
                rolename += '、'+rows[i].rolename;
            }
        }
        callback(rolename);
    });
}