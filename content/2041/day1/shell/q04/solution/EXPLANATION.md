# Q4 explanation

```sh
sort | uniq -c | sort -rn | head -n 3
```

Step by step on the data:

1. `sort` groups identical colours together.
2. `uniq -c` collapses each group to one line, prefixed by the count.
3. `sort -rn` orders by that leading number, descending.
4. `head -n 3` keeps the top three.

## The trap
`uniq -c` **without** a preceding `sort` silently gives wrong answers, because it only
merges *adjacent* duplicates. `red blue red` would give three lines of count 1.
This is the most common mistake in the whole course.

## Why `-n` matters
Plain `sort -r` compares text: `"   9"` would beat `"  10"` because `9` > `1` as a
character. `-n` compares the numbers. `sort -rn` is one flag group; `sort -r -n` is
identical.

## Bonus: strip the leading whitespace
If a question wants `red 6` instead of `      6 red`:
```sh
sort | uniq -c | sort -rn | head -n 3 | awk '{print $2, $1}'
```
