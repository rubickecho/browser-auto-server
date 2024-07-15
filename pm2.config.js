/* eslint-disable */
const path = require('path')
const LOG_BASE_URL = './logs'

module.exports = {
  apps: [
    {
      name: 'browser-auto-server', // 项目名称
      script: './dist/main.js', // 执行文件
      log_date_format: 'YYYY-MM-DD HH:mm:ss', // 指定日志文件的时间格式
      out_file: path.join(LOG_BASE_URL, 'out.log'), // 正常日志文件
      error_file: path.join(LOG_BASE_URL, 'err.log'), // 错误日志文件
      merge_logs: false, // 设置追加日志而不是新建日志
      instances: 1, // 应用启动实例个数
      autostart: true,
      watch: false, // 是否监听文件变动然后重启
      max_memory_restart: '2G', // 最大内存限制数，超出自动重启
      env: {
        NODE_ENV: 'production', // 环境参数，当前指定为开发环境
        PORT: 8899,
        LOG_LEVEL: 'info'
      }
    },
  ],
}
