import {
  GraphQLInt as TInt,
  GraphQLString as TString,
  GraphQLBoolean as TBoolean
} from "graphql"

import Type from "parasprite/Type"

import words from "lib/helper/string/concatWords"

import TDates from "api/type/common/TDates"

import TUser from "api/type/user/TUser"

import publisher from "api/resolve/query/story/publisher"
import dates from "api/resolve/query/common/dates"

const TStoryMinimal = Type({
  name: "StoryMinimal",
  description: words([
    "Minimal information about the story.",
    "Such as its name and authors.",
    "No chapters information would be received from this type."
  ])
})
  .field({
    name: "id",
    type: TInt,
    required: true
  })
  .field({
    name: "title",
    type: TString,
    required: true,
    description: "A story main title."
  })
  .field({
    name: "description",
    type: TString,
    required: true,
    description: words([
      "A minimal story description.",
      "May basically explain what's this about",
      "or give any other information."
    ])
  })
  .resolve({
    name: "publisher",
    type: TUser,
    handler: publisher,
    required: true,
    noArgs: true
  })
  .resolve({
    name: "dates",
    type: TDates,
    required: true,
    noArgs: true,
    handler: dates
  })
  .field({
    name: "isDraft",
    type: TBoolean,
    required: true
  })
  .field({
    name: "isFinished",
    type: TBoolean,
    required: true
  })
.end()

export default TStoryMinimal
