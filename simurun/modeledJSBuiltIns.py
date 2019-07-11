from graph import Graph


def setup_js_builtins(G: Graph):
    setup_string(G)
    setup_number(G)
    setup_array(G)
    setup_function(G)


def setup_string(G: Graph):
    string_cons = G.add_blank_func_with_og_nodes('String', scope=G.BASE_SCOPE)
    string_prototype = G.add_obj_to_obj(ast_node=None, var_type='BUILT-IN', var_name='prototype', parent_obj=string_cons)



def setup_number(G: Graph):
    number_cons = G.add_blank_func_with_og_nodes('Number', scope=G.BASE_SCOPE)
    number_prototype = G.add_obj_to_obj(ast_node=None, var_type='BUILT-IN', var_name='prototype', parent_obj=number_cons)
    parse_int = G.add_blank_func_with_og_nodes('parseInt', scope=G.BASE_SCOPE)
    parse_float = G.add_blank_func_with_og_nodes('parseFloat', scope=G.BASE_SCOPE)


def setup_array(G: Graph):
    array_cons = G.add_blank_func_with_og_nodes('Array', scope=G.BASE_SCOPE)
    array_prototype = G.add_obj_to_obj(ast_node=None, var_type='BUILT-IN', var_name='prototype', parent_obj=array_cons)


def setup_function(G: Graph):
    function_cons = G.add_blank_func_with_og_nodes('Function', scope=G.BASE_SCOPE)
    function_prototype = G.add_obj_to_obj(ast_node=None, var_type='BUILT-IN', var_name='prototype', parent_obj=function_cons)


