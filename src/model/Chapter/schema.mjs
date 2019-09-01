import {DataTypes as t} from "sequelize"

const schema = {
  id: {
    type: t.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: t.STRING,
    allowNull: false
  },
  description: t.TEXT,
  content_md: {
    type: t.TEXT("medium"),
    allowNull: false
  },
  content_html: t.TEXT("medium"),
  content_text: t.TEXT("medium")
}

export default schema
