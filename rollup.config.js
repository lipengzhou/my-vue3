/**
 * rollup 构建的默认公共配置文件
 */
import ts from 'rollup-plugin-typescript2' // 解析 TS
import resolvePlugin from '@rollup/plugin-node-resolve' // 解析第三方模块
import path from 'path' // 处理路径

const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)
const resolve = p => path.resolve(packageDir, p)
const pkg = require(resolve(`package.json`))
const packageOptions = pkg.buildOptions || {}
const name = packageOptions.filename || path.basename(packageDir)

console.log(name)

const outputConfigs = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: `es`
  },
  'esm-browser': {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: `es`
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife`
  }
}

const defaultFormats = ['esm-bundler', 'cjs']
const packageFormats = packageOptions.formats || defaultFormats
const packageConfigs = packageFormats.map(format => createConfig(format, outputConfigs[format]))
export default packageConfigs

function createConfig (format, output) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${format}"`))
    process.exit(1)
  }
  output.sourcemap = true // 为了便于调试，建议生成 sourcemap（注意：由于使用了 TS，TS 中也需要开启 sourcemap）
  output.name = packageOptions.name // 用于 iife 在 window 上挂载的属性名
  const tsPlugin = ts({
    tsconfig: path.resolve(__dirname, 'tsconfig.json'), // 当前目录下的 TS 配置文件
  })
  return {
    input: resolve('src/index.ts'),
    output,
    plugins: [
      tsPlugin,
      resolvePlugin
    ]
  }
}

// /**
//  * 构建支持多种模块规范的包
//  * @type {import('rollup').RollupOptions}
//  */
// export default [

// ]
