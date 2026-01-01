import app from '../backend/src/server';
import connectDB from '../backend/src/utils/db';

export default async (req: any, res: any) => {
  await connectDB();
  return app(req, res);
};

