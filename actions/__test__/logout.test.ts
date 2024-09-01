import { logout } from '../logout';
import { signOut } from '@/auth';

jest.mock('@/auth', () => ({
  signOut: jest.fn(), 
}));

describe('logout function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call signOut when logout is executed', async () => {
    await logout();  
    expect(signOut).toHaveBeenCalled();
  });
});