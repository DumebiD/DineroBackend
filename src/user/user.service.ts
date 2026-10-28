import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) { }

  private normalize(email: string) {
    return email.trim().toLowerCase();
  }

  findById(id: string) {
    return this.users.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.users.findOneBy({ email: this.normalize(email) });
  }

  // only for login: the one place that needs passwordHash
  findByEmailWithPassword(email: string) {
    return this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: this.normalize(email) })
      .getOne();
  }

  async create(data: { firstName: string; lastName: string; email: string; passwordHash: string }) {
    try {
      return await this.users.save(
        this.users.create({
          ...data,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          email: this.normalize(data.email),
        }),
      );
    } catch (e) {
      // 23505 = Postgres unique violation; also covers two signups racing past an exists check
      if (e instanceof QueryFailedError && (e as any).driverError?.code === '23505') {
        throw new ConflictException('Email already registered');
      }
      throw e;
    }
  }
}