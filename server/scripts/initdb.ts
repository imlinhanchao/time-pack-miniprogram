import fs from "fs";
import path from "path";
import readline from "readline";
import model, { sync } from "../model";

async function main () {
  if (fs.existsSync(path.join(__dirname, "../server/model/config.json")))
    return initDB();
  const rl: readline.Interface & {
    inputData?: (key: string, defaultVal?: string) => Promise<string>;
  } = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.inputData = function (key, defaultVal = '') {
    return new Promise((resolve, reject) => {
      try {
        this.question(
          `${key} ${defaultVal ? `[${defaultVal}]` : ""}: `,
          function (val) {
            resolve(val || defaultVal);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  const config = Object.assign(
    {
      host: "",
      user: "",
      password: ""
    },
    require("../server/config").db
  );

  config.host = await rl.inputData("Host", "localhost");
  config.user = await rl.inputData("User", "root");
  config.password = await rl.inputData("Password", "");
  config.prefix = await rl.inputData("Table Prefix", config.prefix);
  config.logging =
    (await rl.inputData("Log SQL Execute", config.logging ? "Y" : "N")) == "Y";

  fs.writeFile(
    path.join(__dirname, "../server/model/config.json"),
    JSON.stringify(config, null, 4),
    err => {
      if (err) console.error(`[Error] create db config failed: ${err.message}`);
      else initDB();
    }
  );
  rl.close();
}

function initDB () {
  (async () => {
    if (process.argv.length > 2) {
      const table = process.argv[2];
      if (model[table]) {
        await model[table].sync({ force: true });
        console.info(`[Success] Init model ${table} finish.`);
      } else {
        console.error(`[Error] Model ${table} not found!`);
      }
    } else {
      try {
        await sync();
        console.info("[Success] Init all model finish.");
      } catch (err: any) {
        console.error(`[Error] Init database model failed: ${err.message}`);
      }
    }
    process.exit();
  })();
}

main();
