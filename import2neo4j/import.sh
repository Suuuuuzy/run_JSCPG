# remove aim.db, import nodes.csv and rels.csv to aim.db and restart neo4j
sudo rm -rf /var/lib/neo4j/data/databases/aim.db 
sudo neo4j-admin import --database="aim.db" --nodes "nodes.csv" --relationships "rels.csv" --delimiter "\t" 
sudo chown -R neo4j /var/lib/neo4j/data/databases/aim.db 
sudo service neo4j restart
