import bind from "core/helper/graphql/normalizeParams"
import BadRequest from "core/error/http/BadRequest"
import serial from "core/helper/array/runSerial"
import conn from "core/db/connection"

import {get, remove} from "core/auth/tokens"

import User from "model/User"
import Session from "model/Session"

const confirmEmail = ({args, ctx}) => conn.transaction(async t => {
  const {client} = ctx.state

  const email = await get(args.hash)

  // Return false if token is expired
  if (!email) {
    throw new BadRequest("Can't active a user: Bad token signature.")
  }

  let user = await User.findOne({where: {email}}, {transaction: t})

  if (!user) {
    throw new BadRequest("There's no user with such email.")
  }

  user = await serial([
    () => remove(args.hash),

    () => Session.destroy({where: {userId: user.id}}, {transaction: t}),

    () => user.update({status: User.statuses.active}, {transaction: t}),

    () => user.reload({attributes: {exclude: ["password"]}}, {transaction: t})
  ])

  const tokens = await Session.sign({
    client, user: user.toJSON()
  }, {transaction: t})

  return user.update({lastVisited: new Date()}, {transaction: t})
    .then(() => tokens)
})

export default confirmEmail |> bind
