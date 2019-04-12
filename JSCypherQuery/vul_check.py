from jsDatabase import JSDatabase

js_database = JSDatabase("123456")

def check_os_command():
    """
    return all nodes and relationships with os-command 
    """
    query_str ="""
    MATCH (n)-[:PARENT_OF*0..]->(a),
    (src)-[rel:REACHES*]->(n)
    WHERE a.code =~ ".*exec.*" and ALL(r in rel where r.taint_dst is null and r.taint_src is null)
    return src, rel"""
    return js_database.run_query(query_str)

def check_sub_src(node):
    """
    input a node, check if the subnode of this node contains source
    """
    query_str =""" 
    START root=node({})
    MATCH (root)-[:PARENT_OF*2..3]->(a)
    WHERE a.code="request"
    return a""".format(node)
    return js_database.run_query(query_str)

res = check_os_command()
res_set = set()
for path in res:
    if (path['src']['type'] == 'AST_ASSIGN'):
        res = check_sub_src(path['src']['id'])
        if str(res) not in res_set:
            res_set.add(str(res))
            if len(res) != 0:
                print res
                print path['rel']

