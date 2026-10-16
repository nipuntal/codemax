#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1
A=./q24.sh
[ "$1" = solution ] && A=./solution/q24.sh
chmod +x "$A" 2>/dev/null
got=$( "$A" "Fields Medal" awards.psv; "$A" "Nobel Prize for (physics|peace)" awards.psv; "$A" "COMP2041 Prize" awards.psv; "$A" "Nobel Prize" awards.psv 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
