import { Router } from 'express';
import { getAuthentication } from '../utils/jwt.js';

import * as salaRepo from '../repository/salaRepository.js';
import * as salaPermissaoRepo from '../repository/salaPermissaoRepository.js';

const endpoints = Router();
const autenticador = getAuthentication();


endpoints.post('/sala', autenticador, async (req, resp) => {
  let nome = req.body.nome;
  let usuarioLogadoId = req.user.id;

  if (!nome || nome.trim() === '') {
    resp.status(400).send({ erro: 'Nome da sala é obrigatório' });
    return;
  }

  let id = await salaRepo.inserirSala(nome, usuarioLogadoId);
  await salaPermissaoRepo.inserirPermissao(id, usuarioLogadoId, true);

  resp.send({ novoId: id });
});


export default endpoints;