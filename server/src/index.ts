import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { migrate } from './db/migrate.js';
import prospectRoutes from './routes/prospects.js';
import dealRoutes from './routes/deals.js';
import activityRoutes from './routes/activities.js';
import taskRoutes from './routes/tasks.js';
import dashboardRoutes from './routes/dashboard.js';

migrate();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/prospects', prospectRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Cortex server running on http://localhost:${PORT}`);
});
