#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q10.py
[ "$1" = solution ] && A=./solution/q10.py
chmod +x "$A" 2>/dev/null

got=$( python3 "$A" apple fig banana; echo --; python3 "$A" cat dog cat bird cat; echo --; python3 "$A" a bb a bb 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
