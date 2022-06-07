import os
import json
import random
with open("time_id.txt") as f:
	c = set(json.load(f))
print(len(c))

with open("random_500.txt") as f:
	c_500 = set(json.load(f))

timeouts = list(c_500-c)
select = []
for i in range(5):
	tmp = random.randint(0,len(timeouts)-1)
	select.append(timeouts[tmp])

with open("new_5.json", "w") as f:
	json.dump(select, f)
