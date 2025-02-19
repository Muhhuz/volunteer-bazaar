// src/controllers/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('healths')
export class HealthController {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  @Get()
  async checkHealth() {
    try {
      // Test database connection
      const isConnected = this.dataSource.isInitialized;
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: {
          connected: isConnected,
        }
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }
}