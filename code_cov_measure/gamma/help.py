import os
import json
files = os.listdir(".")
files = [i for i in files if i.endswith(".json")]
res = {}
for i in files:
	with open(i) as f:
		res.update(json.load(f))

for i in res:
	all_cov = 0
	for j in res[i]:
		all_cov+=res[i][j]
	ave = all_cov/len(res[i])
	print(i, ave)
	print(len(res[i]))