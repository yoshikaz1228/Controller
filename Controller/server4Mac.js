var http = require('http'),
fs = require('fs'),
url = require('url'),
qs = require('querystring');
var socketio = require("socket.io"); // ソケット通信
serialport = require('serialport');
var sys = require('sys');
var async = require('async');
var exec = require('child_process').exec;


console.log('start');
var server = http.createServer(function(req, res) {
                                var param_json = url.parse(req.url, true).query;
                                console.log('id='+param_json.id);
                                if(param_json.id == 'mobile'){
                                  res.writeHead(200, {"Content-Type":"text/html"}); // 起動直後にhttpヘッダに書き込む内容
                               var output = fs.readFileSync("./index_s.html", "utf-8"); // index.htmlファイルを読み込む
                               res.end(output); // index.htmlを表示
                             }else{
                               res.writeHead(200, {"Content-Type":"text/html"}); // 起動直後にhttpヘッダに書き込む内容
                               var output = fs.readFileSync("./index.html", "utf-8"); // index.htmlファイルを読み込む
                               res.end(output); // index.htmlを表示
                             }
                               }).listen(process.env.VMC_APP_PORT || 3000); // webサーバで利用するportを自動選択（リモート or ローカル）
var io = socketio.listen(server);
var count = 0;
var sencer1 = 0;
var sencer2 = 0;

var sescount = 0;
var sescount2 = 0;

var automode = 0;

var delaycounter = 0;
var delaycounter2 = 0;

var returnCounter1 = 0;
var returnCounter2 = 0;
var returnCounter3 = 0;

var compas = 90;

var shellCount = 0;

var circleviewCount=0;


/*パラメーター*/
var returnParam = 15;//切り返し時間
var returnParam2 = 2;//切り返し回数
var camsetAngLR = 5;//カメラ左右
var camsetAngUD = 3;//カメラ上下

var auto = false;

    io.sockets.on('connection', function(socket) {
                  console.log('connected');
                  socket.on('command', function(data) {

                            if(true){
                            //sp.write(new Buffer([data.com]));
                            if(data.com!=0 && data.com != 6)console.log('output'+data.com);
                            if(data.subcom!='0'||data.com == 8 ||data.com == 7){
                            //sp.write(new Buffer([data.subcom]));
                            console.log('output subcom '+data.subcom);
                            }
                            }
                            });


                  socket.on('disconnect', function() {
                            console.log('disconn');
                            });

                  socket.on('sens', function() {
                            //sp.write(new Buffer(['9']));

                            });

                  socket.on('auto', function() {
                            console.log('automode');
                            automode=0;
                            auto = !auto;
                            });

                  socket.on('IR', function(data) {
                            console.log('automode');
                            console.log('irsend SEND_ONCE '+data.maker +' '+data.value);
                            exec('irsend SEND_ONCE '+data.maker +' '+data.value, function(err, stdout, stderr){

                                      });
                                 socket.emit('irsend', {
                                  action: 'post'
                                  });
                                  });
                  });