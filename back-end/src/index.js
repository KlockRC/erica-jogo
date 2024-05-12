const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser
const mongoose = require('mongoose');
const app = express();
const port = 3000; // Defina a porta do servidor

// Conexão ao MongoDB
mongoose.connect(`mongodb://${process.env.MONGO_IP}:27017/contas`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
db.once('open', () => console.log('Conectado ao MongoDB!'));

// Definição do modelo de dados (opcional)
const userSchema = new mongoose.Schema({
  nome: String,
  ocupacao: String,
  saldo: Number,
  barraFelicidade: Number,
  historicoTransacao: Array
});
const usuario = mongoose.model('usuario', userSchema);

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PATCH,DELETE");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Ative o middleware body-parser para lidar com dados JSON
app.use(bodyParser.json());

// Rotas da API
app.get('/usuarios', async (request, response) => {
  try {
    const usuarios = await usuario.find();
    response.json(usuarios);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.post('/usuarios/create', async (request, response) => {
  // Obter objeto JSON do corpo da requisição
  const dadosUsuario = request.body;

  // Criar novo objeto 'usuario' usando os dados
  const novoUsuario = new usuario(dadosUsuario);

  try {
    await novoUsuario.save();
    response.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.delete('/usuarios/delete/:id', async (request, response) => {
  try {
    const usuarioId = request.params.id; // Obter ID do usuário da URL
    const usuarioDeletado = await usuario.findByIdAndDelete(usuarioId);

    if (!usuarioDeletado) {
      return response.status(404).json({ message: 'Usuário não encontrado!' });
    }

    response.status(200).json({ message: 'Usuário removido com sucesso!' });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.patch('/usuarios/patch/:id', async (request, response) => {
  try {
    const usuarioId = request.params.id; // Obter ID do usuário da URL
    const atualizacoes = request.body; // Obter dados de atualização do corpo da requisição

    const usuarioAtualizado = await usuario.findByIdAndUpdate(
      usuarioId,
      atualizacoes,
      { new: true } // Retornar o documento atualizado
    );

    if (!usuarioAtualizado) {
      return response.status(404).json({ message: 'Usuário não encontrado!' });
    }

    response.status(200).json(usuarioAtualizado);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

// Iniciar o servidor
app.listen(port, () => console.log(`Servidor Node.js iniciado na porta ${port}`));
