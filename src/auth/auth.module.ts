import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module'; // Assuming your user module is named UsersModule and path is correct
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants'; // Make sure you have this file

import { JwtAuthGuard } from './jwt-auth.guard'; // Also used as a provider/guard
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule, // Needed for AuthService to interact with UsersService
    PassportModule, // Provides authentication strategies (like JWT)
    JwtModule.register({ // <--- This makes JwtService available
      secret: jwtConstants.secret,
      // If you want non-expiring tokens, DO NOT add signOptions: { expiresIn: '...' }
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,  // Your core authentication logic
    JwtStrategy,  // Passport strategy for JWT validation
    JwtAuthGuard  // The guard that uses JwtStrategy to protect routes
  ],
  exports: [AuthService], // Export AuthService if other modules need to use its methods
})
export class AuthModule {}