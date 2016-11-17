fs = require "promise-fs"
db = require "../../core/database"
redis = require "then-redis"
moment = require "moment"
shortid = require "shortid"
prompt = require "./helper/prompt"
bcrypt = require "../../core/helper/bcrypt"
requireHelper = require "../../core/helper/require"

ora = do require "ora"
{realpathSync} = require "fs"
{isFunction, assign} = require "lodash"
{info, warning} = require "figures"
{cyan, yellow} = require "chalk"

TWI_ROOT = do process.cwd
models = require "#{TWI_ROOT}/core/server/model"
schemas = requireHelper "#{TWI_ROOT}/core/database/schema"
data = requireHelper "#{TWI_ROOT}/migrations/data"
locales = requireHelper "#{TWI_ROOT}/migrations/locales", yes

###
# Load all schemas to database
#
# @params boolean notErase
###
loadSchemas = (notErase = off) ->
  ora.text = "Loading schemas..."

  for own _, __m of models
    await __m.sync force: not notErase, logging: off

  await return

###
# Import migrations data to database
#
# @param boolean notErase
###
importData = (notErase = off) ->
  ora.text = "Importing data..."

  unless notErase
    await __m.destroy truncate: on, logging: no for _, __m of models

  # Importing data
  ret = {}
  for own __k, __m of models when not __k.endsWith("Locale") and
  (__data = data[__k])?
    ret[__k] = []
    for __values, __idx in __data
      [ret[__k][__idx]] = await __m.findOrCreate
        where: __values
        defaults: __values
        logging: no

  # Importing locales
  # Awful code below. Please, don't touch it or you will fired :D
  ora.text = "Importing data locales..."
  for __lang, __localeData of locales
    for __k, __arr of ret when (__data = __localeData[__k])?
      __m = models["#{__k}Locale"]
      for __values, __idx in __data
        __id = __arr[__idx].dataValues["#{__k}Id"]
        await __m.findOrCreate
          where: "#{__k}Id": __id, lang: __lang
          defaults: assign(
            {}, {
              "#{__k}Id": __id
              lang: __lang
            }, __values
          ), logging: no

  await return

###
# Create super user account
###
createSu = (cmd) ->
  return console.warn "#{yellow warning} Warn: Skip owner registration" if cmd.S
  return await spawnServer cmd unless cmd.R is on

  {user, contacts} = models

  {login} = await prompt login: "Type your login for Twi app:"
  {email} = await prompt email: "Type your email:"

  loop
    {password} = await prompt password: [
      type: "password"
      message: "Enter your password:"
    ]
    {repass} = await prompt repass: [
      type: "password"
      message: "Reenter your password:"
    ]

    break if password is repass

  if (__user = await user.findOne raw: on, logging: no, where: role: 3)?
    console.info "#{cyan info}Owner account is already exists: #{__user.login}"
    return

  ora.text = "Creating your account..."
  do ora.start
  {dataValues: {userId}} = await user.create {
    login, email, password: await bcrypt.hash password, 10
    registeredAt: (do moment().format), role: 3, status: 1
  }, logging: no

  await contacts.create {userId}, logging: no

  await return

###
# Migrations command implementation
#
# @param Command cmd
###
migrate = (cmd) ->
  do ora.start
  ora.color = "magenta"

  await loadSchemas cmd.E
  await importData cmd.E

  do ora.stop
  await createSu cmd

  do ora.stop
  await return

module.exports = migrate
module.exports.importData = importData
module.exports.createSu = createSu