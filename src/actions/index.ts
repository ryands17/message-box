import { defineAction, ActionError, z } from 'astro:actions';
import { db, message } from 'db/schema';

const sleep = (time = 1000) =>
  new Promise((resolve) => setTimeout(() => resolve(true), time));

export const server = {
  submitMessage: defineAction({
    accept: 'form',
    input: z.object({
      userId: z.string(),
      content: z.string().min(1, 'Message should not be empty!'),
    }),
    handler: async ({ content, userId }) => {
      try {
        await sleep(2000);
        await db.insert(message).values({
          content,
          createdBy: userId,
        });
        return true;
      } catch (error) {
        throw new ActionError({
          message: `Couldn't send the message. Please try again.`,
          code: 'BAD_REQUEST',
        });
      }
    },
  }),
};
