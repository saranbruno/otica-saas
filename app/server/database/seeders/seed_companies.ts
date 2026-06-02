import { pool, query } from "../../providers/psql.js";

export async function seed() {
    await query(`
        INSERT INTO companies (
            id,
            name,
            email,
            profile_image,
            country,
            timezone,
            active,
            verified_at
        ) VALUES
        (
            '11111111-1111-7111-8111-111111111111',
            'Tech Solutions LTDA',
            'contato@techsolutions.com.br',
            'https://cdn.example.com/companies/techsolutions.png',
            'BR',
            'America/Sao_Paulo',
            true,
            now()
        ),
        (
            '22222222-2222-7222-8222-222222222222',
            'Market Plus',
            'contato@marketplus.com.br',
            'https://cdn.example.com/companies/marketplus.png',
            'BR',
            'America/Sao_Paulo',
            true,
            now()
        ),
        (
            '33333333-3333-7333-8333-333333333333',
            'Global Trade',
            'contato@globaltrade.com',
            'https://cdn.example.com/companies/globaltrade.png',
            'US',
            'America/New_York',
            true,
            now()
        );
        `
    )
}