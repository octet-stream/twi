import bind from "lib/helper/graphql/normalizeParams"
import Forbidden from "lib/error/http/Forbidden"
import NotFound from "lib/error/http/NotFound"
import auth from "lib/auth/checkUser"
import db from "lib/db/connection"

import Story from "model/Story"
import Collaborator from "model/Collaborator"

import getCommonAbilities from "acl/common"
import getStoryAbilities from "acl/story"

const storyRemove = ({args, ctx}) => db.transaction(async transaction => {
  const {user} = ctx.state
  const {storyId} = args

  const story = await Story.findByPk(storyId, {transaction})

  if (!story) {
    throw new NotFound("Can't find requested story.")
  }

  const collaborator = await Collaborator.findOne({
    where: {userId: user.id, storyId: story.id}
  })

  const aclCommon = getCommonAbilities(user)
  const aclStory = getStoryAbilities({user, collaborator})

  if (aclCommon.cannot("delete", story) || aclStory.cannot("delete", story)) {
    throw new Forbidden("You cannot delete the story.")
  }

  return story.destroy({transaction}).then(() => storyId)
})

export default storyRemove |> auth |> bind
