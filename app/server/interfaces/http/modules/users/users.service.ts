import type { UsersRepository } from "./users.repository.js";
import bcrypt from "bcrypt";

export class UsersService {
    constructor(
        private readonly usersRespository: UsersRepository
    ) {}

    async list() {
        return this.usersRespository.getAll();
    }

    async findById(id: string) {
        return this.usersRespository.findById(id);
    }

    async findByEmail(email: string) {
        return this.usersRespository.findByEmail(email);
    }

    async create(data: CreateUserDTO) {
        if (data.email) {
            const userWithMail = await this.usersRespository.findByEmail(data.email);

            if (userWithMail) throw new Error("email_already_exists");
        }

        data.password = await bcrypt.hash(data.password, 14);
        
        return this.usersRespository.create(data);
    }
    
    async update(id: string, data: UpdateUserDTO) {
        if (data.email) {
            const userWithMail = await this.usersRespository.findByEmail(data.email);
    
            if (userWithMail && userWithMail.id !== id) throw new Error("email_already_exists");
        }

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 14);
        }
        
        return this.usersRespository.update(id, data);
    }

    async delete(id: string) {
        return this.usersRespository.delete(id);
    }
}