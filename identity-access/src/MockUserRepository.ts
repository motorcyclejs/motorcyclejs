import { User, UserCredentials, UserRepository } from './types';

export class MockUserRepository implements UserRepository {
  private userDb: Map<string, UserCredentials>;
  private id = 0;

  constructor(userDb: Map<string, UserCredentials>) {
    this.userDb = userDb;
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

  public signOutUser(user: User): Promise<boolean> {
    const hasUserId = this.userDb.has(user.id);

    return Promise.resolve(hasUserId);
  }

  private generateId(): string {
    return String(++this.id);
  }
}
