#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q13.sh
[ "$1" = solution ] && A=./solution/q13.sh
chmod +x "$A" 2>/dev/null

got=$( rm -f out.txt; "$A" 6 2 out.txt; cat out.txt; "$A" 7 7 one.txt; echo "--"; cat one.txt; rm -f out.txt one.txt 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
