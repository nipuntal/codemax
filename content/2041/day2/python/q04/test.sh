#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q04.py
[ "$1" = solution ] && A=./solution/q04.py
chmod +x "$A" 2>/dev/null

got=$( python3 "$A" seven.txt 1; echo --; python3 "$A" seven.txt 3; echo --; python3 "$A" seven.txt 7; echo --; python3 "$A" six.txt 2; echo --; python3 "$A" empty.txt 0; echo -- 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
