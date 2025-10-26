import { Injectable } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import type { JwtService as NestJwtService } from "@nestjs/jwt"

export interface JwtPayload {
  sub: string
  email: string
  iat?: number
  exp?: number
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService
  ) {}

  async generateTokenPair(userId: string, email: string): Promise<TokenPair> {
    const payload: JwtPayload = {
      sub: userId,
      email,
    }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>("jwt.expiresIn") || "15m",
    })

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("jwt.refreshSecret"),
      expiresIn: this.configService.get<string>("jwt.refreshExpiresIn") || "7d",
    })

    const decodedToken = this.jwtService.decode(accessToken) as JwtPayload
    const expiresIn = decodedToken.exp ? decodedToken.exp - Math.floor(Date.now() / 1000) : 900

    return {
      accessToken,
      refreshToken,
      expiresIn,
    }
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token)
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.configService.get<string>("jwt.refreshSecret"),
    })
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const payload = await this.verifyRefreshToken(refreshToken)
    return this.generateTokenPair(payload.sub, payload.email)
  }

  extractTokenFromHeader(header: string): string | undefined {
    const [type, token] = header?.split(" ") ?? []
    return type === "Bearer" ? token : undefined
  }
}
