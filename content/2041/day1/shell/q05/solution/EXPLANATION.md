# Q5 explanation

```sh
grep -v '^#' | grep -v '^$'
```

* `^#` — `^` anchors to start of line, so this matches lines *beginning* with `#`.
  `-v` inverts → keep everything else.
* `^$` — start of line immediately followed by end of line → an empty line.
  `-v` → keep the non-empty ones.

## One-command version (extended regex)
```sh
grep -Ev '^#|^$'
```
`|` means "or" in an extended regex, and `-E` turns extended regexes on.
Or even shorter: `grep -Ev '^(#|$)'`.

Both spellings are worth knowing; the two-grep version is easier to get right under
pressure, the `-E` version is what markers like to see.

## Watch out
* A line with only spaces is NOT matched by `^$`. To also drop whitespace-only lines:
  `grep -Ev '^ *$'`
* `grep -v '#'` (no `^`) would also delete lines with a trailing comment. Anchor it.
