"use strict";

const PrettyStream = require("bunyan-prettystream");
const bunyan = require("bunyan");
const os = require("os");
const uuid = require("uuid").v4;

const prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

const logLevel = process.env.NODE_ENV === "development" ? "debug" : "info";
const appId = uuid();
const logger = bunyan.createLogger({
  name: "apiLogger",
  service: "vrs-video-store",
  streams: [
    {
      type: "raw",
      stream: prettyStdOut
    },
    {
      level: logLevel,
      stream: process.stdout
    },
    {
      level: "error",
      stream: process.stderr
    }
  ],
  appId
});

module.exports = class LoggerFactory {
  constructor() {
    /**
     * @namespace
     * @property trace
     * @property debug
     * @property info
     * @property warning
     * @property error
     * @property fatal
     * @property child
     * @property level
     */

    this.logger = logger;
  }

  middleware(req, res, next) {
    const logentry = {
      path: req.originalUrl,
      method: req.method,
      userID: req.user ? req.user.id : "unauthorized",
      reqId: req.reqId || req.reqID || "n/a",
      ip: req.ip
    };
    req.logger = logger;
    const end = res.end; // eslint-disable-line
    res.end = (chunk, encoding) => {
      if (Buffer.isBuffer(chunk) && chunk.length <= 10 * 1048576) {
        // 1Mb
        try {
          const body = JSON.parse(chunk.toString());
          res._body = body;
        } catch (e) {
          res._body = "<response body is not valid json>";
        }
      } else {
        // res._body = chunk.toString()
      }
      res.end = end;
      res.end(chunk, encoding);
    };
    res.on("finish", () => {
      // eslint-disable-line
      req.logger.info(
        Object.assign(Object.assign({}, logentry), {
          resp: {
            headers: res._headers,
            body: res._body,
            statusCode: res.statusCode
          }
        }),
        "Log responce"
      );

      res.removeAllListeners("finish");
    });

    req.logger.info(
      Object.assign(Object.assign({}, logentry), {
        req: {
          headers: req.headers,
          query: req.query,
          body: req.body
        }
      }),
      "Log request"
    );

    return next();
  }
  static systemInfo() {
    logger.info(
      {
        nodeEnv: process.env.NODE_ENV || "development",
        cwd: process.cwd(),
        os: {
          hostname: os.hostname(),
          cpus: os.cpus().length,
          cpuType: os.cpus().shift(),
          arch: os.arch(),
          mem: {
            total: os.totalmem()
          },
          userInfo: os.userInfo()
        },
        process: {
          pid: process.pid,
          execPath: process.execPath,
          argv: process.argv,
          version: process.version,
          execArgv: process.execArgv,
          platform: process.platform,
          env: process.env
        },
        appId
      },
      "Application environment"
    );
  }
};
