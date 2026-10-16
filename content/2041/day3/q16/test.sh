#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1
A=./q16.sh
[ "$1" = solution ] && A=./solution/q16.sh
chmod +x "$A" 2>/dev/null
got=$( "$A" run1 run2 notes.txt run3; echo "-- files unchanged:"; ls -l run1 run3 | cut -c1-10 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
