#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1
A=./q38.sh
[ "$1" = solution ] && A=./solution/q38.sh
chmod +x "$A" 2>/dev/null
got=$( "$A" cat words.txt; echo "exit=$?"; echo "=="; "$A" tip words.txt 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
