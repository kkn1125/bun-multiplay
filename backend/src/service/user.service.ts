import { connection } from "../dabases/mariadb";
import User from "../model/User";

const sql = connection?.promise();

User.findAll = function () {
  if (sql) {
    sql.query("SELECT * FROM user").then(([rows, fields]) => {
      console.log(rows);
    });
  }
};

User.findOne = function () {};

User.findByServer = function () {};

User.findNickname = function () {};

User.insert = function () {};

User.update = function () {};

User.deleteOne = function () {};

User.deleteAll = function () {};
