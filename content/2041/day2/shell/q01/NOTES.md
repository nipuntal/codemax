# Notes — field extraction and dedup

## The pattern
Almost every enrolment-data pipeline is:
```
[filter lines] | [extract a field] | [sort/dedupe/count]
```
Do them in that order. Filtering before extracting is cheaper and easier to reason
about; extracting before sorting is mandatory because `sort` and `uniq` work on whole
lines.

## Getting field 1 of a `|`-separated line
```sh
cut -d'|' -f1
```
`|` has no special meaning to `cut`, but it **does** to the shell, so quote it:
`-d'|'` or `-d\|`. Unquoted `-d|` starts a pipeline and you get a syntax error.

## Dedup
```sh
sort -u          # sort and remove duplicates -- one command
sort | uniq      # identical, two commands
```
`sort -u` is shorter and is what markers expect. Remember **`uniq` only removes
adjacent duplicates** — it is useless without a preceding `sort`.

## Edge cases this question quietly tests
* The data is unordered, so you *must* sort — you cannot rely on input order.
* A student takes several courses, so course codes repeat. Without dedup you'd get 16
  lines instead of 10.
* `cut -f1` is the first field. Field numbering in `cut` is **1-based**.

## The trap for later questions
`cut -d'|' -f3` gives you the whole name field **including its trailing spaces**:
```
Costner, Kevin Augustus          
```
Those spaces are real characters. They will break `sort -u` (two records of the same
student pad differently only if the name differs — here they don't, but in general
watch out) and they will show up in your output. Strip them when you extract names:
```sh
sed -E 's/ +$//'          # remove trailing spaces
```
