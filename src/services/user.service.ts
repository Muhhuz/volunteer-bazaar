import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserQueryDto } from '../dto/user-query.dto';
import { UpdateUserDto } from '../dto/update-user.dto'; // Assuming we have a DTO for updates
import { EventService } from './event.service';
import { RegisterDto } from 'src/dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private eventService: EventService,
  ) {}

  // Add pagination and improved error handling in findAll
  async findAll(query: UserQueryDto): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (query.user_id) {
      queryBuilder.andWhere('user.user_id = :user_id', { user_id: query.user_id });
    }

    if (query.name) {
      queryBuilder.andWhere('user.name LIKE :name', { name: `%${query.name}%` });
    }
    if (query.gender) {
      queryBuilder.andWhere('user.gender = :gender', { gender: query.gender });
    }
    if (query.age) {
      queryBuilder.andWhere('user.age = :age', { age: query.age });
    }
    if (query.city_id) {
      queryBuilder.andWhere('user.city_id = :city_id', { city_id: query.city_id });
    }
    if (query.province) {
      queryBuilder.andWhere('user.province LIKE :province', { province: `%${query.province}%` });
    }
    if (query.degree_id) {
      queryBuilder.andWhere('user.degree_id = :degree_id', { degree_id: query.degree_id });
    }
    if (query.field_id) {
      queryBuilder.andWhere('user.field_id = :field_id', { field_id: query.field_id });
    }

    // Implement pagination validation
    const page = query.page && !isNaN(Number(query.page)) ? Number(query.page) : 1;
    const limit = query.limit && !isNaN(Number(query.limit)) ? Number(query.limit) : 10;
    queryBuilder.skip((page - 1) * limit).take(limit);

    // Include relations if needed
    queryBuilder.leftJoinAndSelect('user.city', 'city');
    queryBuilder.leftJoinAndSelect('user.degree', 'degree');
    queryBuilder.leftJoinAndSelect('user.field', 'field');

    try {
      return await queryBuilder.getMany();
    } catch (error) {
      console.error(error); // Log error for debugging
      throw new InternalServerErrorException('Error fetching users: ' + error.message);
    }
  }

  // Improved the user stats fetching method
  async getUserStats(userId: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ['userEvents', 'userSkills'], // Ensure related data is fetched
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const stats = {
      totalEvents: user.userEvents ? user.userEvents.length : 0,
      skillsCount: user.userSkills ? user.userSkills.length : 0,
      rating: user.rating || 0,
      hoursCompleted: user.hours_completed || 0,
    };

    return stats;
  }

  // Profile update method (newly added)
  async updateProfile(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Perform the update on the profile fields (using DTO)
    Object.assign(user, updateUserDto);

    try {
      // Save the updated user profile
      return await this.userRepository.save(user);
    } catch (error) {
      console.error(error); // Log error for debugging
      throw new InternalServerErrorException('Error updating profile: ' + error.message);
    }
  }

  // Find a user by email
  async findByEmail(email: string): Promise<User | null> {
  return this.userRepository.findOne({ where: { email } });
  }

  
  // Create a new user
  async create(registerDto: RegisterDto): Promise<User> {
    try {
      const user = this.userRepository.create(registerDto); // Use the DTO to create a user object
      return await this.userRepository.save(user); // Save the user in the database
    } catch (error) {
      console.error(error); // Log error for debugging
      throw new InternalServerErrorException('Error creating user: ' + error.message);
    }
  }
}
