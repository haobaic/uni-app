var express = require('express');
var router = express.Router();
const request = require('request')
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});
//列表
router.get('/list', (req, res) => {
	var {page,limit,tab}=req.query
    request(`https://cnodejs.org/api/v1/topics?page=${page}&limit=${limit}&tab=${tab}`, (err, response, body) => {
      var list = JSON.parse(body);
      res.json({
		  list
	  })
    })
})
//详情
router.get('/details', (req, res) => {
	var id=req.query.id
    request(`https://cnodejs.org/api/v1/topic/${id}?mdrender=true`, (err, response, body) => {
      var list = JSON.parse(body);
      res.json({
		  list
	  })
    })
})
module.exports = router;