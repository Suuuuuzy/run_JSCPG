dou = "/Users/jianjia/Documents/final_results/venn_graph_data/filter_doublex/doublex/detected.txt"
emp = "/Users/jianjia/Documents/final_results/venn_graph_data/filter_doublex/empoweb/detected.txt"
no_pq = "detected.txt"
import json
with open(dou) as f:
	doublex = json.load(f)
	doublex = set(doublex)

with open(emp) as f:
	empoweb = json.load(f)
	empoweb = set(empoweb)


with open(no_pq) as f:
	jianjia = json.load(f)

jianjia.sort()
with open("detected_on_dou.txt", "w") as f:
	for i in jianjia:
		if i in doublex:
			f.write("1\n")
		else:
			f.write("0\n")

with open("detected_on_emp.txt", "w") as f:
	for i in jianjia:
		if i in empoweb:
			f.write("1\n")
		else:
			f.write("0\n")



