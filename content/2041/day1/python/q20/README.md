# Python Q20 — a small real tool  (modules)

**Difficulty:** ⭐⭐⭐⭐ · **Target time:** 12 min

---
## LEARN FIRST — the exam checklist

Nothing new here. This question is Q1–Q19 assembled, which is what a real
10–15 minute exam question looks like.

Your routine for any "write a Python program" question:

1. **Read the expected output first**, character by character. Copy it into a comment.
2. **Sketch the data structure** before writing code. "A dict from student to a list
   of marks" — one sentence. Getting this right makes the code fall out.
3. **Usage check** if there are arguments.
4. **One loop to gather, one loop to report.** Resist doing both at once.
5. **Run it on the sample after ~10 lines**, not at the end.
6. **`diff` your output against the expected** — never compare by eye.

### The three data-structure choices, and when
| you need | use |
|---|---|
| how many of each | `dict` of counts — `d[k] = d.get(k, 0) + 1` |
| all the items per key | `dict` of lists — `d.setdefault(k, []).append(v)` |
| distinct things | `set` |
| ordered records | `list` of tuples, sorted with a `key=` |

Pick one in the first 60 seconds and commit.

---
## THE TASK

`results.csv` has a header line then rows:
```
zid,course,term,mark
```

Write `q20.py` taking **one argument**, the CSV filename, and printing a report:

```
Students: N
Courses: N
Top students:
  ZID AVG
  ZID AVG
  ZID AVG
Course averages:
  COURSE AVG (N students)
  ...
Failed at least one course: ZID, ZID
```

Details:
* **Students** / **Courses** are counts of distinct values.
* **Top students** — the 3 students with the highest **average mark across all their
  courses**, average to 1 decimal place, highest first, ties broken by zid ascending.
  Indented by exactly two spaces.
* **Course averages** — every course, **alphabetically**, its mean mark to 1 decimal
  place and how many students took it. Indented by two spaces.
* **Failed** — every student with any mark below 50, zids sorted ascending, joined
  with `", "`.
* Skip the header row.
* Wrong argument count, or unopenable file → print `Usage: ./q20.py <csvfile>` to
  stderr and `sys.exit(1)`.

Test invocation: `./q20.py results.csv`

---
## HINTS
<details><summary>Hint 1</summary>
Two dicts of lists: `marks_by_student[zid] = [marks...]` and
`marks_by_course[course] = [marks...]`. Plus a set for the failures.
</details>
<details><summary>Hint 2</summary>
Averages: write a tiny helper `def avg(xs): return sum(xs) / len(xs)` and use it
three times.
</details>
<details><summary>Hint 3</summary>
Top 3: `sorted(marks_by_student.items(), key=lambda kv: (-avg(kv[1]), kv[0]))[:3]`
</details>

## CHECK
```sh
./test.sh
diff <(./q20.py results.csv) expected_output.txt
```
