#!/usr/bin/env python3
import sys
import os


def relative_files(root):
    found = set()
    for dirpath, dirnames, filenames in os.walk(root):
        for name in filenames:
            full = os.path.join(dirpath, name)
            found.add(os.path.relpath(full, root))
    return found


d1, d2 = sys.argv[1], sys.argv[2]

set1 = relative_files(d1)
set2 = relative_files(d2)

same = 0
diff = 0
for path in set1 & set2:
    if os.path.getsize(os.path.join(d1, path)) == os.path.getsize(os.path.join(d2, path)):
        same += 1
    else:
        diff += 1

print(f"{same} {diff} {len(set1 - set2)} {len(set2 - set1)}")
