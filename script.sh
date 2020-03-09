#!/bin/bash
for f in $(find . -name 1540.json); do
	name=`cat $f`
	name=${name: 1 : -1}
	mv $(dirname $f) $(dirname $f)_$name
done
