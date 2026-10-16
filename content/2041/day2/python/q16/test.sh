#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q16.py
[ "$1" = solution ] && A=./solution/q16.py
chmod +x "$A" 2>/dev/null

got=$( python3 "$A" -d: -f2 data.txt; echo --; python3 "$A" -d: -f1,3 data.txt; echo --; python3 "$A" -d: -f3- data.txt; echo --; python3 "$A" -d: -f-2 data.txt; echo --; python3 "$A" -d: -f5,1,2 data.txt 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
