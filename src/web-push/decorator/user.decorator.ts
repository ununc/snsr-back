import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // data가 전달되면 해당 속성만 반환, 아니면 전체 user 객체 반환
    return data ? user?.[data] : user;
  },
);
