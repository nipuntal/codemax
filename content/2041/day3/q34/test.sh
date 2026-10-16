#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
cd "$(dirname "$0")" || exit 1
A=./q34.sh
[ "$1" = solution ] && A=./solution/q34.sh
chmod +x "$A" 2>/dev/null
got=$( "$A" Data.TXT My_Notes.TXT notes.txt notes-txt report-2026.md notes_txt; echo "== unchanged:"; ls | grep -v -e WALK -e expected -e solution -e test.sh -e README -e "^q34" 2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
