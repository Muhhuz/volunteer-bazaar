import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { createEventDto } from "src/dto/create-event.dto";
import { EventService } from "src/services/event.service";

@Controller('admin/events')
export class AdminEventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: 'Create event as admin' })
  createEvent(@Body() createEventDto: createEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete event as admin' })
  removeEvent(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
