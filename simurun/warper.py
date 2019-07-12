#!/usr/bin/env python3
from objectGraphGenerator import *
import time

def send_message(msg):
    print(msg)

possiable_pathes = main()
print("Sending Result to Human ...")
time.sleep(2)
send_message(possiable_pathes)
input()
print("Regenerating Graphs...")
time.sleep(2)
possiable_pathes = main()
print(possiable_pathes)
