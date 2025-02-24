import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Organization } from "src/entities/organization.entity";
import { Repository } from "typeorm";
import { CreateOrganizationDto } from "../dto/create-organization.dto";


// src/services/organization.service.ts
@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  // Fetch all organizations with their associated events
  async findAll() {
    try {
      return await this.organizationRepository.find({
        relations: ['events'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch organizations');
    }
  }

  // Fetch a specific organization by its ID with associated events
  async findOne(id: number) {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { organization_id: id },
        relations: ['events'],
      });

      if (!organization) {
        throw new NotFoundException(`Organization with ID ${id} not found`);
      }

      return organization;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch organization');
    }
  }

  // Create a new organization
  async create(createOrganizationDto: CreateOrganizationDto) {
    // Ensure the organization name exists
    if (!createOrganizationDto.organization_name) {
      throw new InternalServerErrorException('Organization name is required');
    }

    // Check if organization already exists
    let existingOrganization = await this.organizationRepository.findOne({
      where: { organization_name: createOrganizationDto.organization_name },
    });

    if (existingOrganization) {
      throw new InternalServerErrorException('Organization with this name already exists');
    }

    // Create the new organization using the DTO
    const organization = this.organizationRepository.create(createOrganizationDto);

    try {
      return await this.organizationRepository.save(organization);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create organization');
    }
  }

  // Find organization by name and return its ID (for use in EventService)
  async findIdByName(organizationName: string): Promise<number | null> {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { organization_name: organizationName },
      });

      return organization ? organization.organization_id : null;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find organization');
    }
  }
}
