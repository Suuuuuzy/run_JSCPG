from jsDatabase import JSDatabase
from graph import Graph

js_database = JSDatabase("123456")

def check_os_command():
    """
    return all nodes and relationships with os-command 
    """
    query_str ="""
    MATCH (n)-[:PARENT_OF*0..]->(a),
    (src)-[rel:OBJ_REACHES*]->(n)
    WHERE a.code =~ ".*exec.*" and ALL(r in rel where r.taint_dst is null and r.taint_src is null)
    return src, rel, n"""
    return js_database.run_query(query_str)

def check_sub_src(node):
    """
    input a node, check if the subnode of this node contains source
    """
    query_str =""" 
    START root=node({})
    MATCH (root)-[:PARENT_OF*..4]->(a)
    WHERE a.code=~".*{}.*"
    return a""".format(node, "options")
    return js_database.run_query(query_str)

res = check_os_command()
res_set = set()
for path in res:
    cur_type = path['src']['type']
    if (path['src']['type'] == 'AST_ASSIGN' or path['src']['type'] == 'AST_PARAM'):
        res = check_sub_src(path['src']['id'])
        if str(res) not in res_set:
            res_set.add(str(res))
            if len(res) != 0:
                print res
                print path['rel']
                for r in path['rel']:
                    print r
