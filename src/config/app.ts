import 'reflect-metadata';

import fastify from 'fastify';

import { Routes } from '../routes/route-example';
import { setupHealthCheck } from './healthcheck';

export const app = fastify();
app.register(setupHealthCheck);
app.register(Routes);
