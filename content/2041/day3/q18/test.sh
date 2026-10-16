#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1
A=./q18.sh
[ "$1" = solution ] && A=./solution/q18.sh
chmod +x "$A" 2>/dev/null
got=$( "$A" file0.txt file1.txt file2.txt file3.txt file4.txt file5.txt file6.txt; echo "=="; "$A" file0.txt file1.txt file2.txt file4.txt file8.txt; echo "=="; "$A" file2.txt file5.txt file7.txt; echo "=="; "$A"; echo "exit=$?" 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
