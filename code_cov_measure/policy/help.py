import json
with open("run.json") as f:
	c = json.load(f)

c["policy_3"] = c["policy_4"]
del c["policy_4"]
with open("no_5.json", "w") as f:
	json.dump(c, f)