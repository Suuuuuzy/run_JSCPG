import os
import json
files = os.listdir(".")
files = [i for i in files if i.endswith(".json")]
res = {}
for i in files:
	with open(i) as f:
		res.update(json.load(f))
with open("data.txt", "w") as f:
	for i in res:
		if i in ["0.5_0_1", "0_0_1", "policy_2", "policy_3", "policy_4"]:
			continue
		all_cov = 0
		for j in res[i]:
			all_cov+=res[i][j]
		ave = all_cov/len(res[i])
		if i=="policy_1":
			name = "0_0_1"
		else:
			name = i
		print(name, ave)
		print(len(res[i]))
		f.write(name + "\t" +  str(ave) + "\n")
