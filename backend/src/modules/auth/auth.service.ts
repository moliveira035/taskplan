import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../../database/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      include: {
        role: true,
        position: true,
      },
    });

    if (!user || !user.active || user.deletedAt) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    if (!user.role.active) {
      throw new UnauthorizedException(
        'O perfil de acesso do usuário está inativo.',
      );
    }

    const passwordMatches = await argon2.verify(
      user.passwordHash,
      dto.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
      role: user.role.name,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        active: user.active,
        role: user.role,
        position: user.position,
      },
    };
  }
}
