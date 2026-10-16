#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1
A=./q30.py
[ "$1" = solution ] && A=./solution/q30.py
chmod +x "$A" 2>/dev/null
got=$( python3 "$A" a1; echo "=="; python3 "$A" d4; echo "=="; python3 "$A" g2 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
