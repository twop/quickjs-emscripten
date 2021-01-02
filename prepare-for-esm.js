// process.argv looks something like this:
// ;[
//   '/Users/twop/.volta/tools/image/node/15.4.0/bin/node',
//   '/Users/twop/work/quickjs-emscripten/prepare-for-esm.js',
//   '/var/folders/kh/ntmr051d473d395_zdb1gt100000gn/T/emscripten_temp_fz98kc6a/quickjs-emscripten-module.wasm.o.js.tr.js',
// ]

const filePath = process.argv[2] // <--- passed from emscripten

const fs = require('fs')

const originalCode = fs.readFileSync(filePath, 'utf-8')

// this is how the original code looks like
// ------------- snippet -------------
// var ENVIRONMENT_IS_WEB = false
// var ENVIRONMENT_IS_WORKER = false
// var ENVIRONMENT_IS_NODE = false
// var ENVIRONMENT_IS_SHELL = false

// ENVIRONMENT_IS_WEB = typeof window === 'object'
// ENVIRONMENT_IS_WORKER = typeof importScripts === 'function'
// ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string'
// ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER
// ------------ snippet end ----------

// we need to strip out code for Node and Shell runtimes because we prepare it for esm usage

const modifiedCode = originalCode
  .replaceAll(/var ENVIRONMENT_IS_NODE = false/g, '')
  .replaceAll(/ENVIRONMENT_IS_NODE\s+=.*;/g, '')
  .replaceAll(/ENVIRONMENT_IS_NODE/g, 'false')
  .replaceAll(/var ENVIRONMENT_IS_SHELL = false/g, '')
  .replaceAll(/ENVIRONMENT_IS_SHELL\s+=.*;/g, '')
  .replaceAll(/ENVIRONMENT_IS_SHELL/g, 'false')

fs.writeFileSync(filePath, modifiedCode, { encoding: 'utf-8' })
