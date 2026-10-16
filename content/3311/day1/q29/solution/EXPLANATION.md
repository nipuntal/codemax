# Module 29

### The format string, character by character

```python
f"{name:<20} {cap:>3}  {n:>4}"
```

| piece | produces |
|---|---|
| `{name:<20}` | `AGSM-LG06␣␣␣␣␣␣␣␣␣␣␣` — left, padded to 20 |
| one literal space | `␣` |
| `{cap:>3}` | ` 30` — right, width 3 |
| two literal spaces | `␣␣` |
| `{n:>4}` | `   1` — right, width 4 |

When your output looks right but the test fails, this is where to look:

```bash
diff <(./q29.py 'Computer Lab') tests/01.expected
cat -A tests/01.expected | head -3
```

### No trailing spaces, by construction

The last field is a right-aligned number, so each line ends with a digit. Had
the padded **name** been last, every line would end in invisible spaces and
every line would fail.

**Arrange for a right-aligned field to be last, or `.rstrip()` the line.**

### `rtype::text = %s`

The room type comes from the command line and could be anything. Comparing it
directly against the enum column would raise

```
InvalidTextRepresentation: invalid input value for enum roomtype: "Broom Cupboard"
```

and the driver would print `DB error: …` — not the message the spec asked for.

Casting the **column** to text makes it an ordinary string comparison, so an
unknown type quietly returns no rows and the `if not rows` branch produces
`No such room type`.

### `left join` and `count(c.id)`

Module 12's lesson. A room with no classes must still appear with `0`.
`count(*)` would report 1, because the outer join produces one all-null row.

Every room in this data does have classes, so it makes no difference **today** —
which is exactly why you should write it correctly rather than test it.

### The total, accumulated in the loop

```python
total += n
```

The numbers are already in hand, so summing them costs nothing. A second query
for `sum(...)` would be another round trip for something you are holding.

### `len(rows)`

Same idea: the room count comes from the list you already fetched.
