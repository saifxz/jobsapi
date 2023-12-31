require('dotenv').config();
require('express-async-errors');

const authentification=require('./middleware/authentication')
const connectDB=require('./db/connect')

//extra security packages
const helmet=require('helmet')
const cors=require('cors')
const xss=require('xss-clean')
const rateLimiter=require('rate-limiter')

const express = require('express');
const app = express();


const jobsRouter=require('./routes/jobs')
const authRouter=require('./routes/auth')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.use(rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
}))
app.use(express.json());
// extra packages
app.use(cors())
app.use(xss())
app.use(helmet())

// routes
app.use('/api/v1/jobs',authentification,jobsRouter)
app.use('/api/v1/auth',authRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    console.log("connected to DB...")
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
