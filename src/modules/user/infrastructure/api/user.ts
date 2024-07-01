import { User } from "@/core/user/interfaces/userInterface";
import { UserRepository } from "../../repositories/user";
import UserEntity from "@/core/user/entities/userEntity";

export class ApiUser implements UserRepository {
  public async createToken(data: User) {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(res)
    if (res.ok) {
      console.log("ok")
      window.location.reload()
    }
  }

  async authUser(email: string, password: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }

  async createUser(user: User): Promise<User> {
    const res = await fetch("/api/user/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const createdUser: { data: User } = await res.json();

    if (res.ok) {
      await this.createToken(createdUser.data)
    }

    return createdUser.data;
  }

  getAllUsers(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }

  async getUserById(id: string): Promise<User | null> {
    const res = await fetch("/api/user/getUserById?id=" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { data } = await res.json();
    return data;
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const res = await fetch("/api/user/getUserByEmail?email=" + email, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const usuarioResgatado: UserEntity = (await res.json()).data;

    const usuarioMontado = UserEntity.montar({
      id: usuarioResgatado.id,
      email: usuarioResgatado.email,
      createdat: usuarioResgatado.createdat,
      name: usuarioResgatado.name,
      password: usuarioResgatado.password
    });

    return usuarioMontado;
  }

  updateUser(user: User): Promise<User | null> {
    throw new Error("Method not implemented.");
  }

  deleteUser(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}