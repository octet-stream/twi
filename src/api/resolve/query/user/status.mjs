import findKey from "core/helper/iterator/sync/objFindKey"
import User from "model/User"

const getStatusName = ({status}) => (
  findKey(User.statuses, value => value === status).toUpperCase()
)

export default getStatusName
