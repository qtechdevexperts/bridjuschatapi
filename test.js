var http = require('https');



var host = "127.0.0.1";

var port = "3001";



var server = http.createServer(function(req, res){

    res.statusCode = 200;

    res.statusHeader = ('Content-Type', 'text/plain');

    res.end("Hello World!!!");

});



server.listen(port, host, function(){

    console.log("Server running on port" + port);

});
