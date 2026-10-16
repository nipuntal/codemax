#!/bin/sh
sed -n '/--BEGIN--/,/--END--/p' | sed '/--BEGIN--/d; /--END--/d'
