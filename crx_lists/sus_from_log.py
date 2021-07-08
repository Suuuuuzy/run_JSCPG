fin = open('crx_src_sink_not_runned_1.log')
lines = fin.read()
lines = lines.split('\n')
ext = []
for line in lines:
    if line.startswith('==========='):
        ext.append(line.split('===========')[1])
with open('not_runned_suspicous_1.list', 'w') as fout:
    for line in ext:
        fout.write(line + '\n')


