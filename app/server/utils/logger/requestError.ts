
interface RequestErrorLogType {
    route: string;
    code?: string;
    message?: string;
    payload: Record<string, any>;
    error?: unknown;
}

export function RequestErrorLog(
    log: RequestErrorLogType
) {
    const {
        route,
        code,
        message,
        error,
    } = log;

    console.error(
        `[ERROR] Ocorreu um erro na requisição ${route} com o codigo ${code}`
    );

    console.error(`[ERROR] Mensagem: ${message}`);

    if (error) {
        console.error(error);
    }
}