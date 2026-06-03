import { v7 } from "uuid";
import { transaction } from "../../../../providers/psql.js";
import type { AuthenticationRepository } from "./authentication.repository.js";
import bcrypt from "bcrypt";


export class AuthenticationService {
    constructor(
        private readonly authRepository: AuthenticationRepository
    ) { }

    async findByUserId(id: string) {
        return this.authRepository.findRefreshTokenByUserId(id);
    }

    async findByToken(token: string) {
        return this.authRepository.findRefreshToken(token);
    }

    async create(data: CreateUserRefreshTokenDTO) {
        return this.authRepository.create(data);
    }

    async delete(token: string) {
        return this.authRepository.deleteToken(token);
    }

    async deleteExpired() {
        return this.authRepository.deleteExpiredTokens();
    }

    async registerUserAndGenerateToken(data: CreateUserDTO): Promise<{ user: UserType, refreshToken: string }> {
        return await transaction(async (query) => {
            const existingUser = await query<UserType>(
                `
                SELECT *
                FROM users
                WHERE email = $1
                AND deleted_at IS NULL
                LIMIT 1
                `,
                [data.email]
            );

            if (existingUser[0]) throw new Error("email_already_exists");

            const hashedPassword = await bcrypt.hash(data.password, 14);

            const [user] = await query<UserType>(
                `
                INSERT INTO users (
                    name,
                    email,
                    phone,
                    profile_image,
                    password
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
                `,
                [
                    data.name,
                    data.email,
                    data.phone,
                    data.profile_image,
                    hashedPassword,
                ]
            );

            if (!user) throw new Error("error_register_user");

            const refreshToken = v7();

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);

            await query<UserRefreshTokenType>(
                `
                INSERT INTO user_refresh_tokens (
                    user_id,
                    token,
                    expires_at
                )
                VALUES ($1, $2, $3)
                RETURNING *
                `,
                [
                    user.id,
                    refreshToken,
                    expiresAt,
                ]
            );

            return {
                user,
                refreshToken,
            };
        });
    }
}