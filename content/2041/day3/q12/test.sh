#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1
A=./q12.py
[ "$1" = solution ] && A=./solution/q12.py
chmod +x "$A" 2>/dev/null
got=$( for f in sorted1.txt unsorted1.txt single.txt empty.txt equal.txt; do python3 "$A" "$f"; done 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
