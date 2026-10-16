#!/usr/bin/env python3
import sys

words = sys.argv[1:]

counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1

lengths = sorted(len(w) for w in words)
n = len(lengths)
mid = n // 2
if n % 2 == 1:
    median = lengths[mid]
else:
    median = (lengths[mid - 1] + lengths[mid]) / 2

shortest = sorted(words, key=lambda w: (len(w), w))[0]
longest = sorted(words, key=lambda w: (-len(w), w))[0]
mode = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]

print(f"count={len(words)}")
print(f"unique={len(counts)}")
print(f"shortest={shortest}")
print(f"longest={longest}")
print(f"mean={sum(lengths) / n}")
print(f"median={median}")
print(f"mode={mode}")
print(f"total={sum(lengths)}")
