# Q6 explanation

```sh
tr 'A-Z' 'a-z' | tr -cs 'a-z' '\n' | sort | uniq -c | sort -rn | head -n 4
```

1. `tr 'A-Z' 'a-z'` — fold everything to lowercase. (Do this **first** so the split
   only needs to know about `a-z`.)
2. `tr -cs 'a-z' '\n'` — every run of non-lowercase-letters becomes one newline
   → one word per line.
3. `sort | uniq -c` — count occurrences of each distinct word.
4. `sort -rn` — most frequent first.
5. `head -n 4` — top 4.

## Why `-s` (squeeze) is essential
Without `-s`, `". "` (period + space) becomes **two** newlines → blank lines in the
output → a bogus empty "word" that often wins the count. Always include `-s`.

## The trailing-newline blank
The file ends with a newline, which is itself a non-letter. `-s` merges it with the
final `.`, and `sort` puts the resulting empty line first — but it is only ever one
line, so it rarely reaches the top 5. If a question demands no blank, add
`| grep -v '^$'` after the `tr`.

## Variations you should be able to write instantly
* Words of 5+ letters only: add `| grep -E '^.{5,}$'`
* Unique word count: `tr -cs 'a-zA-Z' '\n' | sort -u | wc -l`
