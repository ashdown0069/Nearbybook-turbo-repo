import { Aspect, LazyDecorator, WrapParams } from "@toss/nestjs-aop"
import { Injectable, Logger } from "@nestjs/common"
import { DistributedLockService } from "./distributed-lock.service"
import { REDIS_LOCK_DECORATOR, RedisLockOptions } from "./redis-lock.decorator"

@Aspect(REDIS_LOCK_DECORATOR)
@Injectable()
export class RedisLockAspect implements LazyDecorator<any, RedisLockOptions> {
  private readonly logger = new Logger(RedisLockAspect.name)

  constructor(private readonly lockService: DistributedLockService) {}

  wrap({ method, metadata }: WrapParams<any, RedisLockOptions>) {
    const { key, ttlSeconds } = metadata

    return async (...args: any[]) => {
      // 락 획득 후 고유 실행 토큰을 발급받습니다.
      const lockToken = await this.lockService.tryAcquire(key, ttlSeconds)
      if (!lockToken) {
        this.logger.log(
          `Skipping cron job [${key}]: another instance holds the lock`
        )
        return
      }

      try {
        return await method(...args)
      } finally {
        // 자신이 획득한 고유 토큰을 대조하여 락을 안전하게 해제합니다.
        await this.lockService.release(key, lockToken)
      }
    }
  }
}
