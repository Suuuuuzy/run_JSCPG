class PluginManager(object):
    """
    this is the parent class for all the internal plugins
    the Obj should be a singleton
    """
    instance = None
    class __PluginManager:
        from .handlers.file import HandleFile as HandleFile
        from .handlers.file import HandleToplevel \
                as HandleToplevel
        from .handlers.operators import HandleAssign as HandleAssign
        from .handlers.functions import HandleASTCall as HandleASTCall
        from .handlers.vars import HandleVar as HandleVar
        from .handlers.const import HandleConst as HandleConst
        from .handlers.func_decl import HandleFuncDecl as HandleFuncDecl
        from .handlers.property import HandleProp as HandleProp
        from .handlers.array import HandleArray as HandleArray, \
                HandleArrayElem as HandleArrayElem
        from .handlers.loop import HandleFor as HandleFor
        from .handlers.expr_list import HandleExprList as HandleExprList
        from .handlers.inc_dec import HandleIncDec as HandleIncDec
        from .handlers.condition import HandleIf as HandleIf
        def __init__(self, G):
            self.G = G
            self.handler_map = {
                    'File': self.HandleFile,
                    'Directory': self.HandleFile,
                    'AST_TOPLEVEL': self.HandleToplevel,
                    'AST_ASSIGN': self.HandleAssign,
                    'AST_CALL': self.HandleASTCall,
                    'AST_METHOD_CALL': self.HandleASTCall,
                    'AST_NEW': self.HandleASTCall,
                    'AST_NAME': self.HandleVar,
                    'AST_VAR': self.HandleVar,
                    'AST_PROP': self.HandleProp,
                    'AST_DIM': self.HandleProp,
                    'AST_CONST': self.HandleVar,
                    'integer': self.HandleConst,
                    'string': self.HandleConst,
                    'double': self.HandleConst,
                    'AST_FUNC_DECL': self.HandleFuncDecl,
                    'AST_CLOSURE': self.HandleFuncDecl,
                    'AST_ARRAY': self.HandleArray,
                    'AST_ARRAY_ELEM': self.HandleArrayElem,
                    'AST_FOR': self.HandleFor,
                    'AST_EXPR_LIST': self.HandleExprList,
                    'AST_PRE_INC': self.HandleIncDec,
                    'AST_POST_INC': self.HandleIncDec,
                    'AST_PRE_DEC': self.HandleIncDec,
                    'AST_POST_DEC': self.HandleIncDec,
                    'AST_IF': self.HandleIf,
                    }

        def dispatch_node(self, node_id, extra=None):
            """
            this method will dispatch nodes to different modules based
            on the type of the node
            the handling process for each node include multiple stages
            
            Args:
                G (Graph): the graph
                node_id (str): the id of the node
                extra (Extra): the extra info
            Returns:
                NodeHandleResult: the handle result of the node
            """
            node_attr = self.G.get_node_attr(node_id)
            print(node_attr)
            node_type = node_attr['type']

            handle_obj = self.handler_map[node_type](self.G, node_id, extra=extra)
            handle_res = handle_obj.process()
            return handle_res


    def __init__(self, G=None):
       if not PluginManager.instance:
           print("new instance")
           PluginManager.instance = PluginManager.__PluginManager(G)
    def __getattr__(self, val):
        return getattr(self.instance, val)
    def __setattr__(self, val):
        return setattr(self.instance, val)

