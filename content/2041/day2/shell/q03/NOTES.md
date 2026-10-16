# Notes — "once per student, but duplicates across students"

## This is THE pattern of enrolment questions
Read the requirement again:
> each student's surname printed once, no matter how many courses …
> but if three students share a surname, print it three times

So you cannot just `sort -u` the surnames — that would collapse the two Wangs into
one. And you cannot skip dedup — Thorpe appears in 4 records but is 2 students.

**The answer: dedupe on something that identifies the student, then extract the
name.** The zID is that something.

```
[cut out ZID and NAME]  |  sort -u  |  [cut out just NAME]  |  sort
        ^                    ^                  ^
   keep the key         one line per       now throw the key
   AND the value          student             away
```

Dedupe **while the key is still attached**, then drop the key. This shape answers a
whole family of exam questions. Learn it as a shape, not as a specific command.

## Getting two fields at once
```sh
cut -d'|' -f2,3
```
`-f2,3` keeps fields 2 and 3 **and the delimiter between them**, giving
`3383025|Thorpe, Ian Augustus             `.
That's exactly what you want as a dedup key.

## Extracting the surname from `Surname, Given names`
Two ways:
```sh
cut -d',' -f1              # everything before the first comma
sed -E 's/,.*//'           # delete from the first comma to end of line
```
Both work. After the earlier `cut -f2,3` the line still has the zID on the front, so
you need to remove that too — one `sed` can do both jobs:
```sh
sed -E 's/^[0-9]+\|([^,]*),.*/\1/'
```

## Edge cases
* Trailing spaces in the name field. If you extract with `cut -d',' -f1` you stop
  before them, so you're fine. If you extract the *given* names (Q5) you are not.
* Two students named `Wang, Wei` with **different zIDs** — dedup on the name alone
  would wrongly print one. Dedup on zID.
* Same student, same name, 4 records (`Thorpe, Ian Augustus`, zid 3383025) — must
  collapse to one.
* Note the data also contains `Thorpe, Ian Fredrick` (zid 3371161): different student,
  same surname *and* same first name. Q5 will make you think about that one.
