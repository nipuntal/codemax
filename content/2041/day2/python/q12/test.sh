#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q12.py
[ "$1" = solution ] && A=./solution/q12.py
chmod +x "$A" 2>/dev/null

got=$( python3 "$A" 2 < input.txt; echo --; python3 "$A" 1 < input.txt; echo --; python3 "$A" 3 < input.txt 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
