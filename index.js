import { adicionarRotas } from './rotas.js';

import express from 'express'
const api = express();
api.use(express.json());

adicionarRotas(api);

api.listen(5010, () => console.log('Subiu essa bosta na porta 5010'))

