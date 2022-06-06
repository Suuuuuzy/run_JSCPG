import os
import sys
import json

mode = sys.argv[1]
if mode =='t':# test
	path = "../demos/"
	path = "/Users/jianjia/Desktop/help"
	ids = ["test"]
else:
	path = sys.argv[1]
	idfile = sys.argv[2]
	with open(idfile) as f:
		ids = json.load(f)

timeout_id = {}
not_imp_ids = []
# timeout_id_imp = {}
timeoutcnt = 0
finish = 0
for id in ids:
	timefile = os.path.join(path, id, "opgen_generated_files/used_time.txt")
	# resfile = os.path.join(path, id, "opgen_generated_files/res.txt")
	if not os.path.exists(timefile):
		continue
	with open(timefile) as f:
		c = f.read()
	parts = c.split("\n\n")
	# print(parts)
	pq_cov = -1
	no_pq_cov = -1
	old_run = 0
	fi = 0
	for part in parts:
		if "with code_cov " not in part:
			continue
		elif "with code_cov " in part and "finish" in part and "autostop: False" in part:
			finish += 1
			pq_cov = -1
			no_pq_cov = -1
			break
		lines = part.split("\n")
		lines = [i.strip() for i in lines]
		line = lines[-1]
		# we need timeout ones
		if "timeout" not in line:
			continue
		if "run_with_pq: False" in lines:
			cov = line.split("with code_cov ")[1]
			cov = float(cov.split("% stmt covered####")[0])
			if cov > no_pq_cov:
				no_pq_cov=cov
		elif "run_with_pq: True" in lines:
			cov = line.split("with code_cov ")[1]
			cov = float(cov.split("% stmt covered####")[0])
			if cov > pq_cov:
				pq_cov=cov
	if no_pq_cov>0 and pq_cov>0:
		timeout_id[id] = [pq_cov-no_pq_cov, pq_cov, no_pq_cov]
		# timeout_id_imp[id] = pq_cov-no_pq_cov
		if pq_cov>no_pq_cov:
			print(pq_cov, no_pq_cov, id)
			timeoutcnt+=1
		else:
			not_imp_ids.append(id)

print(str(finish) + " finishes")
print(str(len(timeout_id))+" timeout")
print(str(timeoutcnt) + " imp")

if mode !='t':# test
	num = idfile.split("/")[-1].split("_")[0]
	with open(num+"_timeout_id.txt", "w") as f:
		# json.dump(timeout_id, f)
		for i in timeout_id:
			f.write(str(i) + "\t" + str(timeout_id[i][0]) + "\t" +str(timeout_id[i][1])+ "\t"+ str(timeout_id[i][2]) + "\n")

	with open(num+"_timeout_id.json", "w") as f:
		json.dump(timeout_id, f)

	with open(num+"_not_imp_ids.txt", "w") as f:
		json.dump(not_imp_ids, f)

	with open(num+"_timeout_ids.json", "w") as f:
		tmp = [i for i in timeout_id]
		json.dump(tmp, f)


	# python3 get_timeout.py  /media/data2/jianjia/extension_data/unzipped_extensions/ random_500.txt
