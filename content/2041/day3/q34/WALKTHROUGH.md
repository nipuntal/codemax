# Q34 Walkthrough — Print Safe Rename Commands

> **Read this after you have attempted the question.**

The third "print the commands" question (after Q16 and Q17), with a twist: the script
must track names it has **already promised to create**.

---
## PART 1 — TEACH

### The new idea: a name can be taken by a command you haven't run yet
Your script prints `mv Notes.TXT notes.txt`… except `notes.txt` already exists.
Fine — append `.1`.

In the sample, `notes.txt` and `notes-txt` both slug to `notes_txt`. A file called
`notes_txt` already exists, so the first becomes `notes_txt.1`. The second must then
become `notes_txt.2` — even though `[ -e notes_txt.1 ]` is **false**, because the
command you already printed will create it.

So "is this name free?" has **two** parts:
```sh
[ -e "$target" ]                        # taken on disk
case " $claimed " in *" $target "*)     # taken by a command I already printed
```
Forgetting the second produces commands that clobber each other when run. This is the
mark.

**Whenever a script plans a sequence of operations without performing them, it must
model their cumulative effect.**

### The membership test for a space-separated list
```sh
case " $claimed " in
    *" $target "*) ... ;;
esac
```
Spaces around **both** the list and the item, so the match is on whole entries —
otherwise `notes.txt` would match inside `notes.txt.1`. That distinction is live in this
question.

Shell has no arrays and no `in` operator; this is the substitute.

### Combining a test command with a `case` in one condition
```sh
is_claimed() {
    case " $claimed " in
        *" $1 "*) return 0 ;;
    esac
    return 1
}

while [ -e "$target" ] || is_claimed "$target"; do
```
A `case` has no exit status meaning "matched", so wrap it in a function that `return`s
0 (success/true) on a match and 1 otherwise. Now it composes with `||` like any other
command.

`return 0` = true, `return 1` = false — **shell exit statuses are inverted** compared to
C-like languages, and a function is the tidiest way to hide that.

Inlining it is possible but unreadable:
```sh
while [ -e "$target" ] || case " $claimed " in *" $target "*) true ;; *) false ;; esac; do
```
**In an exam, write the version you can get right.**

### The suffix loop
```sh
target=$slug
n=0
while ...taken...; do
    n=$((n + 1))
    target="$slug.$n"
done
```
Try the bare name first, then `.1`, `.2`, … A `while` (not `if`) because `.1` might be
taken too — and in the sample data it is.

Note `target` is rebuilt from `$slug` each time, not appended to — otherwise you'd get
`notes_txt.1.2`.

### Building the slug
```sh
slug=$(echo "$f" | tr 'A-Z' 'a-z' | sed 's/[^a-z0-9]/_/g')
```
Lowercase with `tr`, then replace every remaining non-alphanumeric with `_`.
Order matters: lowercase **first**, so the `sed` class only needs `a-z0-9`.

`tr` reads stdin only, hence the `echo |`. (`${f,,}` is a **bash** extension and fails
under dash.)

### Detecting "already a slug"
```sh
if [ "$slug" = "$f" ]; then
```
Compare the transformed string with the original — simpler than testing for the presence
of uppercase or punctuation. **Transform, then compare** beats "does it contain…".

Note the unchanged file **still claims its name**: `notes_txt` is left alone, but the
name is occupied, so later files must route around it.

---
## PART 2 — THE APPROACH

1. `claimed=""`.
2. For each file: lowercase it.
3. Same as the original → print `# NAME unchanged`, add to `claimed`, `continue`.
4. Otherwise find the first free target: not on disk **and** not already claimed,
   trying `name`, `name.1`, `name.2`, …
5. Print the `mv`, add the target to `claimed`.

Test with two files whose lowercase names collide but where neither exists yet — that's
the case the naive version fails.

---
## PART 3 — THE SOLUTION

See `solution/q34.sh`.

Walking the sample:
* `Data.TXT` → `data_txt`, free → `mv Data.TXT data_txt`, claim it
* `My_Notes.TXT` → `my_notes_txt`, free → `mv`, claim
* `notes.txt` → `notes_txt`, **exists on disk** → `notes_txt.1`, free → `mv`, claim
* `notes-txt` → `notes_txt` on disk, `.1` **claimed** → `notes_txt.2` → `mv`, claim
* `report-2026.md` → `report_2026_md`, free → `mv`
* `notes_txt` → slug equals the name → `# notes_txt unchanged`

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **Nothing is renamed.** Run twice; identical output. No `mv` executed.
* **`claimed` must include names promised by earlier `mv` lines**, not just what's on
  disk. `notes-txt` → `notes_txt.2` is the line that proves it; a script checking only
  `[ -e ]` prints `notes_txt.1` twice.
* **The unchanged file still claims its name.**
* **Whole-word membership test** — `notes_txt` must not match inside `notes_txt.1`.
* **Rebuild `target` from `$slug`** each attempt, don't append repeatedly.
* **`tr`, not `${f,,}`** — the latter is bash-only and this must run under dash.
* Beware if you test on macOS: its default filesystem is **case-insensitive**, so
  `[ -e data.txt ]` is true when only `Data.TXT` exists. CSE's Linux filesystem is
  case-sensitive. This question's slugs avoid the issue by construction (they use `_`
  where the originals have `.`), but it is a real trap when practising renames locally.
* The exact messages: `# NAME unchanged` with the `#`, and a bare `mv OLD NEW`.
