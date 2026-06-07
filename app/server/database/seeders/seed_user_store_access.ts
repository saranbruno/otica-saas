import { query } from "../../providers/psql.js";

export async function seed() {
    await query(`
        INSERT INTO user_store_access (
            user_id,
            store_id
        ) VALUES
        (
            '77777777-7777-7777-8777-777777777777',
            '44444444-4444-7444-8444-444444444444'
        ),
        (
            '77777777-7777-7777-8777-777777777777',
            'aaaaaaaa-aaaa-7aaa-8aaa-aaaaaaaaaaaa'
        ),
        (
            'bbbbbbbb-bbbb-7bbb-8bbb-bbbbbbbbbbbb',
            '44444444-4444-7444-8444-444444444444'
        ),
        (
            '88888888-8888-7888-8888-888888888888',
            '55555555-5555-7555-8555-555555555555'
        ),
        (
            '99999999-9999-7999-8999-999999999999',
            '66666666-6666-7666-8666-666666666666'
        )
        ON CONFLICT (user_id, store_id) DO NOTHING;
        `
    );
}
