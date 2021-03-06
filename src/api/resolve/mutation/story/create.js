import bind from "lib/helper/graphql/normalizeParams"
import Forbidden from "lib/error/http/Forbidden"
import auth from "lib/auth/checkUser"

import Story from "model/Story"
import getCommonAbilities from "acl/common"

async function storyCreate({args, ctx}) {
  const {user} = ctx.state
  const {story} = args

  const acl = getCommonAbilities(user)

  if (acl.cannot("create", Story)) {
    throw new Forbidden("You cannot create a new story.")
  }

  story.userId = user.id

  return Story.create(story)
}

export default storyCreate |> auth |> bind
