import { pool, query } from "../../providers/psql.js";

export async function seed() {
    await query(`
        INSERT INTO users (
            id,
            active_company_id,
            active_store_id,
            name,
            email,
            phone,
            profile_image
        ) VALUES
        (
            '77777777-7777-7777-8777-777777777777',
            '11111111-1111-7111-8111-111111111111',
            '44444444-4444-7444-8444-444444444444',
            'Bruno Saran',
            'bruno@techsolutions.com.br',
            '+5511999999999',
            'https://cdn.example.com/users/bruno.png'
        ),
        (
            '88888888-8888-7888-8888-888888888888',
            '22222222-2222-7222-8222-222222222222',
            '55555555-5555-7555-8555-555555555555',
            'Maria Oliveira',
            'maria@marketplus.com.br',
            '+5521988888888',
            'https://cdn.example.com/users/maria.png'
        ),
        (
            '99999999-9999-7999-8999-999999999999',
            '33333333-3333-7333-8333-333333333333',
            '66666666-6666-7666-8666-666666666666',
            'John Smith',
            'john@globaltrade.com',
            '+12125551234',
            'https://cdn.example.com/users/john.png'
        );
        `
    )
}