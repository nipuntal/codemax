#!/bin/bash
cd "$(dirname "$0")" || exit 1
F=q04.txt
[ "$1" = solution ] && F=solution/q04.txt
got=$(grep '^ANSWER:' "$F" | sed 's/^ANSWER: *//' | while IFS= read -r cmd; do
        if [ -z "$cmd" ]; then echo "(no answer)"; else
            eval "$cmd" 2>/dev/null | sort | cksum | cut -d' ' -f1
        fi
      done)
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then echo "PASS  ✅"; else
    echo "FAIL  ❌  (each line is a checksum of the lines your grep printed)"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
    echo
    echo "Compare your output directly, e.g.:"
    echo "  diff <(YOUR_GREP_1) <(grep -E '\\|Australia\\|' awards.psv)"
fi
