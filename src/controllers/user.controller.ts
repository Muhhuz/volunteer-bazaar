import { Body, Controller, Get, Param, Put, Query, UseInterceptors } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { EventService } from 'src/services/event.service';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { ApiOperation } from '@nestjs/swagger';
import { UserQueryDto } from 'src/dto/user-query.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';

@Controller('users')
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly eventService: EventService, // Inject EventService
  ) {}

  @Get(':userId/events')
  @ApiOperation({ summary: 'Get events of a user by user ID' })
  async getUserEvents(@Param('userId') userId: number) {
    try {
      const events = await this.eventService.getUserEvents(userId); // Fetch events for the user
      return events;
    } catch (error) {
      throw new Error('Error fetching user events: ' + error.message);
    }
  }

  @Get('stats/:id')
  @ApiOperation({ summary: 'Get user statistics' })
  getUserStats(@Param('id') id: number) {
    return this.userService.getUserStats(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users with filters' })
  searchUsers(@Query() query: UserQueryDto) {
    return this.userService.findAll(query);
  }

  @Put('profile/:id')
  @ApiOperation({ summary: 'Update user profile' })
  updateProfile(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(id, updateUserDto);
}

}
