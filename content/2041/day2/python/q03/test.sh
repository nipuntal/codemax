#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q03.py
[ "$1" = solution ] && A=./solution/q03.py
chmod +x "$A" 2>/dev/null

got=$( python3 "$A" d c b d c a a d; python3 "$A" bird cow bird cow fish; python3 "$A" how much wood would a woodchuck chuck; python3 "$A" echo echo echo; python3 "$A" 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
