const fs = require('fs')
const path = require('path')
const { app } = require('electron')

function logDownload(version) {
  const logPath = path.join(app.getPath('userData'), 'update-log.json')
  const timestamp = new Date().toISOString()

  const logEntry = { version, timestamp }
  let data = []

  if (fs.existsSync(logPath)) {
    data = JSON.parse(fs.readFileSync(logPath))
  }

  data.push(logEntry)
  fs.writeFileSync(logPath, JSON.stringify(data, null, 2))
  console.log(`📊 Logged update: ${version} at ${timestamp}`)
}

module.exports = { logDownload }