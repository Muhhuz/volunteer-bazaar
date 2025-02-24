import { Injectable } from '@nestjs/common';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { UserEvent } from '../entities/user-event.entity';
import { MoreThan } from 'typeorm';
import { EventSearchDto } from 'src/dto/event-search.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(UserEvent) private userEventRepository: Repository<UserEvent>
  ) {}

  async findAll({ page = 1, limit = 10 }) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
  
    // Ensure both values are valid numbers
    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new Error('Page and limit must be valid numbers.');
    }
  
    return await this.eventRepository.find({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });
  }
  

  async findOne(id: string | number) {
    console.log('Received ID:', id); // Debugging log
    
    const eventId = Number(id);
    
    if (isNaN(eventId) || !eventId) {
      throw new Error('Invalid event ID');
    }
  
    return await this.eventRepository.findOne({ where: { event_id: eventId } });
  }
    

  async getUpcomingEvents() {
    const currentDate = new Date();
  
    return await this.eventRepository
      .createQueryBuilder('event')
      .where('event.start_date > :currentDate', { currentDate })
      .orderBy('event.start_date', 'ASC') // Order by start date
      .getMany();
  }
  
  

  async getUserEvents(userId: number) {
    return await this.userEventRepository.find({
      where: { user_id: userId },
      relations: ['event'],
    });
  }

  async getPopularEvents() {
  return await this.eventRepository
    .createQueryBuilder('event')
    .leftJoinAndSelect('event.userEvents', 'userEvent')
    .groupBy('event.event_id') // Group by event_id to apply aggregate functions like COUNT()
    .orderBy('COUNT(userEvent.user_id)', 'DESC') // Order by the number of participants
    .limit(5) // Limit to top 5 most popular events
    .getMany();
}

  
  
  

  async checkUserParticipation(eventId: number, userId: number) {
    const participation = await this.userEventRepository.findOne({
      where: { event_id: eventId, user_id: userId },
    });

    return { isRegistered: !!participation };
  }

  async registerUser(eventId: number, userId: number) {
    const userEvent = this.userEventRepository.create({ event_id: eventId, user_id: userId });
    return await this.userEventRepository.save(userEvent);
  }

  async unregisterUser(eventId: number, userId: number) {
    return await this.userEventRepository.delete({ event_id: eventId, user_id: userId });
  }

  async create(eventData) {
    return await this.eventRepository.save(eventData);
  }

  async update(id: number, eventData) {
    return await this.eventRepository.update(id, eventData);
  }

  async remove(id: number) {
    return await this.eventRepository.delete(id);
  }

  // Search events based on the search query parameters
  async searchEvents(searchQuery: EventSearchDto) {
    const queryBuilder = this.eventRepository.createQueryBuilder('event');
  
    // Add filters based on the searchQuery fields
    if (searchQuery.keyword) {
      queryBuilder.andWhere('event.title LIKE :keyword', {
        keyword: `%${searchQuery.keyword}%`,
      });
    }
  
    if (searchQuery.eventTypeId) {
      queryBuilder.andWhere('event.event_type_id = :eventTypeId', {
        eventTypeId: searchQuery.eventTypeId,
      });
    }
  
    if (searchQuery.startDate) {
      queryBuilder.andWhere('event.start_date >= :startDate', {
        startDate: searchQuery.startDate,
      });
    }
  
    if (searchQuery.endDate) {
      queryBuilder.andWhere('event.end_date <= :endDate', {
        endDate: searchQuery.endDate,
      });
    }
  
    // Add pagination
    if (searchQuery.page && searchQuery.limit) {
      const page = Number(searchQuery.page) || 1;
      const limit = Number(searchQuery.limit) || 10;
      queryBuilder.skip((page - 1) * limit).take(limit);
    }
  
    try {
      return await queryBuilder.getMany();
    } catch (error) {
      throw new Error('Error searching events: ' + error.message);
    }
  }
  
  

}
