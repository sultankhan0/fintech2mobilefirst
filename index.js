// Import packages
const express = require("express");
require("dotenv").config();
const { generateEmail } = require("./util/helper/sendEmail");
const valid = require("./util/Validator");
const validateSchema = require("./util/ValidatorSchema/email");
const Ajv = require("ajv");
const ajv = new Ajv();

// Middlewares
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => {
  return res.send("WELCOME TO APP");
});

app.post("/sendmail", async (req, res) => {
  try {
    const {
      category,
      subCategory,
      feature,
      firstName,
      lastName,
      email,
      phoneNumber,
      companyName,
    } = req.body;

    if (
      !category ||
      !subCategory ||
      !feature ||
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !companyName
    ) {
      return res.status(400).json({
        status: 400,
        message: "All fields are required",
      });
    }

    let validation = valid.validateObject(
      {
        email,
        phoneNumber,
      },
      validateSchema.email
    );

    if (!validation[0]) {
      return res.status(400).json({
        status :400,
        error: `${ajv.errorsText(validation[1].errors)}`,
      });
    }

    const mailDetails = {
      from: `${process.env.FROM_EMAIL}`,
      to: `${process.env.TO_EMAIL}`,
      subject: "Client Contact Details - Fintegration",
      fileName: "payment.ejs",
      category,
      subCategory,
      feature,
      firstName,
      lastName,
      email,
      phoneNumber,
      companyName,
    };
    const generate = await generateEmail(mailDetails);

    if (!generate.messageId) {
      return res.status(400).json({
        status: 400,
        message: "WRONG EMAIL ID",
      });
    }
    return res.status(200).json({ status :200, message: "Email sent successfully"});
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      status: 500,
      message: error.toString()
    });
  }
});

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
