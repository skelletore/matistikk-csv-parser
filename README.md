# PARSE.JS 🚀

A node.js script for parsing csv files to JSON-files. Each row from the csv-file is exported to a JSON-file, named by the rule `<test_attempt>_<task_instance>.json`

## INSTALL

The parser depends on `csvtojson` node.js library. To fetch/install dependencies run `npm install`.

## USAGE

The script requires a csv file, that is provided as the first argument. Output path is not required, by default it is set to `./answers`. To override default value provide a second argument (not including the last `/`). E.g. the command`node parse.js data.csv ./unicorn` will parse data.csv and output to ./unicorn folder.
