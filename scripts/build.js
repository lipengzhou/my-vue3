const fs = require('fs')
const path = require('path')
const execa = require('execa')

// 1. 读取所有需要构建的包目录
const dirs = fs.readdirSync('./packages')
  .filter(item => fs.statSync(path.join('./packages', item)).isDirectory())

run()

async function run () {
  try {
    await runParallel(dirs, build)
    console.log('构建成功')
  } catch (err) {
    console.log('构建失败', err)
  }
}

// 2. 并行构建所有包
// console.log('开始构建')

/**
 * 并行构建模块包
 * @param {*} source
 * @param {*} iteratorFn
 */
async function runParallel (source, iteratorFn) {
  const ret = []
  for (const item of source) {
    ret.push(iteratorFn(item))
  }
  return Promise.all(ret)
}

/**
 * 具体的构建流程
 * @param {} target
 */
async function build (target) {
  // 在一个单独的进程中执行构建任务
  await execa(
    'rollup',
    [
      '-c', // 使用 rollup 配置文件，默认为 rollup.config.js
      '--environment', // 通过 process.ENV 将其他设置传递到配置文件。，格式为：key:value,key:value
      [
        `TARGET:${target}`, // 构建的目标
      ].join(',')
    ],
    {
      stdio: 'inherit' // 将子进程内容输出到父进程
    }
  )
}
