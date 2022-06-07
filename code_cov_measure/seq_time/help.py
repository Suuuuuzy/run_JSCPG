import json
with open("500.json") as f:
	oldcode_cov = json.load(f)

with open("100.json") as f:
	code_cov = json.load(f)


for key in oldcode_cov:
	if key in code_cov:
		oldcode_cov[key].update(code_cov[key])
for key in code_cov:
	if key not in oldcode_cov:
		oldcode_cov[key] = code_cov[key]

# for timesetting in oldcode_cov:
# 	print(timesetting.replace("_", "."))
# 	# print(oldcode_cov[i])
# 	tmp = [j for j in oldcode_cov[timesetting]]
# 	(set(tmp))
# 	print(len(tmp))
	# ids_sets.append()
	# for j in oldcode_cov[i]:
	# 	print(j)

def get_ids(timesetting):
	tmp = [j for j in oldcode_cov[timesetting]]
	tmp = (set(tmp))
	# print(len(tmp))
	return tmp

ten = get_ids("10_0")
zero = get_ids("0")
both = ten & zero
# print(both)
print(len(both))
res = {}
for i in both:
	res[i] = [oldcode_cov["10_0"][i]-oldcode_cov["0"][i], oldcode_cov["10_0"][i], oldcode_cov["0"][i]]

for i in res:
	print(i)
	print(res[i])