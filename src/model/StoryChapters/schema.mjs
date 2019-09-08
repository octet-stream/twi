import {DataTypes as t} from "sequelize"

const schema = {
  storyId: {
    type: t.INTEGER.UNSIGNED,
    allowNull: false
  },
  chapterId: {
    type: t.INTEGER.UNSIGNED,
    allowNull: false
  },
  order: {
    type: t.INTEGER.UNSIGNED,
    allowNull: false,
    // defaultValue: 1
  }
}

export default schema
