exports.email = {
    title: "sending email",
    type: "object",
    required: ["email"],
    additionalProperties: false,
    properties: {
      email: {
        type: "string",
        format: "email",
      },
    },
  };
  