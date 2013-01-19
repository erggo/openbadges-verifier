var fs = require('fs');
var StreamPng = require('streampng');
var request = require('request');

var instream = fs.createReadStream('62bf162fe34ae1dce23a03f046aba1a2.png');
var png = StreamPng(instream);

png.on('tEXt', function(chunk) { 
	if (chunk.keyword == 'openbadges'){
		console.log(chunk.text);
		
		request(chunk.text, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log(body)
		    JSON.parse(body).salt;
		  }
		});
	}
})



// console.log(chunk);

// var outfile = fs.createWriteStream('example.license.png');
// var license = StreamPng.Chunk.tEXt({
//   keyword: 'License',
//   text: 'CC BY-SA 3.0'
// });

// // add a `License` text chunk if one doesn't already exist.
//  png.inject(license, function(chunk) {
//    if (chunk.get('keyword') === 'License')
//       return false;
// });

// // write output to file
// png.out().pipe(outfile);
