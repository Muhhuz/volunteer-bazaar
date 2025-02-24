import { forwardRef, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';  // Import CacheModule
import { EventController } from 'src/controllers/event.controller';
import { EventService } from 'src/services/event.service';
import { UserModule } from 'src/modules/user.module';
import { Event } from 'src/entities/event.entity';
import { UserEvent } from 'src/entities/user-event.entity';
import { Organization } from 'src/entities/organization.entity'; // Import Organization entity
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationService } from 'src/services/organization.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, UserEvent, Organization]), // Add Organization here
    forwardRef(() => UserModule), // forwardRef to avoid circular reference
    CacheModule.register({
      ttl: 5, // optional: Set the default cache TTL (Time to Live) in seconds
      max: 100, // optional: Set the max number of items in the cache
    }),
  ],
  controllers: [EventController],
  providers: [EventService, OrganizationService], // Ensure OrganizationService is provided here
  exports: [EventService], // Export EventService for use in other modules
})
export class EventModule {}
