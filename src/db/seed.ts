import { db, message, user } from './schema';

// create users
const users = await db
  .insert(user)
  .values([{ name: 'John Doe' }, { name: 'Jane Doe' }])
  .returning();

// create messages
await db.insert(message).values([
  {
    content: 'Hello, your application has been approved!',
    createdBy: users[0].id,
  },
  {
    content: 'Great! What are the next steps?',
    createdBy: users[1].id,
  },
]);
