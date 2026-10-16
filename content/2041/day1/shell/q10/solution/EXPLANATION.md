# Q10 explanation

```sh
sed -E 's/[0-9]+/$&/g; s/dollars/AUD/g'
```

* `s/[0-9]+/$&/g` — find each run of digits, replace it with `$` followed by
  **`&`** (the text that matched). `/g` so *every* number on the line is done.
* `;` separates two sed commands. They run in order on each line.
* `s/dollars/AUD/g` — the word swap.

## Order matters here?
Not in this case, but think about it: if you did the `AUD` swap first, nothing changes
for the digits. If a replacement *introduced* digits, order would matter. Get in the
habit of asking.

## `&` is the star of the show
`s/x/[&]/` wraps every `x` in brackets. Very common exam move:
```sh
sed -E 's/^/> /'          prefix every line with "> "
sed -E 's/$/;/'           append ; to every line
sed -E 's/[0-9]+/<&>/g'   bracket every number
```

## Trap: `$` in double quotes
`sed -E "s/[0-9]+/$&/g"` — the shell mangles `$&`. **Single quotes always.**

## Two -e flags do the same thing
```sh
sed -E -e 's/[0-9]+/$&/g' -e 's/dollars/AUD/g'
```
