# Q11 explanation

```sh
sed -n '/--BEGIN--/,/--END--/p' | sed '/--BEGIN--/d; /--END--/d'
```

1. `-n '/A/,/B/p'` — a **range address** between two patterns. Prints from the first
   line matching `--BEGIN--` through the first later line matching `--END--`, inclusive.
2. The second sed deletes the two marker lines.

## One-sed version
```sh
sed -n '/--BEGIN--/,/--END--/{ /--BEGIN--/d; /--END--/d; p; }'
```
Braces group commands under one address. Correct, but harder to get right under time
pressure — the two-stage pipeline is a perfectly good exam answer.

## Alternative with grep -v
```sh
sed -n '/--BEGIN--/,/--END--/p' | grep -Ev '^--(BEGIN|END)--$'
```

## Things to remember
* `p` without `-n` = duplicated lines.
* The range restarts: if `--BEGIN--`/`--END--` appear again later, that block prints too.
* `/--END--/` — the dashes are literal; `-` has no special meaning outside `[ ]`.
