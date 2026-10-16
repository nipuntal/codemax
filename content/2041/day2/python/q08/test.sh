#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q08.py
[ "$1" = solution ] && A=./solution/q08.py
chmod +x "$A" 2>/dev/null

got=$( printf "the cat\nthe dog\n" | python3 "$A" 3; printf "Hello World\nhello world\nHELLO there friend\n" | python3 "$A" 4; printf "one two\nthree\n" | python3 "$A" 10; printf "first line here\n" | python3 "$A" 1 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
