
interface CompanyType {
    id: string;
    name: string;
    email: string;
    profile_image: string | null;

    country: string;
    timezone: string;

    active: boolean;

    verified_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

type UpdateCompanyDTO = Partial<
    Pick<
        CompanyType,
        | "name"
        | "email"
        | "profile_image"
        | "country"
        | "timezone"
        | "active"
        | "verified_at"
    >
>;