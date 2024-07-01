import { createHash } from "crypto";

type UserEntityCompletoDTO = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdat: number;
}

export type NovoUserEntityDTO = {
  name: string;
  email: string;
  password: string;
}

export default class UserEntity {
  readonly id: string;
  readonly createdat: number;
  name: string;
  email: string;
  password: string;

  constructor(props: UserEntityCompletoDTO) {
    this.id = props.id;
    this.createdat = props.createdat;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
  }

  static criar(props: NovoUserEntityDTO): UserEntity {
    const id = crypto.randomUUID();
    const createdat = Date.now();
    const hashedPassword = UserEntity.hash(props.password);

    const novoUsuario = new UserEntity({
      id,
      createdat,
      password: hashedPassword,
      email: props.email,
      name: props.name
    });

    if (!id || !props.name || !props.email || !props.password || !createdat) {
      throw new Error('Missing required fields');
    }

    return novoUsuario;
  }

  static montar(props: UserEntityCompletoDTO): UserEntity {
    const usuarioMontado = new UserEntity({
      id: props.id,
      createdat: props.createdat,
      password: props.password,
      email: props.email,
      name: props.name
    });
    return usuarioMontado;
  }

  static hash(password: string) {
    return createHash('sha256').update(password).digest('base64');
  }

  static compareHash(hashedPassword: string, password: string) {
    return hashedPassword === createHash('sha256').update(password).digest('base64');
  }
}