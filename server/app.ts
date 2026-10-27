import express from "express";
import fs from "fs";
import path from "path";
import favicon from "serve-favicon";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import partials from "express-partials";
import { findConfigFile } from "./config";
import files from "./lib/files";
import api from "./routes/api";

if (!findConfigFile()) {
  console.info(
    "[Info] Please execute `npm run init` to initialization config."
  );
  process.exit(0);
}

const app = express();

const publicDir = fs.existsSync(path.join(__dirname, "public"))
  ? path.join(__dirname, "public")
  : path.join(process.cwd(), "public");

const viewsDir = fs.existsSync(path.join(__dirname, "views"))
  ? path.join(__dirname, "views")
  : path.join(process.cwd(), "views");

files.mkdir(publicDir);

// view engine setup
app.set("views", viewsDir);
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
const faviconPath = path.join(publicDir, "favicon.ico");
if (fs.existsSync(faviconPath)) {
  app.use(favicon(faviconPath));
}
app.use(partials());
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "2048kb" }));
app.use(bodyParser.urlencoded({ limit: "2048kb", extended: true }));
app.use(cookieParser());
app.use(express.static(publicDir));

app.use("/api", api);

app.use(function (req, res, next) {
  const indexPage = path.join(publicDir, "index.html");
  if (fs.existsSync(indexPage))
    res.sendFile(indexPage);
  else next();
});

export default app;
