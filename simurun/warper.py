#!/usr/bin/env python3

from objectGraphGenerator import *
import time
import os

def send_message(msg):
    pass

current_path = os.getcwd()
esprima_path = os.path.join(current_path, '../esprima-joern/main.js')
os.system(esprima_path + ' "../simplified-github-growl/github-growl-minimal.js"')
path, possiable_pathes = main()

print("Sending a question to human ...")
print("Question: How do you generate `events` object?")
print("Code: {}".format(possiable_pathes))
#time.sleep(2)
#print("Answer: {}".format('[{"payload":{"issue":{"number": 1,"title": "Spelling error in the README file"}}}]'))
send_message(possiable_pathes)
events_obj = input("Answer: ")
source_code_a = open('../simplified-github-growl/github-growl-minimal-a.js').read()
source_code_b = open('../simplified-github-growl/github-growl-minimal-b.js').read()
source_code_new = open('../simplified-github-growl/github-growl-minimal-new.js', 'w')
source_code_new.write(source_code_a)
source_code_new.write('\n' + 'var events = ' + events_obj + ';\n')
source_code_new.write(source_code_b)
source_code_new.close()
os.system(esprima_path + ' "../simplified-github-growl/github-growl-minimal-new.js"')

print("Regenerating Graphs...")
path, possiable_pathes = main()
source_lineno =  16
sink_lineno = 32

result = 'Successfully find a path from source {} to sink {}.'.format(source_lineno, sink_lineno)
print(sty.ef.b + sty.fg.green + "\n{}".format(result) + sty.rs.all)
