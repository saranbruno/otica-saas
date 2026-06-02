import { pool, query } from "../../providers/psql.js";

export async function seed() {
    await query(`
        INSERT INTO stores (
            id,
            public_id,
            company_id,
            name,
            profile_image,
            zip_code,
            street,
            number,
            district,
            city,
            state,
            active
        ) VALUES
        (
            '44444444-4444-7444-8444-444444444444',
            'TECH-SP-001',
            '11111111-1111-7111-8111-111111111111',
            'Tech Solutions São Paulo',
            'https://cdn.example.com/stores/tech-sp.png',
            '01000-000',
            'Av. Paulista',
            '1000',
            'Bela Vista',
            'São Paulo',
            'SP',
            true
        ),
        (
            '55555555-5555-7555-8555-555555555555',
            'MARKET-RJ-001',
            '22222222-2222-7222-8222-222222222222',
            'Market Plus Rio',
            'https://cdn.example.com/stores/market-rj.png',
            '20000-000',
            'Rua Primeiro de Março',
            '500',
            'Centro',
            'Rio de Janeiro',
            'RJ',
            true
        ),
        (
            '66666666-6666-7666-8666-666666666666',
            'GLOBAL-NY-001',
            '33333333-3333-7333-8333-333333333333',
            'Global Trade New York',
            'https://cdn.example.com/stores/global-ny.png',
            '10001',
            '5th Avenue',
            '350',
            'Manhattan',
            'New York',
            'NY',
            true
        );
        `
    )
}