#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1
A=./q27.sh
[ "$1" = solution ] && A=./solution/q27.sh
chmod +x "$A" 2>/dev/null
got=$( rm -rf t1 t2; cp -R d1 t1; cp -R d2 t2; "$A" t1 t2; echo hello everyone > t1/file1; "$A" t1 t2; echo 3 > t2/b/c/three; "$A" t1 t2; echo 3 > t1/b/three; "$A" t1 t2; rm -rf t1 t2 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
