# Q3 explanation

```sh
grep '/bin/bash$' | cut -d: -f1
```

* `grep '/bin/bash$'` — `$` anchors the match to the **end of line**, so the shell
  field. Quoting matters: `$` is special to the shell, single quotes protect it.
* `cut -d: -f1` — split on `:`, take field 1 (the username).

## Why the `$` anchor matters
Without it, `grep /bin/bash` would still work *here*, but it would also match a user
whose home directory was `/bin/bash-stuff`. Anchoring is free — do it.

## Common mistakes
* `grep "/bin/bash$"` in double quotes — the shell tries to expand `$"` here it happens
  to survive, but **use single quotes** for regexes. Always.
* `cut -d ':' -f 1` — fine, spaces after the flags are allowed.
* Cutting first then grepping: `cut -d: -f1 | grep bash` — wrong, you threw away the
  shell field before testing it.
