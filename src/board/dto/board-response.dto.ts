export class BoardResponseDto {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  authorId: string;
  modifierId?: string;
  updatedAt: Date;
  onlyAuthorCanModify: boolean;
  boardId: string;
  isTemplate: boolean;
}
