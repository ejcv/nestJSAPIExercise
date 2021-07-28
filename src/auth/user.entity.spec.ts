import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User entity', () => {

    let user: User;

    beforeEach(() => {
        user = new User();
        user.password = 'testPassword';
        user.salt = 'testSalt';
        (bcrypt.hash as any) = jest.fn();

    });
    describe('validatePassword', () => {
        it('returns true as password is valid', async () => {
            (bcrypt.hash as any).mockReturnValue('testPassword');
            expect((bcrypt.hash as any)).not.toHaveBeenCalled();
            const result = await user.validatePassword('123455');
            expect((bcrypt.hash as any)).toHaveBeenCalledWith('123455', 'testSalt');
            expect(result).toEqual(true);
        });
        it('returns false as password is invalid', async () => {
            (bcrypt.hash as any).mockReturnValue('wrongPassword');
            expect((bcrypt.hash as any)).not.toHaveBeenCalled();
            const result = await user.validatePassword('wrongPassword');
            expect((bcrypt.hash as any)).toHaveBeenCalledWith('wrongPassword', 'testSalt');
            expect(result).toEqual(false);
        });
    });
});