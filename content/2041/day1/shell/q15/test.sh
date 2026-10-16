#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q15.sh
[ "$1" = solution ] && A=./solution/q15.sh
chmod +x "$A" 2>/dev/null

got=$( "$A" a.txt b.txt nosuch.txt c.txt 2>&1 | sed "s/  */ /g" )
want=$(sed "s/  */ /g" expected_output.txt)
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
