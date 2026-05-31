
interface StoreType {
    id: string;
    public_id: string;

    company_id: string;

    name: string;
    profile_image: string | null;

    zip_code: string | null;
    street: string | null;
    number: string | null;
    district: string | null;
    city: string | null;
    state: string | null;

    active: boolean;

    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

type CreateStoreDTO = Partial<
    Pick<
        StoreType,
        | "public_id"
        | "company_id"
        | "name"
        | "profile_image"
        | "zip_code"
        | "street"
        | "number"
        | "district"
        | "city"
        | "state"
        | "active"
    >
>;

type UpdateStoreDTO = Partial<
    Pick<
        StoreType,
        | "name"
        | "profile_image"
        | "zip_code"
        | "street"
        | "number"
        | "district"
        | "city"
        | "state"
        | "active"
    >
>;