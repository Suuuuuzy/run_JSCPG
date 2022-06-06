import os
import sys
import json

path = sys.argv[1]
if path =='t':# test
	path = "../demos/"
	ids = ["test"]
else:
	idfile = sys.argv[2]
	with open(idfile) as f:
		ids = json.load(f)

timeout_id = {}
for id in ids:
	timefile = os.path.join(path, id, "opgen_generated_files/used_time.txt")
	if not os.path.exists(timefile):
		continue
	with open(timefile) as f:
		c = f.read()
	parts = c.split("\n\n")
	# print(parts)
	pq_cov = 0
	no_pq_cov = 0
	for part in parts:
		lines = part.split("\n")
		lines = [i.strip() for i in lines]
		# we need timeout ones
		if "timeout" not in lines[-1]:
			continue
		if "run_with_pq: False" in lines:
			line = lines[-1]
			try:
				cov = line.split("with code_cov ")[1]
				cov = float(cov.split("% stmt covered####")[0])
				if cov > no_pq_cov:
					no_pq_cov=cov
			except:
				print("can not get cov")
		elif "run_with_pq: True" in lines:
			line = lines[-1]
			try:
				cov = line.split("with code_cov ")[1]
				cov = float(cov.split("% stmt covered####")[0])
				if cov > pq_cov:
					pq_cov=cov
			except:
				print("can not get cov")
	if pq_cov>no_pq_cov:
		timeout_id[id] = pq_cov-no_pq_cov
		print(pq_cov, no_pq_cov, id)


with open("pq_timeout_imp.txt", "w") as f:
	json.dump(timeout_id, f)


	# python3 get_timeout.py  /media/data2/jianjia/extension_data/unzipped_extensions/ random_500.txt