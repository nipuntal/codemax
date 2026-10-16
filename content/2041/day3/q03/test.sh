#!/bin/bash
# ./test.sh           -> test YOUR answers in q03.txt
# ./test.sh solution  -> run the sample answers
cd "$(dirname "$0")" || exit 1
F=q03.txt
[ "$1" = solution ] && F=solution/q03.txt
got=$(grep '^ANSWER:' "$F" | sed 's/^ANSWER: *//' | while IFS= read -r cmd; do
        if [ -z "$cmd" ]; then echo "(no answer)"; else
            n=$(eval "$cmd" 2>/dev/null | wc -l | tr -d ' '); echo "$n"
        fi
      done)
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then echo "PASS  ✅"; else
    echo "FAIL  ❌  (line N = number of lines your grep N printed)"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
