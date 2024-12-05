// src/comments/events/comment-created.event.ts
export class CommentCreatedEvent {
    constructor(
      public readonly commentId: number,
      public readonly userId: number,
      public readonly content: string,
      public readonly postId: number, // Add postId to link the comment to a specific post
    ) {}
  }
  