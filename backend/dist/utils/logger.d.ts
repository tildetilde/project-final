declare enum LogLevel {
    ERROR = "ERROR",
    WARN = "WARN",
    INFO = "INFO",
    DEBUG = "DEBUG"
}
declare class Logger {
    private isDevelopment;
    private formatLog;
    private log;
    error(message: string, context?: string, error?: Error, metadata?: Record<string, any>): void;
    warn(message: string, context?: string, metadata?: Record<string, any>): void;
    info(message: string, context?: string, metadata?: Record<string, any>): void;
    debug(message: string, context?: string, metadata?: Record<string, any>): void;
}
export declare const logger: Logger;
export { LogLevel };
//# sourceMappingURL=logger.d.ts.map