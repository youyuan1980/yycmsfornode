/**
 * Created by youyuan on 16/10/30.
 */
var dbconfig = require('../conf/dbconfig');
var mysql = require('mysql');
var async = require('async');

module.exports = {
    createConn:function()
    {
        var connection = mysql.createConnection(
            dbconfig.sqlconfig
        );
        return connection;
    },
    execTrans:function(sqlparamsEntities, callback) {
        var pool = mysql.createPool({
            host: "localhost",
            user: "root",
            password: "123456",
            database: "yycmsfortp",
            connectionLimit: 10,
            port: "3306",
            waitForConnections: false
        });
        pool.getConnection(function (err, connection) {
            if (err) {
                return callback(err, null);
            }
            connection.beginTransaction(function (err) {
                if (err) {
                    return callback(err, null);
                }
                console.info("开始执行transaction，共执行" + sqlparamsEntities.length + "条数据");
                var funcAry = [];
                sqlparamsEntities.forEach(function (sql) {
                    var temp = function (cb) {
                        connection.query(sql, function (tErr, rows, fields) {
                            if (tErr) {
                                connection.rollback(function () {
                                    console.log("事务失败，ERROR：" + tErr);
                                    throw tErr;
                                });
                            } else {
                                return cb(null, 'ok');
                            }
                        })
                    };
                    funcAry.push(temp);
                });

                async.series(funcAry, function (err, result) {
                    console.log("transaction error: " + err);
                    if (err) {
                        connection.rollback(function (err) {
                            console.log("transaction error: " + err);
                            connection.release();
                            return callback(err, null);
                        });
                    } else {
                        connection.commit(function (err, info) {
                            console.log("transaction info: " + JSON.stringify(info));
                            if (err) {
                                console.log("执行事务失败，" + err);
                                connection.rollback(function (err) {
                                    console.log("transaction error: " + err);
                                    connection.release();
                                    return callback(err, null);
                                });
                            } else {
                                connection.release();
                                return callback(null, info);
                            }
                        })
                    }
                })
             });
        });
    }
};