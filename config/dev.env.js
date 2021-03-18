'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://localhost:8888/api/admin"',
  OSS_PATH: '"https://cloudstudy-avatar.oss-cn-hangzhou.aliyuncs.com"'
})
