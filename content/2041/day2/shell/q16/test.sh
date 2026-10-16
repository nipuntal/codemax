#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q16.sh
[ "$1" = solution ] && A=./solution/q16.sh
chmod +x "$A" 2>/dev/null

got=$( "$A" hello world bookkeeper cat; "$A" aBBa xyz Foo bar; "$A"; "$A" mississippi banana; "$A" aA Bb cD ee 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
