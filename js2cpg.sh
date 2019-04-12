# generate the ast
cd ./esprima-joern
./main.js $1
cd ..
# generate the cpg
./phpast2cpg ./esprima-joern/nodes.csv ./esprima-joern/rels.csv 
# move files to import
cp ./cpg_edges.csv ./tmpcsv/rels.csv 
cp ./esprima-joern/nodes.csv ./tmpcsv/nodes.csv 
sed '1d;$d' ./esprima-joern/rels.csv >> ./tmpcsv/rels.csv  
cd ./tmpcsv/ 
# remove aim.db, import nodes.csv and rels.csv to aim.db and restart neo4j
sudo rm -rf /var/lib/neo4j/data/databases/aim.db 
sudo neo4j-admin import --database="aim.db" --nodes "nodes.csv" --relationships "rels.csv" --delimiter "\t" 
sudo chown -R neo4j /var/lib/neo4j/data/databases/aim.db 
sudo service neo4j restart
