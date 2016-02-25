var http = require("http"); // http関連
var socketio = require("socket.io"); // ソケット通信
var fs = require("fs"); // ファイルの読書き
serialport = require('serialport');
var sys = require('sys');
var async = require('async');

var sp = new serialport.SerialPort(/*"/dev/ttyACM0"*/"/dev/tty.usbmodem1421", {
                                   baudrate: 9600,
                                   dataBits:8,
                                   parity:'none',
                                   flowControl:false,
                                   parser: serialport.parsers.readline("\n")
                                   });
console.log('start');
var server = http.createServer(function(req, res) {
                               res.writeHead(200, {"Content-Type":"text/html"}); // 起動直後にhttpヘッダに書き込む内容
                               var output = fs.readFileSync("./index.html", "utf-8"); // index.htmlファイルを読み込む
                               res.end(output); // index.htmlを表示
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


/*パラメーター*/
var returnParam = 15;//切り返し時間
var returnParam2 = 4;//切り返し回数

var auto = true;

function Sleep( T ){
    var d1 = new Date().getTime();
    var d2 = new Date().getTime();
    while( d2 < d1+T ){    //T秒待つ
        d2=new Date().getTime();
    }
    return;
}

function rightAngle(LR){
  var biggestAng=0;
  var biggestValue=9999;
  if(LR == 'left'){
    sp.write(new Buffer(['8']));
    sp.write(new Buffer(['180']));

    for (var i = 90; i <=180; i+=10) {
    var buf=getDistanceByAngle(i);
    if(biggestValue>buf){
      biggestValue=buf;
      biggestAng = i;
    }
  }
  }else{
    sp.write(new Buffer(['8']));
    sp.write(new Buffer(['0']));

    for (var i = 0; i <90; i+=10) {
    var buf=getDistanceByAngle(i);
    if(biggestValue>buf){
      biggestValue=buf;
      biggestAng = i;
    }
  }
  }

  return biggestAng;
}

function getDistanceByAngle(ang){
  var s1=sencer1;
  var s2=sencer1;
  var s3=sencer1;

  return (s1+s2+s3)/3;
}

function autodrive(){
  console.log(automode);
    switch(automode){
        case 0:
            if(sp.isOpen()){

                sp.write(new Buffer(['7']));
                sp.write(new Buffer(['90']));
                sp.write(new Buffer(['8']));
                sp.write(new Buffer(['90']));

                sescount = 0;
                sescount2=0;
                console.log('camera init');
            }
            automode++;
            console.log('0');
            break;
        case 1://壁まで前進

            if(sp.isOpen()){
                if(sencer1>100){
                    sescount++;
                }else{
                    sescount2++;
                }
                if(sescount<3){
                    sp.write(new Buffer(['1']));
                    sp.write(new Buffer(['10']));
                }else{
                    automode++;
                }

                if(sescount2>5){
                    sescount=0;
                    sescount2=0;
                }
            }
            //console.log('1');
            break;
        case 2://左を向く
            sp.write(new Buffer(['0']));
            //console.log('2');

            sp.write(new Buffer(['8']));
            sp.write(new Buffer(['180']));
            automode++;
            delaycounter=0;
            delaycounter2=0;
            break;

        case 3://左が壁かどうか。
            if(delaycounter>10){
                if(sencer1<150){
                    sp.write(new Buffer(['8']));
                    sp.write(new Buffer(['90']));
                    automode=6;
                    delaycounter=0;
                    delaycounter2=0;
                }else{
                    automode++;
                }
            }
            delaycounter++;
            //console.log('3');
            break;

        case 4://右を向く
            sp.write(new Buffer(['8']));
            sp.write(new Buffer(['0']));
            //console.log('4');
            automode ++;
            delaycounter=0;
            break;

        case 5://右が壁かどうか
            if(delaycounter>10){
                if(sencer1<150){
                    sp.write(new Buffer(['8']));
                    sp.write(new Buffer(['90']));
                    automode=7;
                    delaycounter=0;
                    delaycounter2=0;
                }else{
                    console.log('行き止まり');
                    sescount=0;
                    sescount2=0;
                    automode = 11;
                }
            }
            delaycounter++;
            //console.log('5');

            break;

        case 6://バック
            sp.write(new Buffer(['8']));
            sp.write(new Buffer(['90']));
            if(sencer1<120&&delaycounter>5){
                returnCounter1=0;
                returnCounter2=0;
                delaycounter=0;
                delaycounter2=0;
                automode=9;
            }else if(sencer2<100){
                sp.write(new Buffer(['6']));
                sp.write(new Buffer(['2']));
                sp.write(new Buffer(['10']));
            }

            delaycounter++;
            //console.log('6');
            break;

        case 7://バック
            sp.write(new Buffer(['8']));
            sp.write(new Buffer(['90']));

            if(sencer1<120&&delaycounter>5){
                returnCounter1=0;
                returnCounter2=0;
                automode=8;
                delaycounter=0;
                delaycounter2=0;
            }else if(sencer2<100){
                sp.write(new Buffer(['6']));
                sp.write(new Buffer(['2']));
                sp.write(new Buffer(['10']));
            }

            delaycounter++;
            //console.log('7');
            break;

        case 8://右に切り返し
            //console.log('8');
            sp.write(new Buffer(['8']));
            sp.write(new Buffer(['90']));

            if(returnCounter1<returnParam*1&&sencer1<200){
                sp.write(new Buffer(['4']));
                sp.write(new Buffer(['1']));
                sp.write(new Buffer(['10']));
            }else if(returnCounter1<returnParam*2&&sencer2<200){
                sp.write(new Buffer(['5']));
                sp.write(new Buffer(['2']));
                sp.write(new Buffer(['10']));
            }else{
                returnCounter2++;
                returnCounter1=0;

            }

            if(returnCounter2>returnParam2){
                automode = 10;
            }

            returnCounter1++;

            break;


        case 9://左に切り返し
            sp.write(new Buffer(['8']));
            sp.write(new Buffer(['90']));

            if(returnCounter1<returnParam*1){
                sp.write(new Buffer(['5']));
                sp.write(new Buffer(['1']));
                sp.write(new Buffer(['10']));
            }else if(returnCounter1<returnParam*2){
                sp.write(new Buffer(['4']));
                sp.write(new Buffer(['2']));
                sp.write(new Buffer(['10']));
            }else{
                returnCounter2++;
                returnCounter1=0;


            }

            if(returnCounter2>returnParam2){
                automode = 10;
            }

            returnCounter1++;

            break;

            case 10:
              sescount = 0;
              sescount2=0;
              delaycounter=0;
              delaycounter2=0;
              automode = 1;
            break;

          case 11:
            if(sp.isOpen()){
                if(sencer2>100){
                    sescount++;
                }else{
                    sescount2++;
                }
                if(sescount<3){
                    sp.write(new Buffer(['6']));
                    sp.write(new Buffer(['2']));
                    sp.write(new Buffer(['10']));
                }else{
                    automode=1;
                }

                if(sescount2>5){
                    sescount=0;
                    sescount2=0;
                }
            }
            //console.log('11');

          break;



    }
}

io.sockets.on('connection', function(socket) {
              console.log('connected');
              socket.on('command', function(data) {

                        if(sp.isOpen()){
                        sp.write(new Buffer([data.com]));
                        if(data.com!=0 && data.com != 6)console.log('output'+data.com);
                        if(data.subcom!='0'||data.com == 8 ||data.com == 7){
                        sp.write(new Buffer([data.subcom]));
                        console.log('output subcom '+data.subcom);
                        }
                        }
                        });

              sp.on('data', function(input) {
                    var inp = input;
                    var inpB = 'result'+inp;

                    //console.log('count '+count);
                    //console.log(inpB);
                    //console.log(' ');

                     if(!isFinite(inp)){
                      if(count != 2)count = 0;
                      //console.log('a '+Number(inp));
                    }



                    if(count ==1){
                    if(Number(inp)!=null){
                    sencer1 = Number(inp);
                    }
                    }
                    if(count ==3){
                    if(Number(inp)!=null){
                    sencer2 = Number(inp);
                    }
                    }
                    //console.log('count '+count);
                    //console.log('sens1=' + sencer1 + ' sens2=' + sencer2);

                    count++;
                    socket.emit('sencer', {
                                action: 'post',
                                sencer1:sencer1,
                                sencer2:sencer2
                                });
                    });
              socket.on('disconnect', function() {
                        console.log('disconn');
                        });

              socket.on('sens', function() {
                        sp.write(new Buffer(['9']));
                        //console.log('9');
                        if(automode||true)autodrive();
                        });

              });