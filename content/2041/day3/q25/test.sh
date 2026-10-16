#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1
A=./q25.sh
[ "$1" = solution ] && A=./solution/q25.sh
chmod +x "$A" 2>/dev/null
got=$( "$A" "Nobel Prize for physics" awards.psv; echo "=="; "$A" "Nobel Prize for (chemistry|physics)" awards.psv; echo "=="; "$A" "Nobel Prize for.*" awards.psv; echo "=="; "$A" "COMP2041 Distinguished Achievers" awards.psv; echo "=="; "$A" "ACM Turing Award" awards.psv; echo "(no gaps)" 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
