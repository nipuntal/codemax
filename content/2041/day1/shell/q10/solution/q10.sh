#!/bin/sh
sed -E 's/[0-9]+/$&/g; s/dollars/AUD/g'
