# Q2 explanation

```sh
head -n 9 | tail -n 5
```

* `head -n 9` → lines 1..9
* `tail -n 5` → last 5 of those → lines 5..9 ✅

Arithmetic: count = 9 - 5 + 1 = **5**.

## Alternatives worth knowing
```sh
sed -n '5,9p'      # sed: print (p) only lines 5..9, -n suppresses default printing
tail -n +5 | head -n 5   # skip to line 5, then take 5
```
All three are exam-acceptable. `sed -n 'M,Np'` is the shortest and worth memorising.

## Common mistakes
* `head -n 9 | tail -n 4` → gives lines 6..9. Off by one.
* `head -n 5 | tail -n 9` → gives lines 1..5. Order matters!
