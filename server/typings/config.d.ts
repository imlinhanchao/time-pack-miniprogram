declare module "*config.json" {
  const value: any;
  export default value;
  export const name: string;
  export const port: number;
  export const accessSecret: string;
  export const refreshSecret: string;
  export const salt: string;
  export const wx: {
    appid: string;
    secret: string;
  };
  export const file: {
    upload: string;
    fileurl: string;
    maxSize: number;
  };
  export const db: {
    host: string;
    user: string;
    password: string;
    database: string;
    dialect: string;
    prefix: string;
    port: number;
    logging: boolean;
  };
  export const prefix: string;
}
