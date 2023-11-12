import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/users.schema';
import { UsersModule } from './users.module';
import { Model } from 'mongoose';
import { CreateUserDto, SignInDto } from './schema/dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
  async onModuleInit() {
    const user = await this.findOneUser();
    if (!user) {
      this.createUser({
        name: 'Test',
        email: 'test@gmail.com',
        password: 'Test@123',
        phone_number: '+919845839611',
      });
    }
  }

  async findOneUser(): Promise<User> {
    return await this.userModel.findOne();
  }

  createUser(userProperties: CreateUserDto): void {
    this.userModel.create({ ...userProperties });
  }

  async findById(id): Promise<User> {
    return await this.userModel.findById(id);
  }

  async validateUser(params: SignInDto): Promise<any> {
    const user = await this.userModel.findOne({ email: params.email });
    console.info(user);
    if (!user) {
      throw new HttpException('Invalid username or password', 400);
    }
    const { password } = await this.userModel
      .findById(user._id)
      .select('password')
      .exec();

    const areEqual = await bcrypt.compare(params.password, password);

    if (!areEqual) {
      throw new HttpException('Invalid username or password', 400);
    }

    const token = this.jwtService.sign({ id: user._id });
    return {
      success: true,
      token: token,
    };
  }
}
