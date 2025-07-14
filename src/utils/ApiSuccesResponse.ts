
export class ApiSuccessResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
    accessToken?: string;
    refreshToken?: string;
    constructor(statusCode: number, success: boolean, message: string, data: T, accessToken?: string, refreshToken?: string) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.data = data;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}

export class ApiErrorResponse {
    statusCode: number;
    success: boolean;
    message?: string;
    error?: any;

    constructor(statusCode: number, success: boolean, message: string, error?: any) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.error = error;
    }
}