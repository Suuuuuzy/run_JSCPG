import os
import sys
import json
idfile = sys.argv[2]
path = sys.argv[1]
with open(idfile) as f:
	ids = json.load(f)
times = []
time_id = {}
for id in ids:
	with open(os.path.join(path, id, "opgen_generated_files/used_time.txt")) as f:
		c = f.read()
	lines = c.split("\n")
	line = lines[-3]
#	print(lines)
	try:
		time = line.split("with code_cov ")[1]
		time = time.split("% stmt covered####")[0]
		times.append(float(time))
		time_id[id] = float(time)
	except:
		if "timeout" in line:
			print("timeout")
	
time_id = dict(sorted(time_id.items(), key=lambda item: item[1]))
print(len(times))
with open("time.txt", "w") as f:
	json.dump(times, f)

with open("time_id.txt", "w") as f:
	json.dump(time_id, f)
