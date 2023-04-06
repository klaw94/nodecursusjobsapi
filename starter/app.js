require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//In postman TESTS in Register and login so you automatically have the token saved.
// const jsonData = pm.response.json()
// pm.globals.set("accessToken", jsonData.token)

//connectDB
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

//routes
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const { getAllJobs } = require("./controllers/jobs");

// extra packages

// // Swagger. Copy the postman export in a yaml file (./swagger.yaml) and then do this:
// const swaggerUI = require("swagger-ui-express");
// const YAML = require("yamljs");
// const swaggerDocument = YAML.load("./swagger.yaml");

//serve the swagger documnetation
// app.get("/", (req, res) => {
//   res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
// });
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use("/api/v1/auth", authRouter);
//We also add the authentication layer to all the job functions
app.use("/api/v1/jobs", authenticateUser, jobRouter);

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100, //limit eacht IP to 100 requests per windowMs
  })
);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
