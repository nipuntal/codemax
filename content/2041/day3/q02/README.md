# Day 3 · Q2 — Winners By Country  ·  [python]  ·  ⭐⭐ · 6 min

Same `awards.psv` format:
```
Award Name|Award Year|Winner Name|Winner Gender|Winner Country|Winner Birth Year
```

Write a Python program `q02.py` that reads this data on **stdin** and prints the
**5 countries with the most awards**, most first, as:
```
COUNTRY COUNT
```
Ties are broken by country name **ascending**.

```
./q02.py < awards.psv
China 59
Italy 59
Japan 59
Australia 58
Austria 56
```

* Read from standard input.
* Python only. No external programs, no `subprocess`.

```sh
./test.sh          # then read WALKTHROUGH.md
```
