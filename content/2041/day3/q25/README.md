# Day 3 · Q25 — Years An Award Was Not Given  ·  [shell script]  ·  ⭐⭐⭐⭐ · 15 min · **8 marks**

> **This is Question 5 of the COMP2041 practice exam, verbatim.**

In Q4 you were given `awards.psv`, containing information about Nobel Prizes, Turing
Awards and Fields Medals. This time we are interested in the years particular awards
were **not** given, between when the award was first offered and when it was last
offered.

Write a POSIX-compatible shell script `q25.sh` that prints all years that an award was
not given in.

`q25.sh` is given two command-line arguments: a **regular expression** and a **file
name**. It should print, in sorted order, the years in which no award whose **entire
name** matches the regex was given.

The entire name must match the regex, not just a substring. If the regex is
`Nobel Prize`, then awards for `Nobel Prize for physics` should **not** match. But if
the regex is `Nobel Prize.*`, then `Nobel Prize for physics` **should** match.

Do not hard-code the name of the data file; it is given as the second argument.

If no awards match the regex, print a message to stdout as shown below.

```
./q25.sh 'Nobel Prize for physics' awards.psv
1916
1931
1934
1940
1941
1942
./q25.sh 'Nobel Prize for (chemistry|physics)' awards.psv
1916
1940
1941
1942
./q25.sh 'Nobel Prize for.*' awards.psv
1940
1941
1942
./q25.sh 'COMP2041 Distinguished Achievers' awards.psv
No award matching 'COMP2041 Distinguished Achievers'
```

* Assume `|` only ever appears as a field separator.
* The input is unordered.
* Permitted external programs: `basename cat chmod cmp cp cut diff dirname echo expr
  false find grep head ls mkdir mv printf pwd rev rm rmdir sed seq sort stat strings tac
  tail tee test touch tr true uniq wc xargs`
* Built-ins: `case cd exit for if read shift while`
* `#!/bin/dash`, POSIX only. No Perl/C/Python/awk.
* **You may not create temporary files.**

```sh
./test.sh          # then read WALKTHROUGH.md
```
