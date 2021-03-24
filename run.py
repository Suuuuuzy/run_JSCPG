import os
# datapath = "/Volumes/Files/extension_research/data/unzipped_extensions"
# datapath = '/media/data2/song/extensions/unzipped_extensions'
datapath = '/Users/jia/Desktop/tmp/EOPG/JSCPG/demos'
files = os.listdir(datapath)
files = files[0:10]
count = 0
for file in files:
    if os.path.isdir(os.path.join(datapath, file)):
        print(count, ' extension')
        count+=1
        print('run extension ' + file + ' starts')
        os.system('python3 generate_opg.py -t chrome_data_exfiltration -crx --timeout 10 ' + datapath + '/' + file)
        # with open('crx.log', 'a') as f:
        #     f.write('run extension: ' + file + '\n')
        # 
        