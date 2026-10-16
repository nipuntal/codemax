#!/bin/bash
# ./test.sh           -> test YOUR answer
# ./test.sh solution  -> test the sample solution
cd "$(dirname "$0")" || exit 1
A=$PWD/q15.sh
[ "$1" = solution ] && A=$PWD/solution/q15.sh
chmod +x "$A" 2>/dev/null

run() {
    rm -rf tmpdir && mkdir tmpdir && cd tmpdir || return
    echo "--- normal case"
    touch README.bak main.c.bak notes.txt.bak
    dash "$A"; echo "status=$?"
    ls
    echo "--- clash case"
    rm -f *; touch a.bak b.bak a
    dash "$A"; echo "status=$?"
    ls
    cd ..; rm -rf tmpdir
}

got=$(run 2>&1)
want=$(cat expected_output.txt)
if [ "$got" = "$want" ]; then
    echo "PASS  ✅"
else
    echo "FAIL  ❌"
    echo "----- diff (< yours, > expected) -----"
    diff <(echo "$got") <(echo "$want")
fi
