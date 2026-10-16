# Day 3 · Q34 — Print Safe Rename Commands  ·  [shell script]  ·  ⭐⭐⭐⭐ · 12 min

Write a POSIX-compatible shell script `q34.sh` which, given one or more filenames,
**prints** `mv` commands that would rename each file to its **slug**: lowercase, with
every character that is not a letter or digit replaced by an underscore.

```
Data.TXT   ->  data_txt
report-2026.md  ->  report_2026_md
```

If a file's name is already its own slug, print `# NAME unchanged` instead.

If the slug is already taken — either by a file **on disk**, or by a rename this script
has **already printed** — append `.1`, `.2`, … until the name is free.

The script must **print** the commands, not execute them, and must not change anything.

```
ls
Data.TXT  My_Notes.TXT  notes-txt  notes.txt  notes_txt  report-2026.md
./q34.sh Data.TXT My_Notes.TXT notes.txt notes-txt report-2026.md notes_txt
mv Data.TXT data_txt
mv My_Notes.TXT my_notes_txt
mv notes.txt notes_txt.1
mv notes-txt notes_txt.2
mv report-2026.md report_2026_md
# notes_txt unchanged
```

* Filenames contain no whitespace and no slashes.
* `#!/bin/dash`, POSIX only. No `awk`. No temporary files.
* Permitted: `basename cat cut echo grep head ls printf sed sort tail test tr wc`

```sh
./test.sh          # then read WALKTHROUGH.md
```
