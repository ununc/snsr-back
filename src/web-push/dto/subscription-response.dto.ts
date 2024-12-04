import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SubscriptionResponseDto {
  @Expose()
  id: number;

  @Expose()
  endpoint: string;

  @Expose()
  expirationTime: Date | null;

  @Expose()
  createdAt: Date;
}
