import {join} from "path"

import {readSync} from "node-yaml"

import merge from "lodash/merge"
import freeze from "js-flock/deepFreeze"
import invariant from "@octetstream/invariant"

import concat from "core/helper/string/concat"

process.env.NODE_ENV || (process.env.NODE_ENV = "development")

const {version, codename} = require(join("..", "..", "package.json"))

const CONFIGS_ROOT = join(__dirname, "..", "..", "config/system")

// TODO: Add JSON schema support and its validation
function configure() {
  const name = process.env.NODE_ENV || "name"

  const dev = name !== "production"
  const test = name === "test"
  const debug = name === "debug"

  invariant(
    ["production", "development", "test", "debug"].includes(name) === false,

    RangeError, "Unknown environment name is set: %s", name
  )

  const env = {name, dev, test, debug}

  const defaultConfig = readSync(join(CONFIGS_ROOT, "default"))

  let envConfig = {}
  try {
    envConfig = readSync(join(CONFIGS_ROOT, name))
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err
    }

    invariant(
      env === "production",
      "Production config required for current (%s) environment.",
      name
    )
  }

  const config = merge({version, codename}, defaultConfig, envConfig, {env})

  config.server.address = concat(
    config.server.secure ? "https://" : "http://",
    config.server.host,
    config.server.port ? concat(":", config.server.port) : undefined
  )

  return freeze(config)
}

export default configure()