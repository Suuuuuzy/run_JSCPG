import os
import sys
import json

mode = sys.argv[1]
if mode =='t':# test
	path = "../demos/"
	path = "/Users/jianjia/Documents/COCO_results/13_doublex_result/detected"
	ids = ["ilgdjidfijkaengnhpeoneiagigajhco"]
else:
	path = sys.argv[1]
	idfile = sys.argv[2]
	with open(idfile) as f:
		ids = json.load(f)

code_cov = {}
# per file represent one seq time setting
for id in ids:
	timefile = os.path.join(path, id, "opgen_generated_files/used_time.txt")
	if not os.path.exists(timefile):
		continue
	with open(timefile) as f:
		c = f.read()
	parts = c.split("\n\n")
	pq_cov = -1
	for part in parts:
		if "policy" not in part:
			continue
		policy = part.split("policy: ")[1].split("\n")[0]
		policy = "policy_" + policy
		if policy not in code_cov:
			code_cov[policy] = {}
		lines = part.split("\n")
		lines = [i.strip() for i in lines]
		line = lines[-1]
		cov = line.split("with code_cov ")[1]
		cov = float(cov.split("% stmt covered####")[0])
		if id in code_cov[policy]:
			if cov > code_cov[policy][id]:
				code_cov[policy][id] = cov
		else:
			code_cov[policy][id] = cov



print(code_cov)
print(str(len(code_cov))+" code_cov")

if mode !='t':# test
	num = idfile.split("/")[-1].split("_")[0]
	oldcode_cov=None
	if os.path.exists(num+".json"):
		with open(num+".json") as f:
			oldcode_cov =json.load(f)
		for key in oldcode_cov:
			if key in code_cov:
				oldcode_cov[key].update(code_cov[key])
		for key in code_cov:
			if key not in oldcode_cov:
				oldcode_cov[key] = code_cov[key]
	if oldcode_cov==None:
		tmp = code_cov
	else:
		tmp = oldcode_cov
	for i in tmp:
		print(i)
		print(len(tmp[i]))
	with open(num+".json", "w") as f:
		json.dump(tmp, f)
else:
	with open("test.json", "w") as f:
		json.dump(code_cov, f)


	# python3 seq_cov.py /media/data2/jianjia/extension_data/unzipped_extensions/ ../100_timeout_ids.json
