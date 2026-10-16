#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q11.sh
[ "$1" = solution ] && A=./solution/q11.sh
chmod +x "$A" 2>/dev/null

got=$( "$A" < report.txt 2>&1 )
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
