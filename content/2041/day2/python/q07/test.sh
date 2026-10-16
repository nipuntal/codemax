#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q07.py
[ "$1" = solution ] && A=./solution/q07.py
chmod +x "$A" 2>/dev/null

got=$( python3 "$A" racecar hello Level noon test; python3 "$A"; python3 "$A" "A man, a plan, a canal: Panama" nope "Was it a car or a cat I saw?"; python3 "$A" a ab aba abba abcba "x!x"; python3 "$A" 12321 12345 "!!!" "" 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
