const userSchema = {
    type: "object",
    properties: {
      name: {type: "string"},
      email: {type: "string"},
      password: {type: "string"}
    },
    required: ["name", "password"],
    additionalProperties: false
  }

module.exports.userSchema = userSchema;