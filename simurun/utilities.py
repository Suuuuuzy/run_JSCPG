import re
from typing import List, Tuple, TypeVar, NoReturn
from enum import Enum
import math


class NodeHandleResult:
    def __init__(self, **kwargs):
        self.obj_nodes = kwargs.get('obj_nodes', [])
        self.values = kwargs.get('values')
        self.name = kwargs.get('name')
        self.name_nodes = kwargs.get('name_nodes', [])
        self.used_objs = kwargs.get('used_objs', [])

    def __bool__(self):
        return bool(self.obj_nodes or (self.values is not None)
            or (self.name is not None) or self.name_nodes or
            self.used_objs)

    def __repr__(self):
        s = []
        for key in dir(self):
            if not key.startswith("__"):
                s.append(f'{key}={repr(getattr(self, key))}')
        args = ', '.join(s)
        return f'{self.__class__.__name__}({args})'


class BranchTag:
    '''
    Class for tagging branches.

    Args:
        stmt (str): ID of the if/switch statement
        branch (str): which condition/case in the statement
        op (str): operation, 'A' for addition, 'D' for deletion
        ---
        s (str/BranchTag): string to create the object directly, or copy
            the existing object
    '''

    def __init__(self, s = None, **kwargs):
        self.stmt = ''
        self.branch = ''
        self.op = ''
        if s:
            try:
                self.stmt, self.branch, self.op = re.match(
                    r'-?([^#]+)#(\d+)(\w?)', str(s)).groups()
            except Exception:
                pass
        if 'stmt' in kwargs:
            self.stmt = kwargs['stmt']
        if 'branch' in kwargs:
            self.branch = kwargs['branch']
        if 'op' in kwargs:
            self.op = kwargs['op']
        # assert self.__bool__()

    def __str__(self):
        return f"{self.stmt}#{self.branch}{self.op or ''}"

    def __repr__(self):
        return f'{self.__class__.__name__}("{self.__str__()}")'

    def __bool__(self):
        return bool(self.stmt and self.branch)

    def __eq__(self, other):
        return str(self) == str(other)


class BranchTagContainer(list):
    '''
    Experimental. 
    '''
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


class ExtraInfo:
    def __init__(self, original=None, **kwargs):
        self.branches = []
        self.side = None
        self.parent_obj = None
        self.caller_ast = None
        if original is not None:
            self.branches = original.branches
            self.side = original.side
            self.parent_obj = original.parent_obj
            self.caller_ast = original.caller_ast
        if 'branches' in kwargs:
            self.branches = kwargs.get('branches')
        if 'side' in kwargs:
            self.side = kwargs.get('side')
        if 'parent_obj' in kwargs:
            self.parent_obj = kwargs.get('parent_obj')
        if 'caller_ast' in kwargs:
            self.caller_ast = kwargs.get('caller_ast')

    def __bool__(self):
        return bool(self.branches or (self.side is not None) or
            (self.parent_obj is not None) or (self.caller_ast is not None))

    def __repr__(self):
        s = []
        for key in dir(self):
            if not key.startswith("__"):
                s.append(f'{key}={repr(getattr(self, key))}')
        args = ', '.join(s)
        return f'{self.__class__.__name__}({args})'


class ValueRange:
    def __init__(self, original=None, **kwargs):
        self.min = kwargs.get('min', -math.inf)
        self.max = kwargs.get('max', math.inf)
        self.type = kwargs.get('type', 'float')
