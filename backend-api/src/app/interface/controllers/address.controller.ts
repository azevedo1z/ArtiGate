import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetAddressService } from '../../application/services/address/getAddress.service';
import { GetUserService } from '../../application/services/user/getUser.service';
import { AuthGuardService } from '../../infrastructure/services/authGuard.service';
import { UnauthorizedException } from '../../shared/exceptions/app.exception';
import type { AuthenticatedRequest } from '../../shared/types/auth.types';

@Controller('address')
@ApiBearerAuth()
@UseGuards(AuthGuardService)
export class AddressController {
  constructor(
    private readonly getAddressService: GetAddressService,
    private readonly getUserService: GetUserService
  ) {}

  @Get(':id')
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthenticatedRequest
  ) {
    const owner = await this.getUserService.getByAddressId(id);
    if (!owner || owner.id !== req.user.id)
      throw new UnauthorizedException('You can only read your own addresses.');

    return await this.getAddressService.getById(id);
  }
}
