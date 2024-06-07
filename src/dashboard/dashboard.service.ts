import { Injectable } from '@nestjs/common';
// import { CreateDashboardDto } from './dto/create-dashboard.dto';
// import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DashboardService {
  constructor(private readonly usersService: UsersService) {}

  async getCounts() {
    try {
      const userCount = await this.usersService.getUserCount();
      //scanned points
      //successful withdrawals
      //pending points

      const data = {
        users: userCount || 0,
        scanned_points: 0,
        successful_withdrawals: 0,
        pending_points: 0,
      };
      if (data) {
        return { status: true, data: data, message: 'Counts found!' };
      } else {
        return { status: false, data: {}, message: 'Counts not found!' };
      }
    } catch (error) {
      return { status: false, data: error, message: error.message };
    }
  }

  // create(createDashboardDto: CreateDashboardDto) {
  //   return 'This action adds a new dashboard';
  // }

  // findAll() {
  //   return `This action returns all dashboard`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} dashboard`;
  // }

  // update(id: number, updateDashboardDto: UpdateDashboardDto) {
  //   return `This action updates a #${id} dashboard`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} dashboard`;
  // }
}
