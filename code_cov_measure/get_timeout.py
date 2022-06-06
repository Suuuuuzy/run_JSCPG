import os
import sys
import json

path = sys.argv[1]
if path =='t':# test
	path = "../demos/"
	path = "/Users/jianjia/Documents/final_results/venn_graph_data/add_more/extensions/"
	ids = ["cgifdpikilmphplddaagnmhpdcnohhda"]
else:
	idfile = sys.argv[2]
	with open(idfile) as f:
		ids = json.load(f)

timeout_id = {}
timeout_id_imp = {}
cnt = 0
finish = 0
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
	old_run = 0
	fi = 0
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
				if "finish" in line:
					fi = 1
			except:
				old_run = 1
		elif "run_with_pq: True" in lines:
			line = lines[-1]
			try:
				cov = line.split("with code_cov ")[1]
				cov = float(cov.split("% stmt covered####")[0])
				if cov > pq_cov:
					pq_cov=cov
				if "finish" in line:
					fi = 1
			except:
				old_run = 1
	# if old_run:
	# 	cnt+=1
	if fi==1:
		finish += 1
	else:
		timeout_id[id] = [pq_cov, no_pq_cov]
		timeout_id_imp[id] = pq_cov-no_pq_cov
		if no_pq_cov != 0 and pq_cov>no_pq_cov:
			print(pq_cov, no_pq_cov, id)
			cnt+=1

print(str(finish) + " finishes")
print(str(len(timeout_id))+" timeout")
print(str(cnt) + " imp")

# print(str(cnt)+" can not get cov")

with open("timeout_id.txt", "w") as f:
	# json.dump(timeout_id, f)
	for i in timeout_id:
		f.write(str(i) + "\t" + str(timeout_id[i])+"\n")

with open("timeout_id_imp.txt", "w") as f:
	# json.dump(timeout_id_imp, f)
	for i in timeout_id_imp:
		f.write(i+"\n")


	# python3 get_timeout.py  /media/data2/jianjia/extension_data/unzipped_extensions/ random_500.txt
