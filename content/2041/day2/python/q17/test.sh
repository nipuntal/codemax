#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q17.py
[ "$1" = solution ] && A=./solution/q17.py
chmod +x "$A" 2>/dev/null

got=$( python3 "$A" -n 2 a.txt 2>/dev/null; echo "=="; python3 "$A" -n 2 a.txt b.txt 2>/dev/null; echo "=="; python3 "$A" -n 3 a.txt nosuch.txt b.txt 2>/dev/null; echo "=="; python3 "$A" -n 3 nosuch.txt 2>&1 1>/dev/null )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
