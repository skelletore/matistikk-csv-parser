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
    // console.log(jsonObj)

    if (!fs.existsSync(output)) fs.mkdirSync(output)
    const answers = Object.entries(parse(jsonObj))
    // process.exit(0)
    for (const [date, DATES] of answers) {
      const dates = Object.entries(DATES)
      for (const [test, TASKS] of dates) {
        const tasks = Object.entries(TASKS)
        for (const [task, ans] of tasks) {
          // console.log(task)
          // console.log(ans)
          if (
            ans !== null &&
            ans !== "null" &&
            Object.entries(ans).length !== 0 &&
            ans.constructor === Object
          ) {
            const entries = Object.entries(ans)

            const folder = `${output}/${date}/${test}`
            if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })
            const name = `${folder}/${task}.json`
            write(name, JSON.stringify(entries[0][1]))
          }
        }
      }
    }
  })

function parse(arr = []) {
  let res = {}
  for (let el of arr) {
    const test_attempt = parseInt(el.test_attempt)
    const task_instance = parseInt(el.task_instance)
    const time = el.created_at.slice(0, 10)
    if (!(time in res)) res[time] = {}
    const date = res[time]
    if (!(test_attempt in date)) date[test_attempt] = {}
    const student = date[test_attempt]
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
  console.time("regex")
  d = d
    .replace(/None/g, "null")
    .replace(/definition\_string/g, "definitionString")
    .replace(/object\_name/g, "objectName")
    .replace(/object\_type/g, "objectType")
    .replace(/delta\_time/g, "deltaTime")
    .replace(/\'/g, '"')
    .replace(/(?<="\[.*)((?<!\])(")(?!\[))(?=.*\]")/g, "'") // Really slow, can maybe be optimized. see [1]
  console.timeEnd("regex")
  let res = null
  try {
    res = JSON.parse(d)
  } catch (e) {
    console.log("\x1b[4m\x1b[33m%s\x1b[0m:%s", "ERR", d)
  }
  return res
}

async function write(name, data) {
  fs.writeFile(name, data, err => {
    if (err) throw err
    // console.log("wrote file", name)
  })
}
