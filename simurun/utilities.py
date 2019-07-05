import re
from typing import List, Tuple, TypeVar, NoReturn

NodeID = str


class NodeHandleResult:
    def __init__(self, **kwargs):
        self.obj_nodes = kwargs.get('obj_nodes')
        self.value = kwargs.get('value')
        self.name = kwargs.get('name')
        self.name_node = kwargs.get('name_node')

    def __bool__(self):
        return bool(self.obj_nodes or self.value or self.name or self.name_node)


class BranchTag:
    '''
    Class for tagging branches.
    '''

    def __init__(self, s: str = None, **kwargs):
        '''
        Args:
            stmt (str): ID of the if/switch statement
            branch (str): which condition/case in the statement
            op (str): operation, 'A' for addition, 'D' for deletion
            ---
            s (str): string to create the object directly
        '''
        self.stmt = kwargs.get('stmt')
        self.branch = kwargs.get('branch')
        self.op = kwargs.get('op', '')
        if s:
            try:
                self.stmt, self.branch, self.op = re.match(
                    r'-?([^#]+)#(\d+)(\w?)', s).groups()
            except Exception:
                pass
        # assert self.__bool__()

    def __str__(self):
        return f"{self.stmt or ''}#{self.branch or ''}{self.op or ''}"

    def __repr__(self):
        return f'{self.__class__.__name__}("{self.__str__()}")'

    def __bool__(self):
        return bool(self.stmt and self.branch)

    def __eq__(self, other):
        return str(self) == str(other)


class BranchTagContainer(list):
    def match(self, tag: BranchTag = None, stmt=None, branch=None, op=None) -> Tuple[int, BranchTag]:
        '''
        Find a matching BranchTag in the array.

        Use either a BranchTag or three strings as argument.

        Returns:
            Tuple[int, BranchTag]: index and the value of the matching BranchTag.
        '''
        if tag:
            stmt = tag.stmt
            branch = tag.branch
            op = tag.op
        for i, t in enumerate(self):
            if t.stmt == stmt and t.branch == branch:
                if op and t.op == op:
                    return i, t
        return None, None

    def add(self, tag=None, stmt=None, branch=None, op=None):
        if tag:
            self.append(tag)
        elif stmt != None and branch != None:
            self.append(BranchTag(stmt=stmt, branch=branch, op=op))

    def remove(self, tag: BranchTag = None, stmt=None, branch=None, op=None) -> NoReturn:
        '''
        Remove a matching BranchTag in the array.
        '''
        i, _ = self.match(tag, stmt, branch, op)
        if i != None:
            self.delete(i)

    def delete(self, i):
        '''
        Delete an entry at the position.
        '''
        del self[i]

    def is_empty(self):
        return not bool(self)