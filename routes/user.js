/**
 * Created by Administrator on 16-11-4.
 */
var express = require('express');
var user = require('../dal/user');
var router = express.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/lefttree', function (req, res, next) {
    user.ShowMenuByJson('admin', function (json) {
        res.send(json);
    });
});

router.get('/userlist', function (req, res, next) {
    res.render('admin/user/userlist');
});

router.get('/main', function (req, res, next) {
    res.render('admin/user/main');
});

router.get('/getuserinfo', function (req, res, next) {
    user.main('admin', function (data) {
        var json = '{\"userid\":\"' + data["userid"] + '\",\"username\":\"' + data["username"] + '\",\"rolename\":\"' + data["rolename"] + '\"}';
        res.send(json);
    });
});

router.post('/userlistdata', function (req, res, next) {
    var pageindex = req.body.page;
    var pagesize = req.body.rows;
    var tbuser = '';
    if (req.body.userlist_userid) {
        tbuser = req.body.userlist_userid;
    }
    user.UserListData(pageindex, pagesize, tbuser, function (data) {
        res.send(data);
    });
});

router.post('/restuserpwd',function(req,res,next){
    var userid = req.body.userid;
    if (userid) {
        user.RestPwd(userid, function (result) {
            if (result == 1) {
                res.send('重置成功');
            }
            else {
                res.send('重置失败');
            }
        });
    }
});

router.post('/deleteuser', function (req, res, next) {
    var userid = req.body.userid;
    if (userid) {
        user.delUser(userid, function (result) {
            if (result == 1) {
                res.send('删除成功');
            }
            else {
                res.send('删除失败');
            }
        });
    }
});

router.post('/adduser',function(req,res,next){
    var userid = req.body.userid;
    var username = req.body.username;
    var roles = req.body.roles;
    user.AddUser(userid,username,roles,function(json){
        res.send('{\"xx\":\"1212\"}');
    });
});

module.exports = router;
