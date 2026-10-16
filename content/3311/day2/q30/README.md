# Question 30 &nbsp;·&nbsp; SQL &nbsp;·&nbsp; ★★★★☆

## The Tute-Lab promise


The schema says:

> *"Tute-Lab classes involve a tutorial class in a tutorial room followed
> immediately by a lab class generally in a computer lab"*

Take that as a claim to be tested. For each course that runs `Tute-Lab` classes,
report how many are in a Computer Lab, how many in a Tutorial Room, and how many
somewhere else entirely.

**View** `q30(course, ntutelabs, in_lab, in_tute, elsewhere)`, ordered by
`ntutelabs` descending, then course. Only courses with **3 or more** Tute-Labs.

> **Tests:** several conditional counts over one group — and reading the schema
> comments as part of the question.

<details><summary>Hint 1</summary>

`count(*) filter (where m.rtype = 'Computer Lab')`, or
`count(case when ... then 1 end)`.
</details>

<details><summary>Hint 2</summary>

The three sub-counts must add up to `ntutelabs`. Use that as your own check.
</details>
