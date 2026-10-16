# Q1 explanation

```sh
cut -d'|' -f1 | sort -u
```

* `cut -d'|' -f1` — split each line on `|`, keep field 1 (the course code).
  The `|` **must** be quoted; unquoted it would be a pipe.
* `sort -u` — sort, then discard duplicate lines.

## Why not `sort | uniq`?
It's identical here. `sort -u` is one process instead of two and is the idiomatic
answer. Use `sort | uniq -c` only when you actually want the counts.

## Why `cut` and not `awk`?
Both work: `awk -F'|' '{print $1}'`. `cut` is simpler and the exam's "UNIX filters"
list always includes it. Reach for `awk` only when `cut` can't do the job — runs of
spaces as separators, or a condition on one field.

## A trap you avoided
```sh
sort -u | cut -d'|' -f1        # WRONG
```
This dedupes whole *records* first, which doesn't collapse two different students in
the same course. Order matters: **extract, then dedupe**.
