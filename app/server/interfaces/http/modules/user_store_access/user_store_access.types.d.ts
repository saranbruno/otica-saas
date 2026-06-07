interface UserStoreAccessType {
    id: number;

    user_id: string;
    store_id: string;

    created_at: string;
}

interface UserStoreAccessWithRelationsType extends UserStoreAccessType {
    user_public_id: string;
    user_name: string;
    user_email: string | null;

    store_public_id: string;
    store_name: string;
}

type CreateUserStoreAccessDTO =
    Pick<
        UserStoreAccessType,
        | "user_id"
        | "store_id"
    >;
