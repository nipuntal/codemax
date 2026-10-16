#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1
A=./q35.py
[ "$1" = solution ] && A=./solution/q35.py
chmod +x "$A" 2>/dev/null
got=$( python3 "$A" < table.psv; echo "=="; printf "course|zid|name\nCOMP2041|3383025|Thorpe, Ian\nCOMP1511|3360379|Costner, Kevin Augustus\n" | python3 "$A" 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
