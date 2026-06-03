

interface UserType {
    id: string;
    public_id: string;

    name: string;
    email: string | null;
    phone: string | null;
    profile_image: string | null;
    password: string;

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
        | "password"
    >;

type UpdateUserDTO = Partial<
    Pick<
        UserType,
        | "name"
        | "email"
        | "phone"
        | "profile_image"
        | "password"
    >
>;