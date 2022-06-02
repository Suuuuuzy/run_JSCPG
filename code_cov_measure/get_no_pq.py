import os
import sys
import json
path = sys.argv[1]
idfile = sys.argv[2]
with open(idfile) as f:
	ids = json.load(f)
times = []
for id in ids:
	pq = False
	timefile = os.path.join(path, id, "opgen_generated_files/used_time.txt")
	if not os.path.exists(timefile):
		continue
	with open(timefile) as f:
		c = f.read()
	lines = c.split("\n")
	lines = [i for i in lines if i!='']
	line = lines[-1]
	for i in lines:
		if i.startswith("run_with_pq"):
			if i=="run_with_pq: True":
				pq = True
			else:
				pq = False
	if not pq:
		times.append(i)
	
print(len(times))
with open("final_code_cov/not_pq.txt", "w") as f:
	json.dump(times, f)
