import {createServer} from "http"

import Koa from "koa"

import config from "lib/base/config"
import router from "lib/base/router"
import middlewares from "lib/base/middleware"

import log from "lib/log"

const {port} = config.server

// Initialize Koa application
const koa = new Koa()

koa.proxy = Boolean(config.server.useProxy)

// Add authorization and routes
middlewares.push(router.allowedMethods(), router.routes())

// Assign middlewares to Koa.js instance
middlewares.forEach(middleware => koa.use(middleware))

// create HTTP server instance and assign Koa.js listener
const server = createServer(koa.callback())

/**
 * Start HTTP server to listen to configured port on localhost.
 *
 * @return {Promise<void>}
 */
const start = () => new Promise((resolve, reject) => {
  function onStarted() {
    log.ok("Server have been started")
    resolve()
  }

  server.on("error", reject).listen(port, onStarted)
})

/**
 * Closes HTTPS server.
 *
 * @return {Promise<void>}
 */
const close = () => new Promise((resolve, reject) => {
  function onClosed(error) {
    if (error) {
      return reject(error)
    }

    log.ok("Server closed.")
    resolve()
  }

  server.close(onClosed)
})

export default {start, close}
