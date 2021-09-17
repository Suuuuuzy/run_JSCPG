import os
# datapath = "/Volumes/Files/extension_research/data/unzipped_extensions"
import sys
datapath = sys.argv[1]
# datapath = '/Users/jia/Desktop/tmp/EOPG/run_JSCPG/demos'
with open(datapath) as f:
    content = f.read()
files = content.split('\n')
# files = files[0:50]
count = 0
for file in files:
    if os.path.isdir(file):
        count+=1
        print('run extension ' + file + ' starts')
        os.system('./generate_opg.py -t chrome_data_exfiltration -crx -pq -dx --timeout 60 ' + file)
        
