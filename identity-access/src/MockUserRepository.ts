import { UserRepository, User, UserCredentials } from './types';

export class MockUserRepostiory implements UserRepository {
  private users: Map<string, User>;
  private id = 0;

  constructor(users: Map<string, User>) {
    this.users = users;
  }

  public registerUser(userCredentials: UserCredentials): Promise<User> {
    const id = this.generateId();

    const user: User =
      {
        id,
        username: userCredentials.username,
      };

    this.users.set(id, user);

    return Promise.resolve(user);
  }

  public deregisterUser(user: User): Promise<boolean> {
    return Promise.resolve(this.users.delete(user.id));
  }

  private generateId(): string {
    return String(++this.id);
  }
}
