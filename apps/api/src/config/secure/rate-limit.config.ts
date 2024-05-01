export const rateLimitOption = {
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'produdction' ? 100 : 100000, // limit each IP to 100 requests per windowMs
};
