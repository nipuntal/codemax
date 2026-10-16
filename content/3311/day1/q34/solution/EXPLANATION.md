# Module 34

### Check, then act

Three lookups, each with its own message, in the order the spec lists them: room,
facility, then the pairing. A call with **both** a bad room and a bad facility
reports the room, because that is the order given.

**Specs are explicit about this order precisely because it is observable**, and
the check tests it.

### `select 1 from ...` for an existence test

```python
cur.execute("select 1 from Has where room_id = %s and facility_id = %s", [rid, fid])
if cur.fetchone() is not None:
```

We do not care what comes back, only whether anything does. `select 1` says that
plainly and avoids dragging columns across for no reason.

`is not None`, not truthiness — module 27's rule.

### `commit()` is not optional

Without it the insert lives only inside this connection and vanishes when the
script exits. The **second test** in this module is what catches that: it runs
the script twice and expects `already has` the second time. Forget the commit
and the second run inserts again and prints the success message.

That test exists because forgetting `commit()` is so easy.

### `rollback()` in the except

If the insert fails for a reason we did not anticipate, the connection is left in
an aborted transaction (module 31). Rolling back returns it to a usable state.
Here we return immediately so it hardly matters — but in a script that carries
on, skipping it means every later query fails.

### Checking first versus catching the error

We could skip the third lookup and let the primary key on `Has` refuse the
duplicate:

```python
except psycopg2.errors.UniqueViolation:
    print(f"{room} already has {fname}")
    db.rollback()
```

That is arguably better — one fewer round trip, and immune to somebody else
inserting the same row in between. The explicit check reads more plainly and
matches the spec's wording. Both are correct; know that the second exists.

### Putting the database back

```bash
../reload-db
```

Rebuilds `classes` from the official dump. The check does this automatically
before running the tests, which is why you can run it as often as you like.
