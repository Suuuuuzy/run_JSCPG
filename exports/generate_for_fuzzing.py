# for nodes only keep the AST nodes
with open("./nodes.csv", 'r') as fp:
    nodes = []
    for line in fp.readlines():
        elems = line.split("\t")
        if len(nodes) == 0 or elems[1] == 'AST':
            nodes.append(line)

with open("./fuzzing_nodes.csv", 'w') as fp:
    fp.write(''.join(nodes))

# for edges only keep the OBJ REACHES
with open("./rels.csv", 'r') as fp:
    df = []
    cf = []
    ast = []
    for line in fp.readlines():
        elems = line.split("\t")
        if elems[2] == 'OBJ_REACHES':
            df.append(line)
        elif elems[2] == 'FLOWS_TO':
            cf.append(line)
        elif elems[2] == 'PARENT_OF':
            ast.append(line)

with open("./fuzzing_cfast.csv", 'w') as fp:
    fp.write(''.join(cf + ast))

with open("./fuzzing_df.csv", 'w') as fp:
    fp.write(''.join(df))
