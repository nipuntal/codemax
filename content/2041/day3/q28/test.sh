#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1
A=./q28.sh
[ "$1" = solution ] && A=./solution/q28.sh
chmod +x "$A" 2>/dev/null
got=$( "$A" a1; echo "=="; "$A" d4; echo "=="; "$A" h8 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
