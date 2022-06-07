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

# code_cov_id = {}
# code_cov_10 = {}
code_cov = {}
# not_imp_ids = []
# timeout_id_imp = {}
# timeoutcnt = 0
# finish = 0
# per file represent one seq time setting
for id in ids:
	timefile = os.path.join(path, id, "opgen_generated_files/used_time.txt")
	if not os.path.exists(timefile):
		continue
	with open(timefile) as f:
		c = f.read()
	parts = c.split("\n\n")
	# print(parts)
	pq_cov = -1
	# no_pq_cov = -1
	# old_run = 0
	# fi = 0
	for part in parts:
		if "seq_timeout:" not in part:
			continue
		time_setting = (part.split("seq_timeout: ")[-1]).split("\n")[0]
		# time_setting = (part.split("seq_timeout: ")[-1])
		time_setting = time_setting.replace(".", "_")
		if time_setting not in code_cov:
			code_cov[time_setting] = {}
		lines = part.split("\n")
		lines = [i.strip() for i in lines]
		line = lines[-1]
		cov = line.split("with code_cov ")[1]
		cov = float(cov.split("% stmt covered####")[0])
		if id in code_cov[time_setting]:
			if cov > code_cov[time_setting][id]:
				code_cov[time_setting][id] = cov
		else:
			code_cov[time_setting][id] = cov



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
	with open(num+".json", "w") as f:
		json.dump(tmp, f)
else:
	with open("test.json", "w") as f:
		json.dump(code_cov, f)


	# python3 seq_cov.py /media/data2/jianjia/extension_data/unzipped_extensions/ ../100_timeout_ids.json
