# Day 3 · Q24 — Award Lifespan  ·  [shell script]  ·  ⭐⭐⭐ · 10 min

Write a POSIX-compatible shell script `q24.sh` that takes two command-line arguments:
a **regular expression** and a **filename** (in `awards.psv` format).

Print one line for each award whose **entire name** matches the regex, in alphabetical
order of award name:
```
NAME FIRST-LAST (N awards)
```
where FIRST and LAST are the earliest and latest years it was given, and N is how many
records match.

If no award name matches the regex, print `No award matching 'REGEX'`.

```
./q24.sh 'Fields Medal' awards.psv
Fields Medal 1936-2022 (59 awards)
./q24.sh 'Nobel Prize for (physics|peace)' awards.psv
Nobel Prize for peace 1901-2021 (135 awards)
Nobel Prize for physics 1901-2021 (183 awards)
./q24.sh 'COMP2041 Prize' awards.psv
No award matching 'COMP2041 Prize'
```

* The **entire** award name must match — `Nobel Prize` must not match
  `Nobel Prize for physics`.
* `#!/bin/dash`, POSIX only. No `awk`. No temporary files.
* Permitted: `cat cut echo grep head printf sed sort tail test tr uniq wc`

```sh
./test.sh          # then read WALKTHROUGH.md
```
