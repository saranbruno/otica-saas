import { pool, query } from "../../providers/psql.js";

export async function seed() {
    await query(`
        INSERT INTO users (
            id,
            name,
            email,
            phone,
            profile_image
        ) VALUES
        (
            '77777777-7777-7777-8777-777777777777',
            'Bruno Saran',
            'bruno@techsolutions.com.br',
            '+5511999999999',
            'https://cdn.example.com/users/bruno.png'
        ),
        (
            '88888888-8888-7888-8888-888888888888',
            'Maria Oliveira',
            'maria@marketplus.com.br',
            '+5521988888888',
            'https://cdn.example.com/users/maria.png'
        ),
        (
            '99999999-9999-7999-8999-999999999999',
            'John Smith',
            'john@globaltrade.com',
            '+12125551234',
            'https://cdn.example.com/users/john.png'
        );
        `
    )
}