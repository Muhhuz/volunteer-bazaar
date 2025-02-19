// src/config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Event } from '../entities/event.entity';
import { Organization } from '../entities/organization.entity';
import { City } from '../entities/city.entity';
import { Cause } from '../entities/cause.entity';
import { EventType } from '../entities/event-type.entity';
import { Degree } from '../entities/degree.entity';
import { Field } from '../entities/field.entity';
import { Skill } from '../entities/skill.entity';
import { UserCause } from '../entities/user-cause.entity';
import { UserEventType } from '../entities/user-event-type.entity';
import { UserEvent } from '../entities/user-event.entity';
import { UserSkill } from '../entities/user-skill.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  
  
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    Event,
    Organization,
    City,
    Cause,
    EventType,
    Degree,
    Field,
    Skill,
    UserCause,
    UserEventType,
    UserEvent,
    UserSkill
  ],
  synchronize: false, // Very important: Keep this false since database already exists
  logging: true,
  connectTimeout: 30000, // Increased timeout for AWS RDS connection
};

//lets commmitsdds