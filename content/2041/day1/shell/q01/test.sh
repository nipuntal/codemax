#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q01.sh
[ "$1" = solution ] && A=./solution/q01.sh
chmod +x "$A" 2>/dev/null

got=$( "$A" < animals.txt 2>&1 | sed "s/^[[:space:]]*//;s/[[:space:]]*$//" )
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
