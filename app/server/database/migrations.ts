
type migration = {
    name: string;
    up: () => Promise<void>;
    down: () => Promise<void>;
}

export const migrations: migration[] = [
    
]