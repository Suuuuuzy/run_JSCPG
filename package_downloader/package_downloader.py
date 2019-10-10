import subprocess
import json

with open("./xss.csv", 'r') as fp:
    for line in fp.readlines():
        package_name = line.split(',')[0]
        package_version = line.split(',')[1].strip()
        print(package_name, package_version)
        print('npm install {}@{}'.format(package_name.lower(), package_version))
        subprocess.check_call('npm install {}@{}'.format(package_name.lower(), package_version), shell=True)
        
