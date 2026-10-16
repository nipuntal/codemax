#!/bin/sh
sort | uniq -c | sort -rn | head -n 3
