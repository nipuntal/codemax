#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1

# This question edits files IN PLACE -- always start from pristine data.
cp ".messy.txt.orig" "messy.txt"
cp ".blanks.txt.orig" "blanks.txt"
[ "$1" = reset ] && { echo "restored: messy.txt blanks.txt"; exit 0; }
A=./q20.py
[ "$1" = solution ] && A=./solution/q20.py
chmod +x "$A" 2>/dev/null
got=$( cp messy.txt w1.txt; python3 "$A" w1.txt; echo "stdout-empty"; cat w1.txt; echo "== second run idempotent:"; python3 "$A" w1.txt; cat w1.txt; echo "=="; cp blanks.txt w2.txt; python3 "$A" w2.txt; cat w2.txt; rm -f w1.txt w2.txt 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
