#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q05.py
[ "$1" = solution ] && A=./solution/q05.py
chmod +x "$A" 2>/dev/null

got=$( printf "hi\nhow\nare\nyou\n  HI\n" | python3 "$A" 2; echo --; printf "hi\nhi hi\nhi hi hi\nhi   HI\n" | python3 "$A" 2; echo --; printf "Hello World\nline 2\nhello    world\nline 3\nHELLO WORLD\n" | python3 "$A" 3; echo --; printf "a\nb\na\nb\n" | python3 "$A" 4; echo -- 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
