#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q09.py
[ "$1" = solution ] && A=./solution/q09.py
chmod +x "$A" 2>/dev/null

got=$( printf "I spent \$ 15.50 for\n3.3 kg apples yesterday.\n2000 is a leap year.\n" | python3 "$A"; echo --; printf "a 0.01\nb .5\nc -0.9\n" | python3 "$A"; echo --; printf "a -.5\nb -5\nc --90--\n" | python3 "$A"; echo --; printf "the quick brown f42ox\n4 9 42 2 4\n1 2 3 4 42.0\nno forty two\nlast 42\n" | python3 "$A"; echo --; printf "I love programming in Shell.\nbut I like Python better.\n" | python3 "$A"; echo -- 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
