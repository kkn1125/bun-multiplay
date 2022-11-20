import dotenv from "dotenv";
import path from "path";

const __dirname = path.resolve();

if (process.env.NODE_ENV === "development") {
  dotenv.config({
    path: path.join(__dirname, ".env.development"),
    override: true,
  });
}

const {
  MARIA_HOST: host,
  MARIA_PORT: port,
  MARIA_USER: user,
  MARIA_PASSWORD: password,
  MARIA_DATABASE: database,
} = process.env;

const config: { [key: string]: string | number | undefined } = {};

host && Object.assign(config, { host });
port && Object.assign(config, { port });
user && Object.assign(config, { user });
password && Object.assign(config, { password });
database && Object.assign(config, { database });

// console.log(config);

export default config;
