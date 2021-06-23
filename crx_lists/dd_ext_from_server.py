import paramiko
from scp import SCPClient
import sys
import os

def createSSHClient(server, port, user, password):
    client = paramiko.SSHClient()
    client.load_system_host_keys()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(server, port, user, password)
    return client

ssh = createSSHClient("lab.songli.io", 10022, "jianjia", "19283746")
scp = SCPClient(ssh.get_transport())
with open(sys.argv[1]) as f:
    content = f.read()
lines = content.split('\n')
for line in lines:
    name = line.split('/')[-1]
    if os.path.isdir('detected_both/' + name):
        continue
    scp.get(line, 'detected_both/' + name,recursive=True)
scp.close()