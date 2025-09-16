import { Router } from 'express';
import { getAuthentication } from '../utils/jwt.js';

import * as salaPermissaoRepo from '../repository/salaPermissaoRepository.js';
import * as salaRepo from '../repository/salaRepository.js';

const endpoints = Router();
const autenticador = getAuthentication();



endpoints.post('/sala/:sala/entrar', autenticador, async (req, resp) => {
  let salaId = req.params.sala;
  let usuarioLogadoId = req.user.id;

  let id = await salaPermissaoRepo.inserirPermissao(salaId, usuarioLogadoId, false);

  resp.send({ novoId: id });
});


endpoints.post('/sala/:sala/aprovar/:usuario', autenticador, async (req, resp) => {
  let salaId = req.params.sala;
  let usuarioId = req.params.usuario;
  let usuarioLogadoId = req.user.id;

  let criador = await salaPermissaoRepo.verificarCriadorSala(salaId, usuarioLogadoId);
  if (!criador) {
    resp.status(403).send({ erro: 'Apenas o criador da sala pode aprovar usuários' });
    return;
  }

  await salaPermissaoRepo.aprovarPermissao(salaId, usuarioId);
  resp.send({ mensagem: 'Usuário aprovado' });
});


export default endpoints;