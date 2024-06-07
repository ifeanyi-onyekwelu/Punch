const allowedOrigins: string[] = [
  "http://localhost:5173",
  "http:127.0.0.1:5173",
];

const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by cors"));
    }
  },
  credentials: true,
  setSuccessStatus: 200,
};

export default corsOptions;
