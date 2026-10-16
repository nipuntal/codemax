#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q13.py
[ "$1" = solution ] && A=./solution/q13.py
chmod +x "$A" 2>/dev/null

got=$( printf "Hello World\nCOMP2041 rocks\n" | python3 "$A" 13; echo --; printf "Dwwdfn dw gdzq!\n" | python3 "$A" -3; echo --; printf "This is the way\nNot with a bang 2026\n" | python3 "$A" 443 | python3 "$A" -443 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
