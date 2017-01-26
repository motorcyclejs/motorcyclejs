import { User, UserCredentials, UserRepository } from './types';

export class MockUserRepository implements UserRepository {
  private userDb: Map<string, UserCredentials>;
  private id = 0;

  constructor(users: Map<string, UserCredentials>) {
    this.userDb = users;
  }

  public registerUser(userCredentials: UserCredentials): Promise<User> {
    const id = this.generateId();

    const user: User =
      {
        id,
        username: userCredentials.username,
      };

    this.userDb.set(id, userCredentials);

    return Promise.resolve(user);
  }

  public deregisterUser(user: User): Promise<boolean> {
    return Promise.resolve(this.userDb.delete(user.id));
  }

  public signInUser(userCredentials: UserCredentials): Promise<User> {
    const entries = Array.from(this.userDb.entries());

    for (let i = 0; i < entries.length; i++) {
      const [id, {username, password}] = entries[i];

      if (username === userCredentials.username &&
        password === userCredentials.password)
          return Promise.resolve({ id, username });
    }

    return Promise.reject(new Error(`Unable to sign in.`));
  }

  private generateId(): string {
    return String(++this.id);
  }
}
