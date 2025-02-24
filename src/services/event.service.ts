import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { UserEvent } from '../entities/user-event.entity';
import { OrganizationService } from 'src/services/organization.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(UserEvent) private userEventRepository: Repository<UserEvent>,
    private readonly organizationService: OrganizationService,
  ) {}

  async findAll({ page = 1, limit = 10 }) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
  
    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new Error('Page and limit must be valid numbers.');
    }

    return await this.eventRepository.find({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });
  }

  async findOne(id: string | number) {
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
      .orderBy('event.start_date', 'ASC')
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
      .groupBy('event.event_id')
      .orderBy('COUNT(userEvent.user_id)', 'DESC')
      .limit(5)
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

  // Create Event with organization mapping (without city or event_type)
  async create(createEventDto) {
    try {
      // Directly get the organization ID based on the provided organization name
      let organizationId = await this.organizationService.findIdByName(createEventDto.organization);
      if (!organizationId) {
        const newOrganization = await this.organizationService.create({ organization_name: createEventDto.organization });
        organizationId = newOrganization.organization_id;  // Ensure we get the correct `organization_id`
      }

      // Create the event with the mapped organization ID
      const newEvent = {
        title: createEventDto.title,
        start_date: new Date(createEventDto.start_date),
        end_date: new Date(createEventDto.end_date),
        start_time: createEventDto.start_time,
        end_time: createEventDto.end_time,
        organization_id: organizationId,
        rating: 0, // default value for rating
      };

      return await this.eventRepository.save(newEvent);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async update(id: number, eventData) {
    return await this.eventRepository.update(id, eventData);
  }

  async remove(id: number) {
    return await this.eventRepository.delete(id);
  }

  // Search events based on the search query parameters
  async searchEvents(searchQuery: any) {
    const queryBuilder = this.eventRepository.createQueryBuilder('event');
  
    if (searchQuery.keyword) {
      queryBuilder.andWhere('event.title LIKE :keyword', {
        keyword: `%${searchQuery.keyword}%`,
      });
    }

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
