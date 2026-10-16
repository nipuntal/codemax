#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1
A=./q13.py
[ "$1" = solution ] && A=./solution/q13.py
chmod +x "$A" 2>/dev/null
got=$( python3 "$A" file1 file2; python3 "$A" file2 file1; python3 "$A" file1b file2; python3 "$A" file2 file3; python3 "$A" a b; python3 "$A" file1 short 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
