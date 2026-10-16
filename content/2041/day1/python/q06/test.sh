#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q06.py
[ "$1" = solution ] && A=./solution/q06.py
chmod +x "$A" 2>/dev/null

got=$( python3 "$A" a.txt b.txt nosuch.txt 2>/dev/null )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- your output -----"
    echo "$got"
    echo "----- expected --------"
    echo "$want"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
