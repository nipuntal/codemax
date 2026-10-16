#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1
A=./q19.sh
[ "$1" = solution ] && A=./solution/q19.sh
chmod +x "$A" 2>/dev/null
got=$( "$A" file0.txt file1.txt file2.txt file3.txt file4.txt file5.txt file6.txt file7.txt file8.txt; echo "=="; "$A" file6.txt file4.txt file1.txt file2.txt file3.txt file5.txt file7.txt file8.txt file0.txt; echo "=="; "$A" file8.txt file7.txt file6.txt file5.txt file4.txt file3.txt file2.txt file1.txt file0.txt; echo "=="; "$A" file3.txt file0.txt file3.txt file0.txt file3.txt file0.txt; echo "=="; "$A" file1.txt file2.txt file3.txt file4.txt 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
