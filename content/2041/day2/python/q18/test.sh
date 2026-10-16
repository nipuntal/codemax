#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q18.py
[ "$1" = solution ] && A=./solution/q18.py
chmod +x "$A" 2>/dev/null

got=$( python3 "$A" -n a.txt; echo "=="; python3 "$A" -n a.txt b.txt; echo "=="; python3 "$A" -v ctrl.txt; echo "=="; python3 "$A" -n -v ctrl.txt 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
