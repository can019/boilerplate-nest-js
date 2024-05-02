export const corsOption = {
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Range', 'accept', 'range'],
  origin: ['http://localhost:3001'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  optionsSuccessStatus: 200,
};
