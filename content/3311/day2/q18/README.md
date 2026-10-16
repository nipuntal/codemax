# Question 18 &nbsp;·&nbsp; SQL &nbsp;·&nbsp; ★★★☆☆

## Lab classes in the wrong sort of room


The scenario says *"different kinds of classes are scheduled in an appropriate
kind of room (e.g. a lab class is scheduled in a computer lab)"*. The data does
not always agree.

Count, for each room type that is **not** a Computer Lab, how many **Lab Class**
offerings are held in rooms of that type.

**View** `q18(rtype, nclasses, ncourses)` where `ncourses` is how many
**distinct courses** are affected. Most classes first, then by room type.

> **Tests:** reading the scenario for the rule, `count(distinct)`.
> The schema comments are there for a reason — the exam's own notes point at
> exactly this.

<details><summary>Hint</summary>

`where c.ctype = 'Lab Class' and m.rtype <> 'Computer Lab'`, then group by
`m.rtype`.
</details>
