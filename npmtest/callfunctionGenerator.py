#!/usr/bin/env python3
import sys
sys.path.append("..")
from npmtest.multi_run_helper import *
# for memory leak
# but does not work
split_parts = 30
for i in range(split_parts):
    main(i, split_parts)
    gc.collect()
    print(sys.modules[__name__])
    print(sys.modules[__name__].__dict__)
    break
