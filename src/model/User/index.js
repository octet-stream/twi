import Contacts from "model/Contacts"
import File from "model/File"

import User from "./User"

// Associations
User.belongsTo(File, {
  as: "avatar",
  foreignKey: "avatarId",
  onDelete: "cascade",
  hooks: true
})

User.hasOne(Contacts, {foreignKey: "userId", as: "contacts"})
Contacts.belongsTo(User, {foreignKey: "userId", onDelete: "cascade"})

export default User
