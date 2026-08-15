export type UserRoleEnum = 'ADMIN' | 'EDITOR';

export interface AuthUserDto {
  id: string;
  email: string;
  role: UserRoleEnum;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSessionResponseDto {
  user: AuthUserDto;
}
