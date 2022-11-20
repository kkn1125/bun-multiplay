interface UserEntity {
  id: number | null;
  nickname: string | null;
  server: number | null;
  space: string | null;
  pox: number | null;
  poy: number | null;
  poz: number | null;
  roy: number | null;
}

class User implements UserEntity {
  /* Entity Fields */
  public id: number | null = null;
  public nickname: string | null = null;
  public server: number | null = null;
  public space: string | null = null;
  public pox: number | null = null;
  public poy: number | null = null;
  public poz: number | null = null;
  public roy: number | null = null;

  /* service 구현체 */
  static findAll: () => void;
  static findOne: () => void;
  static findByServer: () => void;
  static findNickname: () => void;
  static insert: () => void;
  static update: () => void;
  static deleteOne: () => void;
  static deleteAll: () => void;

  constructor(
    id: number,
    nickname: string,
    server: number,
    space: string,
    pox: number,
    poy: number,
    poz: number,
    roy: number
  ) {
    id && (this.id = id);
    nickname && (this.nickname = nickname);
    server && (this.server = server);
    space && (this.space = space);
    pox && (this.pox = pox);
    poy && (this.poy = poy);
    poz && (this.poz = poz);
    roy && (this.roy = roy);
  }
}

export default User;
