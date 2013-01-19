var fs = require('fs');
var StreamPng = require('streampng');
var request = require('request');
var utils = require('./util');

var instream = fs.createReadStream('62bf162fe34ae1dce23a03f046aba1a2.png');
var png = StreamPng(instream);

png.on('tEXt', function(chunk) { 
	if (chunk.keyword == 'openbadges'){
		console.log(chunk.text);
		
		request(chunk.text, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log(body)
		    var data = JSON.parse(body);

		    if (data.recipient.indexOf("@") !== -1){
		    	return (data.recipient == "tomas@virgl.net");
		    } else {
		    	var algorithm = data.recipient.split("$")[0];
		    	var hash = data.recipient.split("$")[1];
		    	
		    	console.log(algorithm)
		    	console.log(hash)

		    	console.log(utils.hash("tomas@virgl.net" + data.salt, algorithm))
		    	return (hash == utils.hash("tomas@virgl.net" + data.salt, algorithm))
		    }
		  }
		});
	}
})
