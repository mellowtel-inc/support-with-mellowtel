/**
 * Logger utility class with controllable log output
 */
export class Logger {
  /**
   * @type {boolean}
   */
  static disableLogs = true;

  /**
   * Log info level messages
   * @param {any} message - Primary message to log
   * @param {...any} optionalParams - Additional parameters to log
   */
  static info(message, ...optionalParams) {
    if (!this.disableLogs) {
      console.info(message, ...optionalParams);
    }
  }

  /**
   * Log standard level messages
   * @param {any} message - Primary message to log
   * @param {...any} optionalParams - Additional parameters to log
   */
  static log(message, ...optionalParams) {
    if (!this.disableLogs) {
      console.log(message, ...optionalParams);
    }
  }

  /**
   * Log warning level messages
   * @param {any} message - Primary message to log
   * @param {...any} optionalParams - Additional parameters to log
   */
  static warn(message, ...optionalParams) {
    if (!this.disableLogs) {
      console.warn(message, ...optionalParams);
    }
  }

  /**
   * Log error level messages
   * @param {any} message - Primary message to log
   * @param {...any} optionalParams - Additional parameters to log
   */
  static error(message, ...optionalParams) {
    if (!this.disableLogs) {
      console.error(message, ...optionalParams);
    }
  }
}
