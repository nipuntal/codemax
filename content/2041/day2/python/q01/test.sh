#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q01.py
[ "$1" = solution ] && A=./solution/q01.py
chmod +x "$A" 2>/dev/null

got=$( python3 "$A" a b c; python3 "$A" hello; python3 "$A"; python3 "$A" one two three four 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
