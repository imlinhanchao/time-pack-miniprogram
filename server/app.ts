import express from "express";
import fs from "fs";
import path from "path";
import favicon from "serve-favicon";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import partials from "express-partials";
import files from "./lib/files";
import api from "./routes/api";

if (!fs.existsSync(path.join(__dirname, "config.json"))) {
  console.info(
    "[Info] Please execute `npm run init` to initialization config."
  );
  process.exit(0);
}


const app = express();

files.mkdir(path.join(__dirname, "public"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(partials());
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "2048kb" }));
app.use(bodyParser.urlencoded({ limit: "2048kb", extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", api);

app.use(function (req, res, next) {
  const indexPage = path.join(__dirname, "public/index.html");
  if (fs.existsSync(indexPage))
    res.sendFile(path.join(__dirname, "public/index.html"));
  else next();
});

export default app;
