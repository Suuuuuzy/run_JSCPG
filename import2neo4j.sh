# remove neo4j.db, import nodes.csv and rels.csv to neo4j.db and restart neo4j
neo4j stop;
rm -rf /Users/lsong18/apps/neo4j-community-4.2.0/data/databases/opgen
# in the latest version of neo4j, it added trans recovery
rm -rf /Users/lsong18/apps/neo4j-community-4.2.0/data/transactions/opgen

neo4j-admin import --database="opgen" --nodes=./exports/nodes.csv --relationships=./exports/rels.csv --delimiter="\t" ;
neo4j restart
