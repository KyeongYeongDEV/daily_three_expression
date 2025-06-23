const express = require('express');
const { Queue } = require('bullmq');
const { createBullBoard } = require('@bull-board/api');
const { ExpressAdapter } = require('@bull-board/express');
const { BullMQAdapter } = require('@bull-board/api/dist/src/queueAdapters/bullMQ'); // ✅ 여기 핵심!

const app = express();

const emailQueue = new Queue('email', {
  connection: {
    host: 'redis',
    port: 6379,
  },
});

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());

app.listen(4000, () => {
  console.log(`📊 Bull Board is running at http://localhost:4000/admin/queues`);
});
