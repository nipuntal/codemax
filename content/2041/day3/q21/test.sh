#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> run the sample solution
# ./test.sh reset     -> just restore hello.txt / frost.txt and exit
cd "$(dirname "$0")" || exit 1

# This question edits files IN PLACE, so always start from pristine data.
cp .hello.orig hello.txt
cp .frost.orig frost.txt
[ "$1" = reset ] && { echo "hello.txt and frost.txt restored"; exit 0; }

A=./q21.py
[ "$1" = solution ] && A=./solution/q21.py
chmod +x "$A" 2>/dev/null

got=$(
  cp hello.txt h.txt; python3 "$A" 80 h.txt; cat h.txt; echo "=="
  python3 "$A" 23 h.txt; cat h.txt; echo "=="
  cp hello.txt h.txt; python3 "$A" 12 h.txt; cat h.txt; echo "=="
  cp hello.txt h.txt; python3 "$A" 6 h.txt; cat h.txt; echo "=="
  cp frost.txt f.txt; python3 "$A" 20 f.txt; cat f.txt; echo "=="
  cp frost.txt f.txt; python3 "$A" 10 f.txt; cat f.txt
  rm -f h.txt f.txt
  2>&1 )
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
