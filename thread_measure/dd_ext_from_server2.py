import paramiko
from scp import SCPClient
import sys
import os
import json
from tqdm import tqdm

def createSSHClient(server, port, user, password):
    client = paramiko.SSHClient()
    client.load_system_host_keys()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(server, port, user, password)
    return client

password = 'z*Wks#Q5C98H'
ssh = createSSHClient("10.161.161.14", 30022, "jianjia", password)
scp = SCPClient(ssh.get_transport())
with open("../time_measure/new_5.json") as f:
    content = json.load(f)
ids = content
dst = "extensions/"
cnt = 0
basepath = '/media/data2/jianjia/extension_data/unzipped_extensions/'
for id in tqdm(ids):
    if os.path.isdir(dst+id):
        continue
    scp.get(basepath+id, dst+id,recursive=True)
    cnt+=1
print(cnt)
scp.close()