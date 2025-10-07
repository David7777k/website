/**
 * Structured Server Logging Utility
 * Provides consistent logging format for audit trails and debugging
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  userId?: string
  action: string
  entityType?: string
  entityId?: string
  details?: Record<string, any>
  ip?: string
  userAgent?: string
  error?: Error | string
}

class Logger {
  private isDev = process.env.NODE_ENV === 'development'

  private formatLog(level: LogLevel, context: LogContext): string {
    const timestamp = new Date().toISOString()
    const { userId, action, entityType, entityId, details, ip, error } = context

    const logData = {
      timestamp,
      level: level.toUpperCase(),
      userId,
      action,
      entityType,
      entityId,
      ip,
      ...(details && { details }),
      ...(error && { error: error instanceof Error ? error.message : error })
    }

    // Filter out undefined values
    Object.keys(logData).forEach(key => 
      logData[key as keyof typeof logData] === undefined && delete logData[key as keyof typeof logData]
    )

    return JSON.stringify(logData)
  }

  info(context: LogContext): void {
    const log = this.formatLog('info', context)
    console.log(log)
  }

  warn(context: LogContext): void {
    const log = this.formatLog('warn', context)
    console.warn(log)
  }

  error(context: LogContext): void {
    const log = this.formatLog('error', context)
    console.error(log)
  }

  debug(context: LogContext): void {
    if (this.isDev) {
      const log = this.formatLog('debug', context)
      console.debug(log)
    }
  }

  /**
   * Log to database audit trail (for important actions)
   */
  async auditLog(
    prisma: any,
    context: LogContext & { requestId?: string }
  ): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          user_id: context.userId || null,
          action: context.action,
          entity_type: context.entityType || null,
          entity_id: context.entityId || null,
          details: context.details ? JSON.stringify(context.details) : null,
          ip_address: context.ip || null,
          user_agent: context.userAgent || null
        }
      })
    } catch (error) {
      // Don't throw if audit logging fails
      this.error({
        action: 'audit_log_failed',
        error: error as Error,
        details: { originalContext: context }
      })
    }
  }
}

export const logger = new Logger()
