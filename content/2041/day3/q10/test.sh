#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1
A=./q10.sh
[ "$1" = solution ] && A=./solution/q10.sh
chmod +x "$A" 2>/dev/null
got=$( for f in numbers_1.txt numbers_2.txt numbers_3.txt numbers_4.txt; do echo "== $f"; "$A" "$f"; done 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
