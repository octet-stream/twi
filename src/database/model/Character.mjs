import {createModel, Model} from "core/database"

import nanoid from "core/helper/util/nanoid"

// Set code length to 4
const nano = nanoid.bind(4)

@createModel
class Character extends Model {
  static async createOne(character, options = {}) {
    const code = nano()

    return await super.createOne({...character, code}, options)
  }

  static async createMany(characters, options = {}) {
    for (const [idx, character] of characters.entries()) {
      const code = nano()

      characters[idx] = {
        ...character, code
      }
    }

    return await super.createMany(characters, options)
  }
}

export default Character