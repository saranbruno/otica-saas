

interface UserType {
    id: string;
    public_id: string;

    active_company_id: string | null;
    active_store_id: string | null;

    name: string;
    email: string | null;
    phone: string | null;
    profile_image: string | null;

    remember_token: string | null;

    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

type CreateUserDTO =
    Pick<
        UserType,
        | "name"
        | "email"
        | "phone"
        | "profile_image"
    >;

type UpdateUserDTO = Partial<
    Pick<
        UserType,
        | "name"
        | "email"
        | "phone"
        | "profile_image"
    >
>;