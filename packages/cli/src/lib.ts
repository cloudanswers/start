import { resolve } from 'path'

type Options = {
  file?: string,
  preset?: string,
  reporter?: string,
  // TODO: harden me
  require?: Array<string | any[]>
}

export default async (argv: string[], options: Options) => {
  if (!options.reporter) {
    throw '`reporter` option is missing in your `package.json` → `start`'
  }

  const tasksFile = options.file || 'tasks'
  const tasksToRequire = options.preset || resolve(`./${tasksFile}`)
  const tasks = require(tasksToRequire)
  const taskName = argv[2]
  const task = tasks[taskName]

  if (typeof taskName === 'undefined' || typeof task === 'undefined') {
    throw `One of the following task names is required: "${Object.keys(tasks).join('", "')}"`
  }

  const taskArgs = argv.slice(3)
  const { default: reporter } = await import(options.reporter)

  return task(...taskArgs)({ reporter: reporter(taskName) })
}
