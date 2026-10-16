#!/bin/bash

if [ $# -ne 2 ]; then
    echo "Usage: $0 <int> <int>" 1>&2
    exit 1
fi

a=$1
b=$2

echo "sum: $((a + b))"
echo "difference: $((a - b))"
echo "product: $((a * b))"
echo "quotient: $((a / b))"
