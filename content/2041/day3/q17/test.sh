#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1
A=./q17.sh
[ "$1" = solution ] && A=./solution/q17.sh
chmod +x "$A" 2>/dev/null
got=$( rm -f script4.pl; "$A" script.rs; "$A" script1; "$A" script2; "$A" script3; echo "=="; "$A" script1 script2 script3 script4 script5; echo "=="; touch script4.pl; "$A" script4; rm -f script4.pl; echo "== unchanged:"; ls script* 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
