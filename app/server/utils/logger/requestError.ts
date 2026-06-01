
interface RequestErrorLogType {
    route: string;
    code?: string;
    message?: string;
    payload: Record<string, any>;
}

export function RequestErrorLog(log: RequestErrorLogType) {
    const {
        route,
        code,
        message,
        payload,
    } = log;

    console.log(`[ERROR] Ocorreu um erro na requisição ${route} com o codigo ${code}`);
    console.log(`[ERROR] Erro: ${message}`);
}