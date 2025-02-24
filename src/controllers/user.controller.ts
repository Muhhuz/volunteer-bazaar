import { Body, Controller, Get, Param, Put, Query, UseInterceptors } from "@nestjs/common";
import { UserQueryDto } from "../dto/user-query.dto";
import { ApiOperation } from "@nestjs/swagger";
import { UserService } from "src/services/user.service";
import { UpdateUserDto } from "src/dto/update-user.dto";
import { TransformInterceptor } from "src/interceptors/transform.interceptor";

// src/controllers/user.controller.ts
@Controller('users')
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

@Get()
@ApiOperation({ summary: 'Get all users' })
getUsers(@Query() query: UserQueryDto) {
  return this.userService.findAll(query); // Pass the query from the URL (e.g., search/filter pagination)
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
