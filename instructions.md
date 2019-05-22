1, Login to the account: 
	Login to the Hopkins VPN
	address: lab.songli.io
	username: hopkins 
	password: hopkins
================================================Run the small demo===============================================

2, Go into the dir "JSCPG" 
	run "cd JSCPG"
3, Get the AST and Joern graph of small demo:
	run "./js2cpg.sh /home/hopkins/JSCPG/jscpg-may-demo.js"
	ATTENTION: the file path have to be the absolute path!
4, Go into the dir "simurun":
	run "cd simurun"
5, Get the OBJ graph:
	1, copy the generated file of joern into working dir:
		run "cp ../tmpcsv/* ./"	
	2, generate the object and scope graph:
		run "python objectGraphGenerator.py"
	3, import the generated graph into neo4j:
		run "./import2neo4j.sh"
6, Go into the vul checking dir:
	run "cd ../JSCypherQuery/" 

7, Make sure the "source" and "sink" are right:
	1, open file "vul_check.py"
	2, line 25 shows the source. should be like "return a""".format(node, "argv")", the "argv" is the source 

8, Do the checking and get the path:
	run "python vul_check.py"

================================================Run the growl demo===============================================

2, Same as small demo
3, Get the AST and Joern graph of small demo:
	run "./js2cpg.sh /home/hopkins/JSCPG/growls/growl.js"
	ATTENTION: the file path have to be the absolute path!
4, 5, 6, Same as small demo
7, The source is "options", the line 25 of "vul_check" should be like
	"return a""".format(node, "options")"
8, Same as small demo

================================================Show the graph===============================================
We can show the graph by browser
1, Open the URL: http://lab.songli.io:7474
2, Input a command line to change the maxmium node value:
	run ":config initialNodeDisplay: 3000"
	ATTENTION: we need to run the command line only once
3, Run the command line to show the nodes
	run "match(n) return n;"

