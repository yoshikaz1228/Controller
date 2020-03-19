#include <Servo.h>  //サーボ駆動に必要
#include <MsTimer2.h>  //タイマー


Servo servo0;  //サーボ0宣言
Servo servo1;  //サーボ1宣言

//ピン番号（後で修正） const修飾子(プログラム中変更不可、定数)
const int advance = 0;  //前進
const int backward = 1;  //後退
const int rightTurn = 2;  //右折
const int leftTurn = 3;  //左折
const int servo_00 = 4;  //サーボモータ0
const int servo_01 = 5;  //サーボモータ1
//ピン番号:アナログピン
const int DSensor_00 = 0;  //距離センサ0
const int DSensor_01 = 1;  //距離センサ1
const int DSensor_02 = 2;  //距離センサ0

int angle0 = 90;  //サーボモータ0角度
int angle1 = 90;  //サーボモータ1角度

int drive1 = 0;  //0:停止, 1:前進, 2:後退
int drive2 = 0;  //0:直進, 1:右, 2:左
int drivePWM = 0; //前進後退のデューティ比(0~10 0:停止, 10:100%駆動)

int sensor0 = 0;  //距離センサ0 値
int sensor1 = 0;  //距離センサ1 値
int sensor2 = 0;  //距離センサ2 値


int PWM0 = 0;
const byte ack = 10;

void drive() {
	static int i = 0;
	if(drive2 == 0){
		digitalWrite(rightTurn, LOW);
		digitalWrite(leftTurn, LOW);
	}else if(drive2 == 1){
		digitalWrite(rightTurn, HIGH);
		digitalWrite(leftTurn, LOW);
	}else if(drive2 == 2){
		digitalWrite(rightTurn, LOW);
		digitalWrite(leftTurn, HIGH);
	}

	if(drive1 == 0 || i >= drivePWM){
		digitalWrite(advance, LOW);
		digitalWrite(backward, LOW);
	}else if(drive1 == 1){
		digitalWrite(advance, HIGH);
		digitalWrite(backward, LOW);
	}else if(drive1 == 2){
		digitalWrite(advance, LOW);
		digitalWrite(backward, HIGH);
	}

	i++;
	if(i == 10) i = 0;
}

void setup() {  //初期設定
	pinMode(advance, OUTPUT);  //highで前進
	pinMode(backward, OUTPUT);  //highで後退
	pinMode(rightTurn, OUTPUT);  //highで右折
	pinMode(leftTurn, OUTPUT);  //highで左折

	servo0.attach(servo_00);  //サーボモータ0
	servo1.attach(servo_01);  //サーボモータ1

	Serial.begin(9600);  //ラズパイ通信

	MsTimer2::set(10, drive); //10ms*10でPWM制御
	MsTimer2::start();
}

void loop() {  //メイン
		byte Mode = 0; //動作モード  0:停止, 1:前進, 2:後退, 3：ブレーキ, 4:右折, 5:左折, 6:直進, 7:サーボ0, 8:サーボ1, 9:距離センサ値受け取り
		if(Serial.available() > 0){
		Mode = Serial.read();  /*動作モード受信*/
		if(Mode == 0){
			//停止
			Stop();
		}else if(Mode == 1){
			/*PWM値受信*/
			Serial.println(ack);
			while(Serial.available() == 0){
			}
			PWM0 = Serial.read();
			//前進
			Advance(PWM0);
		}else if(Mode == 2){
			/*PWM値受信*/
			Serial.println(ack);
			while(Serial.available() == 0){
			}
			PWM0 = Serial.read();
			//後退
			Backward(PWM0);
		}else if(Mode == 3){
			//ブレーキ
			brake();
		}else if(Mode == 4){
			//右折
			drive2 = 1;
		}else if(Mode == 5){
			//左折
			drive2 = 2;
		}else if(Mode == 6){
			//直進
			drive2 = 0;
		}else if(Mode == 7){
			/*角度値受信*/
			Serial.println(ack);
			while(Serial.available() == 0){
			}
			angle0 = Serial.read();
			//サーボ0
			servo0.write(angle0);
		}else if(Mode == 8){
			/*角度値受信*/
			Serial.println(ack);
			while(Serial.available() == 0){
			}
			angle1 = Serial.read();
			//サーボ1
			servo0.write(angle1);
		}else if(Mode == 9){
			//センサ0~2の値読み取り
			sensor0 = analogRead(DSensor_00);
			sensor1 = analogRead(DSensor_01);
			sensor2 = analogRead(DSensor_02);
			/*センサー0値送信*/
			Serial.println(sensor0);
			/*センサー1値送信*/
			Serial.println(sensor1);
			/*センサー2値送信*/
			Serial.println(sensor2);
		}
		Serial.println(Mode);  /*動作モード送信*/
	}
}

void Advance(int percentage) {  //前進, 引数:0~10
	drivePWM = percentage;
	drive1 = 1;
}

void Backward(int percentage) {  //後退， 引数:0~10
	drivePWM = percentage;
	drive1 = 2;
}

void brake() {  //ブレーキ
	if(drive1 == 1){
		Backward(drivePWM);
		delay(100);
		Stop();
	}else if(drive1 == 2){
		Advance(drivePWM);
		delay(100);
		Stop();
	}
}

void Stop() {  //移動停止
	drive1 = 0;
	drive2 = 0;
	drivePWM = 0;
}
