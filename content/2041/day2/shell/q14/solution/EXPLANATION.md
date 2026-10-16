# Q14 explanation

```sh
i=1
while [ "$i" -le "$n" ]; do
    echo "note $i of $n" > "${prefix}${i}.txt"
    i=$((i + 1))
done
```

## The redirect is INSIDE the loop this time
Q13 wrote every line to one file, so the redirect went on `done`.
Here each iteration writes to a different file, so it goes on the `echo`.

That's the question to ask every time you write a loop that produces output:
**one destination, or one per iteration?** Getting it backwards produces either a
single file with everything in it, or n files each containing the last line.

## `${prefix}${i}.txt`
The braces delimit the variable name. Without them:
```sh
"$prefix$i.txt"     # works here -- '.' can't be part of a name, so $i ends at the dot
"$prefixi.txt"      # BROKEN -- the shell looks for a variable named `prefixi`
```
The first is fine and the second is a typo away from it. Brace by default and the
distinction stops mattering.

## `>` creates the file
No `touch` needed (and `touch` is banned). Output redirection creates or truncates.

## `-le` not `-lt`
`i` runs 1..n **inclusive**, so the loop continues while `i <= n`. With `-lt` you'd
create n−1 files. Test with `n=1` first — it catches this instantly.

## Quoting the filename
```sh
> "${prefix}${i}.txt"
```
If the prefix contained a space, the unquoted form would be two words and the shell
would report an ambiguous redirect. Always quote redirect targets built from
variables.

## Why `while` and not `for`
`seq` is banned and `{1..n}` is a bash extension that doesn't expand in dash **and**
can't take a variable bound anyway. Whenever a question bans `seq`, it wants a `while`
loop with `$(( ))`.
