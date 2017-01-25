export interface UserRepository {
  registerUser(userCredentials: UserCredentials): Promise<User>;
  deregisterUser(user: User): Promise<boolean>;
}

export interface User {
  id: string;
  username: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}
