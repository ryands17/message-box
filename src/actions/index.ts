import { experimental_AstroContainer } from 'astro/container';
import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import MessageDisplay from 'components/MessageDisplay.astro';
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
        // add a delay to check loading state
        await sleep();
        const data = await db
          .insert(message)
          .values({
            content,
            createdBy: userId,
          })
          .returning();

        const container = await experimental_AstroContainer.create();
        const result = await container.renderToString(MessageDisplay, {
          props: { message: data[0], userId },
        });

        return result;
      } catch (_error) {
        throw new ActionError({
          message: `Couldn't send the message. Please try again.`,
          code: 'BAD_REQUEST',
        });
      }
    },
  }),
};
