var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('admin/index', { title: 'Express',username:'超级管理员'});
});
module.exports = router;
