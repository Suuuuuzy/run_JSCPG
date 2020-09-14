from src.core.graph import Graph
from src.core.utils import NodeHandleResult, ExtraInfo, BranchTagContainer
from src.core.logger import *
# file level handling is higher than function level
# we can safely import function level functions
from .functions import simurun_function
from ..utils import decl_function, decl_vars_and_funcs
from src.plugins.handler import Handler


class HandleFile(Handler):

    def pre_processing(self):
        """
        handle the file node type
        Args:
            G (Graph): the graph
            node_id (str): the node id
        Returns:
            NodeHandleResult: the handle result
        """
        successors = []
        for child in self.G.get_child_nodes(self.node_id):
            successors.append((child, ExtraInfo()))
        print(successors)
        return ('handle', successors, self.post_successors)

    def post_successors(self, handle_res):
        pass

class HandleToplevel(Handler):

    def pre_processing(self):
        """
        handle the toplevel node type
        Args:
            G (Graph): the graph
            node_id (str): the node id
        Returns:
            NodeHandleResult: the handle result
        """
        successors = self.run_toplevel_file(self.G, self.node_id)
        print(successors)
        return ('handle', successors, self.post_successors)

    def post_successors(self, sub_handle_res):
        # get current module.exports
        # because module.exports may be assigned to another object
        # TODO: test if module is assignable
        added_module_obj = self.G.get_objs_by_name('module')[0]
        module_exports_objs = self.G.get_prop_obj_nodes(parent_obj=added_module_obj,
            prop_name='exports')

        # switch back scope, object, path and statement AST node id
        self.G.cur_scope = self.backup_scope
        self.G.cur_file_path = self.previous_file_path
        self.G.cur_stmt = self.backup_stmt

        self.G.file_stack.pop(-1)

        return ('finish', module_exports_objs)

    def run_toplevel_file(self, G: Graph, node_id):
        """
        run a top level file     
        Args:
            G (Graph): the graph
            node_id (str): the node id
        Returns:
            the exported objs by this file
        """
        # switch current file path
        if 'name' in G.get_node_attr(node_id):
            file_path = G.get_node_attr(node_id)['name']
        else:
            print(G.get_node_attr(node_id))

        # loop call
        if file_path in G.file_stack:
            return None
        G.file_stack.append(file_path)
        print(G.file_stack)
        self.previous_file_path = G.cur_file_path
        G.cur_file_path = file_path
        if G.entry_file_path is None:
            G.entry_file_path = file_path
        loggers.main_logger.info(sty.fg(173) + sty.ef.inverse + 'FILE {} BEGINS'.format(file_path) + sty.rs.all)

        # add function object and scope
        file_decl_obj = decl_function(G, node_id, func_name=file_path,
            obj_parent_scope=G.BASE_SCOPE, scope_parent_scope=G.BASE_SCOPE)
        file_scope = G.add_scope(scope_type='FILE_SCOPE', decl_ast=node_id,
            scope_name=G.scope_counter.gets(f'File{node_id}'),
            decl_obj=file_decl_obj, func_name=file_path, parent_scope=G.BASE_SCOPE)

        self.backup_scope = G.cur_scope
        self.backup_stmt = G.cur_stmt
        G.cur_scope = file_scope 
        G.cur_func = file_decl_obj

        # add module object to the current file's scope
        added_module_obj = G.add_obj_to_scope("module", node_id)
        # add module.exports
        added_module_exports = G.add_obj_as_prop("exports", node_id,
            parent_obj=added_module_obj)
        # add module.exports as exports
        G.add_obj_to_scope(name="exports", tobe_added_obj=added_module_exports)
        # "this" is set to module.exports by default
        # TODO: this is risky
        G.add_obj_to_scope(name="this", tobe_added_obj=added_module_exports)

        # we always think file has no branches
        branches = BranchTagContainer()

        func_name = file_path
        # update graph register for cur_func
        stmt_node = G.get_child_nodes(node_id, child_type='AST_STMT_LIST')[0]
        G.cur_scope = \
            G.add_scope('BLOCK_SCOPE', decl_ast=stmt_node,
                        scope_name=G.scope_counter.gets(f'Block{stmt_node}'))
        decl_vars_and_funcs(G, stmt_node, var=True)
        stmts = G.get_ordered_ast_child_nodes(stmt_node)
        successors = []
        # simulate statements
        for stmt in stmts:
            G.cur_stmt = stmt
            successors.append((stmt, ExtraInfo(branches=branches)))

        return successors

