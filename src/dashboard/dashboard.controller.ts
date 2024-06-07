import { Controller, Get, Req, Res } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
// import { CreateDashboardDto } from './dto/create-dashboard.dto';
// import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly usersService: UsersService
  ) {}
  
  @Get()
  async getDashboard(@Req() req: Request,  @Res() res: Response) {
      const users = await this.usersService.getAll(4);
      const data = await this.dashboardService.getCounts()
      return res.render('dashboard', {
        user: req.body.logged_in_user, 
        dashboard : { 
          counts: data.data,  
          userlist: JSON.parse(JSON.stringify(users?.data))
        }
      });
  }

  // @Post()
  // create(@Body() createDashboardDto: CreateDashboardDto) {
  //   return this.dashboardService.create(createDashboardDto);
  // }


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.dashboardService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDashboardDto: UpdateDashboardDto) {
  //   return this.dashboardService.update(+id, updateDashboardDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.dashboardService.remove(+id);
  // }
}
