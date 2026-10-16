#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q20.py
[ "$1" = solution ] && A=./solution/q20.py
chmod +x "$A" 2>/dev/null

got=$( python3 "$A" < enrollments.txt; echo "=="; python3 "$A" 1 < enrollments.txt; echo "=="; python3 "$A" 3 < enrollments.txt; echo "=="; python3 "$A" 9 < enrollments.txt; echo "=="; python3 "$A" < more_enrollments.txt | wc -l 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
