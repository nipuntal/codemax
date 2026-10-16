#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1

# This question edits files IN PLACE -- always start from pristine data.
cp ".frost.txt.orig" "frost.txt"
[ "$1" = reset ] && { echo "restored: frost.txt"; exit 0; }
A=./q19.sh
[ "$1" = solution ] && A=./solution/q19.sh
chmod +x "$A" 2>/dev/null

got=$( cp frost.txt work.txt; "$A" work.txt; echo "stdout-bytes=$?"; cat work.txt; "$A" work.txt; echo "-- after second run:"; cat work.txt; rm -f work.txt 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
