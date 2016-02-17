# -*- coding: utf-8 -*-
import sys
import os

ser = serial.Serial('/dev/ttyUSB0', 9600)
time.sleep(2)
print "起動"

while 1:
	f = open('com.txt')
	comLines = f.read()  # ファイル終端まで全て読んだデータを返す
	f.close()
	os.remove('./com.txt')

    coms = comLines.split('\n')
    for com in coms:
        if(com == 7):
            ser.write(chr(7))

