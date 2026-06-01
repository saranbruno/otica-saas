

export function getErrorMessage(error: unknown): string {
    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
    ) {
        return String(error.message);
    }

    return String(error);
}

export function getErrorCode(error: unknown): string {
    if (
        typeof error === "object" &&
        error !== null &&
        "code" in error
    ) {
        return String(error.code);
    }

    return "unknown_error";
}

interface getLogContentOutput {
    code: string;
    message: string;
}

export default function getLogContent(error: unknown): getLogContentOutput {
    return {
        code: getErrorCode(error),
        message: getErrorMessage(error),
    }
}