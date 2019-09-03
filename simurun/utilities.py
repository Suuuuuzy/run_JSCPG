import re
from typing import List, Tuple, TypeVar, NoReturn
from enum import Enum
import math
import secrets


class NodeHandleResult:
    '''
    Object for storing AST node handling result.

    Args:
        obj_nodes (list, optional): Object nodes. Defaults to [].
        values (list, optional): Values of the variable or literal (as
            JavaScript source code, e.g. strings are quoted by quotation
            marks). Defaults to [].
        name (str, optional): Variable name. Defaults to None.
        name_nodes (list, optional): Name nodes. Defaults to [].
        used_objs (list, optional): Object nodes used in handling the
            AST node. Definition varies. Defaults to [].
    '''
    def __init__(self, **kwargs):
        self.obj_nodes = kwargs.get('obj_nodes', [])
        self.values = kwargs.get('values', [])
        self.name = kwargs.get('name')
        self.name_nodes = kwargs.get('name_nodes', [])
        self.used_objs = kwargs.get('used_objs', [])

    def __bool__(self):
        return bool(self.obj_nodes or self.values
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
        point (str): ID of the branching point (e.g. if/switch
            statement).
        branch (str): Which branch (condition/case in the statement).
        mark (str): One of the following:
            Operation mark, 'A' for addition, 'D' for deletion.
            For-loop mark, 'P' for primary (loop variable), 'S' for
                secondary (other variables created in the for-loop).
        ---
        or use this alternative argument:

        s (str/BranchTag): String to create the object directly, or copy
            the existing object.
    '''

    def __init__(self, s = None, **kwargs):
        self.point = ''
        self.branch = ''
        self.mark = ''
        if s:
            try:
                self.point, self.branch, self.mark = re.match(
                    r'-?([^#]+)#(\d+)(\w?)', str(s)).groups()
            except Exception:
                pass
        if 'point' in kwargs:
            self.point = kwargs['point']
        if 'branch' in kwargs:
            self.branch = kwargs['branch']
        if 'mark' in kwargs:
            self.mark = kwargs['mark']
        # assert self.__bool__()

    def __str__(self):
        return f"{self.point}#{self.branch}{self.mark or ''}"

    def __repr__(self):
        return f'{self.__class__.__name__}("{self.__str__()}")'

    def __bool__(self):
        return bool(self.point and self.branch)

    def __eq__(self, other):
        return str(self) == str(other)


class BranchTagContainer(list):
    '''
    Experimental. 
    '''
    def match(self, tag: BranchTag = None, point=None, branch=None, mark=None) \
        -> Tuple[int, BranchTag]:
        '''
        Find a matching BranchTag in the array.

        Use either a BranchTag or three strings as argument.

        Returns:
            Tuple[int, BranchTag]: index and the value of the matching
            BranchTag.
        '''
        if tag:
            point = tag.point
            branch = tag.branch
            mark = tag.mark
        for i, t in enumerate(self):
            if t.point == point and t.branch == branch:
                if mark and t.mark == mark:
                    return i, t
        return None, None

    def add(self, tag=None, point=None, branch=None, mark=None):
        if tag:
            self.append(tag)
        elif point != None and branch != None:
            self.append(BranchTag(point=point, branch=branch, mark=mark))

    def remove(self, tag: BranchTag = None, point=None, branch=None, mark=None) \
        -> NoReturn:
        '''
        Remove a matching BranchTag in the array.
        '''
        i, _ = self.match(tag, point, branch, mark)
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


class DictCounter:
    def __init__(self):
        self.d = dict()
    def get(self, key):
        if key in self.d:
            self.d[key] = self.d[key] + 1
        else:
            self.d[key] = 0
        return self.d[key]
    def gets(self, key, val=None):
        if val is not None:
            return f'{key}:{val}'
        else:
            return f'{key}:{self.get(key)}'


def get_random_hex(length=6):
    return secrets.token_hex(length // 2)


class JSSpecialValue(Enum):
    UNDEFINED = 0
    NULL = 1
    NAN = 10
    INFINITY = 11
    NEGATIVE_INFINITY = 12
    TRUE = 20
    FALSE = 21
    OBJECT = 100
    FUNCTION = 101
