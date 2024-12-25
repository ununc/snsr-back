export class CommentResponseDto {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
  boardId: string;
  children?: CommentResponseDto[];
}
