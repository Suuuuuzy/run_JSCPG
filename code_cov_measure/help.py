import json
with open("100_timeout_id.json") as f:
	c_100 = json.load(f)


with open("500_timeout_id.json") as f:
	c_500 = json.load(f)


# c_100.update(c_500)

c_100 = dict(sorted(c_100.items(), key=lambda item: item[1][0]))
# pq_cov =

no_pq_cov = [c_100[i][2] for i in c_100]
# print(no_pq_cov)
with open("graph/Sequential.txt", "w") as f:
	json.dump(no_pq_cov, f)

pq_cov = [c_100[i][1] for i in c_100]
# print(pq_cov)
with open("graph/Concurrent.txt", "w") as f:
	json.dump(pq_cov, f)

imp = [c_100[i][0] for i in c_100]
imp = [i for i in imp if i>0]
# print(imp)
with open("graph/imp.txt", "w") as f:
	json.dump(imp, f)
print(len(no_pq_cov))
print(sum(no_pq_cov)/len(no_pq_cov))
print(sum(pq_cov)/len(pq_cov))
