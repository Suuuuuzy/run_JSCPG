cd ./esprima-joern
./main.js $1
cd ..
cp ./esprima-joern/nodes.csv ./esprima-joern/rels.csv ./simurun/
cd ./simurun/ 
python3 warper.py
