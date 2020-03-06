const csv = require("csvtojson")
const fs = require("fs")
if (process.argv.length <= 2) {
  console.log(`Usage: ${__filename} <path/filename> <output path>`)
  process.exit(-1)
}

const fn = process.argv[2]
const output = process.argv[3] ? process.argv[3] : "./answers"

csv()
  .fromFile(fn)
  .then(jsonObj => {
    // check if dir exists
    if (!fs.existsSync(output)) fs.mkdirSync(output)
    const answers = Object.entries(parse(jsonObj))
    for (const [test, TASKS] of answers) {
      const tasks = Object.entries(TASKS)
      for (const [task, ans] of tasks) {
        if (
          ans !== null &&
          ans !== "null" &&
          Object.entries(ans).length !== 0 &&
          ans.constructor === Object
        ) {
          const entries = Object.entries(ans)
          const name = `${output}/${test}_${task}.json`
          //   console.log(entries[0][1])
          console.log(`writing ${name}...`)
          write(name, JSON.stringify(entries[0][1]))
          //   console.log(entries)
          //   console.assert(entries != null, entries)
          //   console.log(ans)
        }
      }
    }
  })

function parse(arr = []) {
  let res = {}
  for (let el of arr) {
    const test_attempt = parseInt(el.test_attempt)
    const task_instance = parseInt(el.task_instance)
    if (!(test_attempt in res)) res[test_attempt] = {}
    const student = res[test_attempt]
    if (!(task_instance in student)) student[task_instance] = {}

    // student[task_instance] = el.data.match("paperJSON") ? null : sanitize(el.data)
    student[task_instance] = sanitize(el.data)
  }
  return res
}

function sanitize(arg = "") {
  /*
   * replace snake_case with camelCase for a select keys
   * replace ' with ", matistikk exports strings as '
   * replace strings in JSON-serialization of JS-objects [1]
   */
  let d = ""
  d = arg
  d = d
    .replace(/None/g, "null")
    .replace(/definition\_string/g, "definitionString")
    .replace(/object\_name/g, "objectName")
    .replace(/object\_type/g, "objectType")
    .replace(/delta\_time/g, "deltaTime")
    .replace(/\'/g, '"')
    .replace(/(?<="\[.*)((?<!\])(")(?!\[))(?=.*\]")/g, "'") // Really slow, can maybe be optimized. see [1]

  let res = null
  try {
    res = JSON.parse(d)
  } catch (e) {
    console.log(d)
  }
  return res
}

async function write(name, data) {
  fs.writeFile(name, data, err => {
    if (err) throw err
    console.log("wrote file", name)
  })
}
