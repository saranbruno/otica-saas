import bcrypt from "bcrypt";
import { query } from "../../providers/psql.js";

export async function seed() {
    const password = await bcrypt.hash("Admin123", 14);

    await query(`
        INSERT INTO users (
            id,
            company_id,
            name,
            email,
            phone,
            profile_image,
            password
        ) VALUES
        (
            '77777777-7777-7777-8777-777777777777',
            '11111111-1111-7111-8111-111111111111',
            'Bruno Saran',
            'bruno@techsolutions.com.br',
            '+5511999999999',
            'https://cdn.example.com/users/bruno.png',
            $1
        ),
        (
            '88888888-8888-7888-8888-888888888888',
            '22222222-2222-7222-8222-222222222222',
            'Maria Oliveira',
            'maria@marketplus.com.br',
            '+5521988888888',
            'https://cdn.example.com/users/maria.png',
            $1
        ),
        (
            '99999999-9999-7999-8999-999999999999',
            '33333333-3333-7333-8333-333333333333',
            'John Smith',
            'john@globaltrade.com',
            '+12125551234',
            'https://cdn.example.com/users/john.png',
            $1
        ),
        (
            'bbbbbbbb-bbbb-7bbb-8bbb-bbbbbbbbbbbb',
            '11111111-1111-7111-8111-111111111111',
            'Ana Souza',
            'ana@techsolutions.com.br',
            '+5511988887777',
            'https://cdn.example.com/users/ana.png',
            $1
        )
        ON CONFLICT (id) DO UPDATE SET
            company_id = EXCLUDED.company_id,
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            profile_image = EXCLUDED.profile_image,
            password = EXCLUDED.password,
            updated_at = timezone('utc', now()),
            deleted_at = NULL;
        `,
        [password]
    );
}
