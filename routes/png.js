
var fs = require('fs');
var StreamPng = require('streampng');
var request = require('request');
var utils = require('./util');

exports.check = function(req, res){
	if (checkEmail(req.body.data, req.body.email)) {
		res.json({status: 'true'});
	} else {
		res.json({status: 'false'});
	}
}

exports.details = function(req, res){
  getInfo(req.files.file.path, function (data) {
  	res.render('details.html', { 
  		data: data,
  		data_string: JSON.stringify(data)
  	});
  });
};


function getInfo (filePath, callback) {
	var instream = fs.createReadStream(filePath);
	var png = StreamPng(instream);
	png.on('tEXt', function(chunk) { 
		if (chunk.keyword == 'openbadges'){
			// console.log(chunk.text);
			request(chunk.text, function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    // console.log(body);
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
	    	// console.log(algorithm)
	    	// console.log(hash)
	    	// console.log(utils.hash(email + data.salt, algorithm))

	    	return (hash == utils.hash(email + data.salt, algorithm))
	    }
}