import json
import numpy as np
import matplotlib.pyplot as plt
import sys
from os import walk
from matplotlib_venn import venn2, venn3, venn3_circles
import random
import json
from matplotlib.pyplot import MultipleLocator

# all_dic = {"detected": [], "not_done": [], "timeout": [], "benign": [], "error":[], "pq_detected": [], "pq_timeout":[], "pq_benign":[], "pq_error":[]}
new_sets = {}
old_sets = {}

with open("crx_lists/filtered_file.txt") as f:
	all_ids = set(json.load(f))

with open("odgen_cmp/opgen_results.txt") as f:
	c = json.load(f)
	print("new")
	for i in c:
		print(i)
		new_sets[i] = set(c[i])
		print(len(c[i]))

print("\n\n")

with open("odgen_cmp_old/opgen_results.txt") as f:
	c = json.load(f)
	print("old")
	for i in c:
		print(i)
		old_sets[i] = set(c[i])
		print(len(c[i]))



# get pq not done and no_pq not done
pq_not_done = all_ids.copy()
not_done = all_ids.copy()
pq_except_not_done = ["pq_detected", "pq_timeout", "pq_benign", "pq_error"]
except_not_done = ["detected", "timeout", "benign", "error"]
for i in pq_except_not_done:
	print(len(pq_not_done))
	print(i)
	pq_not_done -= new_sets[i]
	pq_not_done -= old_sets[i]


for i in except_not_done:
	not_done -= new_sets[i]
	not_done -= old_sets[i]

print("=============what we should know=============")
print(("no_pq_not_done"))
print(len(not_done))
with open("odgen_cmp/no_pq_not_done.txt", "w") as f:
	json.dump(list(not_done), f)

# print(list(not_done)[0])
print(("pq_not_done"))
print(len(pq_not_done))
# print(list(pq_not_done)[0])
with open("odgen_cmp/pq_not_done.txt", "w") as f:
	json.dump(list(pq_not_done), f)


# the operation for old and new results should be or
for i in old_sets:
	# the operation for old and new results should be or
	old_sets[i] = set(old_sets[i]) | new_sets[i]

# old_sets["benign"] -= old_sets["detected"] 
# old_sets["pq_benign"] -= old_sets["pq_detected"] 
# not_done should be all_ids-others
old_sets["not_done"] = all_ids
for i in old_sets:
	if i=="not_done":
		continue
	old_sets["not_done"] -= old_sets[i] 

cnt = 0
print("\n\n")
for i in old_sets:
	print(i)
	# new_sets[i] = set(c[i])
	print(len(old_sets[i]))
	cnt += len(old_sets[i])
print(cnt)

# get pq detected and no_pq detected
# print(len(old_sets["detected"]))
# print(len(old_sets["pq_detected"]))
# print(len(old_sets["pq_detected"]-old_sets["detected"]))

def draw_venn_chart(data_set, group_name):
    if len(data_set)==2:
        out = venn2(data_set,group_name)
    elif len(data_set)==3:
        out = venn3(data_set,group_name)
    for text in out.set_labels:
        if text:
            text.set_fontsize( 20 )
    for text in out.subset_labels:
        if text:
            text.set_fontsize( 16 )
    # plt.savefig( "./result/" + config_dict['save_to'] + ".eps", format='eps' )
    plt.show()
data_set = [old_sets["detected"], old_sets["pq_detected"]]
group_name = ["detected", "pq_detected"]
# draw_venn_chart(data_set, group_name)


