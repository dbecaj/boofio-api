import * as bcrypt from 'bcrypt';

export class CryptUtil {
    public static async generatehash(password: string): Promise<string> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        return await bcrypt.hash(password, salt);
    }

    public static async compare( password: string, hash: string ): Promise<boolean> {

        return await bcrypt.compare(password, hash);

      }
}