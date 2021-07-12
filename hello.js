// import de express
const express = require('express')
const fsPromises = require('fs/promises')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const LOG_FILE = 'access-log.txt'


// async file logger
const logger = async (req) => {
  try {
    const date = new Date()
    const log = `${date.toUTCString()} ${req.method} "${req.originalUrl
      }" from ${req.ip} ${req.headers['user-agent']}\n`
    await fsPromises.appendFile(LOG_FILE, log, 'utf-8')
  } catch (e) {
    console.error(`Error: can't write in ${LOG_FILE}`)
  }
}

// show on console
const shower = async (req) => {
  const date = new Date()
  const log = `${date.toUTCString()} ${req.method} "${req.originalUrl}" from ${req.ip
    } ${req.headers['user-agent']}`
  console.log(log)
}

const app = express()
const IP = 'localhost'
const PORT = 3333

app.get(
  '/hello',
  async (req, res, next) => {
    await logger(req)
    next()
  },
  (req, res, next) => {
    shower(req)
    next()
  },
  (req, res) => {
    res.send(`Hello ${req.ip}`)
  }
)

app.get(
  '/bye',
  async (req, res, next) => {
    await logger(req)
    next()
  },
  (req, res, next) => {
    shower(req)
    next()
  },
  (req, res) => {
    res.send(`Goodbye ${req.ip}`)
  }
)
app.get(
  '/spacedisk',
  async (req, res) => {
    const freeSpace = { stdout, stderr } = await exec('df -h /dev/sda5');
    const display = freeSpace.stdout.split('\n')
    res.send(`<p>${display[0]} <br/> ${display[1]}</p>`)
  }
)

app.listen(PORT, IP, () => {
  //exécution d'un affichage au lacement du serveur.
  console.log(`Example app listening at http://${IP}:${PORT}`)
})