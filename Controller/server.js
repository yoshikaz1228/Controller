/*var http = require('http');
var serialport = require("serialport");

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');
}).listen(8124);
*/
var sys = require('sys');
var io = require('socket.io').listen(8080);
/*var sp = new serialport.SerialPort("/dev/ttyACM0", {
  baudrate: 115200,
  dataBits:8,
  parity:'none',
  flowControl:false
});*/
sys.print('connect?');
io.sockets.on('connection', function(socket) {
  console.log('onconnection:', socket);

  socket.on('command', function(data) {
    sp.on("open", function () {
      console.log('open');
      setTimeout(function() {
        sp.write(data.com);
        console.log(data.com);
      }, 2000);
    });
    sp.on('data', function(dataa) {
      console.log('data received: ' + dataa);
      if(data==10){
        if(dataa.subcam!='0'){
          sp.write(dataa.subcam);
        }
      }
    });
    console.log(data.com);
    sys.print(data.com);
  });




  socket.on('disconnect', function() {
    console.log('disconn');
  });
});
