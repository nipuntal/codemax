#!/bin/dash

claimed=""

is_claimed() {
    case " $claimed " in
        *" $1 "*) return 0 ;;
    esac
    return 1
}

for f in "$@"; do
    slug=$(echo "$f" | tr 'A-Z' 'a-z' | sed 's/[^a-z0-9]/_/g')

    if [ "$slug" = "$f" ]; then
        echo "# $f unchanged"
        claimed="$claimed $slug"
        continue
    fi

    target=$slug
    n=0
    while [ -e "$target" ] || is_claimed "$target"; do
        n=$((n + 1))
        target="$slug.$n"
    done

    echo "mv $f $target"
    claimed="$claimed $target"
done
