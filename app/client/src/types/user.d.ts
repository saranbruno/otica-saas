type AuthUser = {
    id: number | string;
    name: string;
    email: string | null;
    phone?: string | null;
    profile_image?: string | null;
};