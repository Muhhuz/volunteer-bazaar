import { forwardRef, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';  // Import CacheModule
import { EventController } from 'src/controllers/event.controller';
import { EventService } from 'src/services/event.service';
import { UserModule } from 'src/modules/user.module';
import { Event } from 'src/entities/event.entity';
import { UserEvent } from 'src/entities/user-event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Event,UserEvent]), forwardRef(() => UserModule),
  CacheModule.register({
    ttl: 5, // optional: Set the default cache TTL (Time to Live) in seconds
    max: 100, // optional: Set the max number of items in the cache
  }),

  ], // forwardRef to avoid circular reference
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}