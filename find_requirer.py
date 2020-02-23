import urllib.request, json 
import json
from tqdm import tqdm
base_url = 'https://registry.npmjs.org/' 
names_file = "/media/data2/song/package_list"
names = open(names_file, 'r').readlines()
dependencies = {}
back_dependencies = {}
cnt = 0
for name in tqdm(names):
    try:
        cnt += 1
        name = name.strip()
        with urllib.request.urlopen("{}{}/".format(base_url, name)) as url:
            data = json.loads(url.read().decode())
            latest_version = data['dist-tags']['latest']

            if 'dependencies' not in data['versions'][latest_version]:
                continue

            cur_dep = data['versions'][latest_version]['dependencies']
            dependencies[data['_id']] = cur_dep 
            for p in cur_dep:
                if p not in back_dependencies:
                    back_dependencies[p] = []
                back_dependencies[p].append(name) 
        if cnt % 100 == 0:
            with open('back_dependencies.json', 'w') as outfile:
                json.dump(back_dependencies, outfile)
    except:
        pass
