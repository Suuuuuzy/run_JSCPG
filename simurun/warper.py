from objectGraphGenerator import *
import time

def send_message(msg):
    print(msg)

path, possiable_pathes = main()
print("Sending Result to Human ...")
time.sleep(2)
send_message(possiable_pathes)
input()
print("Regenerating Graphs...")
time.sleep(2)
path, possiable_pathes = main()
print(possiable_pathes)
