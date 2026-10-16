# Q8 explanation

```sh
awk '$9 == 200 {print $7}' | sort | uniq -c | sort -rn | head -n 3
```

* `awk 'CONDITION {ACTION}'` runs ACTION on every line where CONDITION is true.
  `$9 == 200` tests field 9; `{print $7}` prints field 7.
* Then the standard counting idiom, then top 3.

## Pure-filter version (no awk)
```sh
grep ' 200 ' | cut -d' ' -f7 | sort | uniq -c | sort -rn | head -n 3
```
This works here, but it's fragile: `' 200 '` could match a byte count of 200 elsewhere
in the line. `awk '$9 == 200'` says exactly what you mean.

## awk mini-cheatsheet (enough for the exam)
```
awk '{print $1}'            print field 1
awk '{print $NF}'           print last field
awk 'NR == 3'               print line 3   (NR = record number)
awk 'NR > 1'                skip the header
awk -F, '{print $2}'        comma-separated
awk '$3 > 50 {print $1}'    conditional
awk '{s += $2} END {print s}'   sum column 2
```
You don't need more awk than this box.
