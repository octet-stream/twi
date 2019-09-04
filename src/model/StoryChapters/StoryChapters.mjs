import {Model} from "sequelize"

import createModel from "core/db/createModel"

import indexes from "./indexes"
import schema from "./schema"

@createModel(schema, {indexes, timestamps: false})
class StoryChapters extends Model { }

export default StoryChapters