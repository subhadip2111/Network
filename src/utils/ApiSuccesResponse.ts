
export class ApiSuccessResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;

    constructor(statusCode: number, success: boolean, message: string, data: T) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.data = data;
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