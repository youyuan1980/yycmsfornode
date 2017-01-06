/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 17-1-5
 * Time: 上午11:07
 * To change this template use File | Settings | File Templates.
 */
var express = require('express');
var roles = require('../dal/roles');
var router = express.Router();

router.get('/rolelist',function(req,res,next){
    roles.RoleList(function(json){
        res.send(json);
    });
});


module.exports = router;