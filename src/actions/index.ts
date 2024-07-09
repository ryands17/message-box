import { experimental_AstroContainer } from 'astro/container';
import { defineAction, ActionError, z } from 'astro:actions';
import { db, message } from 'db/schema';
import MessageDisplay from 'components/MessageDisplay.astro';

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
        await sleep();
        const data = await db
          .insert(message)
          .values({
            content,
            createdBy: userId,
          })
          .returning();

        console.log({ data });
        const container = await experimental_AstroContainer.create();
        const result = await container.renderToString(MessageDisplay, {
          props: { message: data[0], userId },
        });

        return result;
      } catch (error) {
        throw new ActionError({
          message: `Couldn't send the message. Please try again.`,
          code: 'BAD_REQUEST',
        });
      }
    },
  }),
};
