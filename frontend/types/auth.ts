import type { User } from './models';

export interface AuthContextValue {
  user: User | null;
  updateUser: (user: User) => void;
  logout: () => Promise<void>;
}
