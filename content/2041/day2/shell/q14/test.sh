#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=./q14.sh
[ "$1" = solution ] && A=./solution/q14.sh
chmod +x "$A" 2>/dev/null

got=$( rm -f note*.txt; "$A" 4 note; for f in note1.txt note2.txt note3.txt note4.txt; do echo "$f: $(cat $f)"; done; rm -f note*.txt 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
