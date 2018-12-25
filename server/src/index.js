const express = require("express");
const app = express();
const fileRoute = require("./routes/file");
const bodyParser = require("body-parser");
const errorHandler = require("./middlewares/error");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const loggerFactory = require("./lib/logger");
const logger = new loggerFactory();
app.use(logger.middleware);
//loggerFactory.systemInfo();
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type"
  });
  next();
});

app.use("/folder", fileRoute);

if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, (req, res, next) => {
    fs.readFile("./utils/docs.js", (err, data) => {
      console.log(swaggerUi.setup(JSON.parse(data.toString()))(req, res));
    });
  });
}

app.use(errorHandler);
app.listen(process.env.PORT);
