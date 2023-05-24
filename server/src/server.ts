import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'
import { uploadRoutes } from './routes/upload'
import fastifyStatic from '@fastify/static'
import { resolve } from 'path'

const app = fastify()

app.register(multipart)

app.register(fastifyStatic, {
  root: resolve(__dirname, '..', 'public'),
  prefix: '/public',
})

app.register(cors, {
  /* origin: ['http://localhost:3000'], */
  origin: true,
})

app.register(jwt, {
  secret: `${process.env.JWT_SECRET}`,
})

app.register(authRoutes)
app.register(uploadRoutes)
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 HTTP server running on http://localhost:3333')
  })
