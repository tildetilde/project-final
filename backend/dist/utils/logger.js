var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "ERROR";
    LogLevel["WARN"] = "WARN";
    LogLevel["INFO"] = "INFO";
    LogLevel["DEBUG"] = "DEBUG";
})(LogLevel || (LogLevel = {}));
class Logger {
    isDevelopment = process.env.NODE_ENV === 'development';
    formatLog(entry) {
        const timestamp = entry.timestamp;
        const level = entry.level.padEnd(5);
        const context = entry.context ? `[${entry.context}]` : '';
        const message = entry.message;
        let logString = `${timestamp} ${level} ${context} ${message}`;
        if (entry.error && this.isDevelopment) {
            logString += `\n${entry.error.stack}`;
        }
        if (entry.metadata && Object.keys(entry.metadata).length > 0) {
            logString += `\n${JSON.stringify(entry.metadata, null, 2)}`;
        }
        return logString;
    }
    log(level, message, context, error, metadata) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
            error,
            metadata,
        };
        const formattedLog = this.formatLog(entry);
        switch (level) {
            case LogLevel.ERROR:
                console.error(formattedLog);
                break;
            case LogLevel.WARN:
                console.warn(formattedLog);
                break;
            case LogLevel.INFO:
                console.info(formattedLog);
                break;
            case LogLevel.DEBUG:
                if (this.isDevelopment) {
                    console.debug(formattedLog);
                }
                break;
        }
    }
    error(message, context, error, metadata) {
        this.log(LogLevel.ERROR, message, context, error, metadata);
    }
    warn(message, context, metadata) {
        this.log(LogLevel.WARN, message, context, undefined, metadata);
    }
    info(message, context, metadata) {
        this.log(LogLevel.INFO, message, context, undefined, metadata);
    }
    debug(message, context, metadata) {
        this.log(LogLevel.DEBUG, message, context, undefined, metadata);
    }
}
export const logger = new Logger();
export { LogLevel };
