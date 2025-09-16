import { Router } from 'express';
import { getAuthentication } from '../utils/jwt.js';

import * as salaPermissaoRepo from '../repository/salaPermissaoRepository.js';
import * as chatRepo from '../repository/chatRepository.js';

const endpoints = Router();
const autenticador = getAuthentication();


endpoints.post('/chat/:sala', autenticador, async (req, resp) => {
  let salaId = req.params.sala;
  let usuarioLogadoId = req.user.id;
  let mensagem = req.body.mensagem;

  if (!mensagem || mensagem.trim() === '') {
    resp.status(400).send({ erro: 'Mensagem é obrigatória' });
    return;
  }

  let permissao = await salaPermissaoRepo.verificarPermissaoSala(salaId, usuarioLogadoId);
  if (!permissao) {
    resp.status(403).send({ erro: 'Usuário não tem permissão para enviar mensagens nesta sala' });
    return;
  }

  let id = await chatRepo.inserirMensagem(usuarioLogadoId, salaId, mensagem);
  resp.send({ novoId: id });
});


endpoints.get('/chat/:sala', autenticador, async (req, resp) => {
  let salaId = req.params.sala;
  let usuarioLogadoId = req.user.id;

  let permissao = await salaPermissaoRepo.verificarPermissaoSala(salaId, usuarioLogadoId);
  if (!permissao) {
    resp.status(403).send({ erro: 'Usuário não tem permissão para visualizar mensagens nesta sala' });
    return;
  }

  let mensagens = await chatRepo.listarMensagensPorSala(salaId);
  resp.send(mensagens);
});


export default endpoints;