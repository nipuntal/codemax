# Q19 explanation

## The function
```sh
classify() {
    case "$1" in
        *.txt|*.md) echo "text" ;;
        ...
    esac
}
```
* `$1` here is the **function's** first argument (the filename we passed).
* `*.txt|*.md` — glob alternatives. `*` matches any prefix, so `notes.txt` matches.
* `*)` last = catch-all.
* We "return" a value by `echo`ing it; the caller does `type=$(classify "$f")`.

## The option
```sh
if [ "$1" = "-q" ]; then
    quiet=1
    shift
fi
```
* `=` for string comparison (`-eq` is for numbers).
* Quote `"$1"` — with no arguments at all, `[ $1 = "-q" ]` becomes `[ = -q ]`, a
  syntax error. Quoted, it becomes `[ "" = "-q" ]`, which is simply false. **This is
  exactly why you quote.**
* `shift` removes `-q` so the later `"$@"` is only filenames.

## The usage check comes AFTER the shift
Order matters: `./q19.sh -q` with no files should be a usage error, and it is,
because `shift` reduced `$#` to 0 first.

## case vs if
`case` matches **globs**, `if [ ... ]` matches values. For "does this string end in
.txt", `case` is the natural tool. The `if` version would need
`[ "${f##*.}" = txt ]` or a `grep -q`.
