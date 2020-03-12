#!/bin/bash
for f in $(find . -name 1486.json); do
	name=$(cat $f | cut -d'"' -f 2)
	mv $(dirname $f) $(dirname $f)_$name
done
