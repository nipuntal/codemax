# Q7 explanation

```sh
{ head -n 1; sort -t, -k3,3 -rn; }
```

* `{ ...; }` groups commands so they **share one stdin**.
* `head -n 1` reads and prints the header, then exits — the header is now *gone*
  from the stream.
* `sort -t, -k3,3 -rn` reads **the remaining lines** (the data rows) and sorts them:
  comma separator, key = field 3 only, numeric, reversed.

## The bug almost everyone writes first
```sh
{ head -n 1; tail -n +2 | sort -t, -k3,3 -rn; }     # WRONG
```
`head` already ate line 1. `tail -n +2` then skips line 1 *of what's left* — which is
the first student. One row silently vanishes. If your output is one line short, this
is why.

`tail -n +2` is only correct when nothing has consumed the header yet, e.g.
`tail -n +2 marks.csv | sort ...` reading from the file by name.

## Ties
If two students had the same mark, `sort` leaves their order unspecified.
Add a tie-break: `sort -t, -k3,3rn -k1,1`. When expected output looks "wrong" but
the numbers are right, suspect a tie.

## Why `-k3,3` not `-k3`
`-k3` means "from field 3 to end of line". Here that's the same thing, but on a file
with more columns it silently changes the answer. Use `-k3,3`.

## Without a header the whole answer is one command
```sh
sort -t, -k3,3 -rn
```
