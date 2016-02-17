# -*- coding: utf-8 -*-

import sys
import serial

param = sys.argv
ser = serial.Serial('/dev/ttyUSB0', 9600)
time.sleep(2)
i=1
while(i<len(param)):
    if(param[i] == 7):
        ser.write(param[i])
        while():
            if(ret = 10):
                i++
                ser.write(param[i])
                while():
                    if(ret = param[i]):
                        i++
                        ser.write(param[i])
                        break
                    else:
                        i--
                        break
                break
            else:
                break
    else if(param[i] == 8):
        ser.write(param[i])
        while():
            if(ret = 10):
                i++
                ser.write(param[i])
                while():
                    if(ret = param[i]):
                        i++
                        ser.write(param[i])
                        break
                    else:
                        i--
                        break
                break
            else:
                break
    else:
        ser.write(param[i])
        while():
            if(ret = param[i]):
                i++
                break
            else:
                break