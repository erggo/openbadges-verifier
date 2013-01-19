
var fs = require('fs');
var StreamPng = require('streampng');
var request = require('request');
var utils = require('./util');

/*
 * GET users listing.
 */

exports.check = function(req, res){
	// req.body.data
	// req.body.email
	console.log(req.param('data'))
	console.log(req.params)
	console.log(req.body)
	console.log(req.query)
	// var data = JSON.parse(req.body.data);
	var data = JSON.parse(req.param('data'));
	if (checkEmail(data, req.param('email'))) {
		res.json({status: 'true'})
	} else {
		res.json({status: 'false'})
	}
}

exports.details = function(req, res){
  console.log(req.files.file.path)
  getInfo(req.files.file.path, function (data) {
  	// res.json(data);
  	// if (checkEmail(data,"tomas@virgl.net")){
  	// 	// res.body="true";

  	// } else {
  	// 	// res.body="false";
  	// }
  	res.json(data);
  });
};


function getInfo (filePath, callback) {
	var instream = fs.createReadStream(filePath);
	var png = StreamPng(instream);
	png.on('tEXt', function(chunk) { 
		if (chunk.keyword == 'openbadges'){
			console.log(chunk.text);
			
			request(chunk.text, function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    console.log(body);
			    var data = JSON.parse(body);		
			    callback(data);
			  }
			});
		}

	});
	return
}

function checkEmail (data, email) {
	if (data.recipient.indexOf("@") !== -1){
	    	return (data.recipient == email);
	    } else {
	    	var algorithm = data.recipient.split("$")[0];
	    	var hash = data.recipient.split("$")[1];
	    	
	    	console.log(algorithm)
	    	console.log(hash)

	    	console.log(utils.hash(email + data.salt, algorithm))
	    	return (hash == utils.hash(email + data.salt, algorithm))
	    }
}