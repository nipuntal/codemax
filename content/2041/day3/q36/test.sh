#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1
A=./q36.sh
[ "$1" = solution ] && A=./solution/q36.sh
chmod +x "$A" 2>/dev/null
got=$( "$A" < awards.psv 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
