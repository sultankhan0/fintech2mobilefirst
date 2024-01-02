exports.email = {
    title: "sending email",
    type: "object",
    required: ["email", "phoneNumber"],
    additionalProperties: false,
    properties: {
      email: {
        type: "string",
        format: "email",
      },
      phoneNumber: {
        minLength: 3,
        type: "string",
      },
    },
  };
  