let saldo = 0;
let barraFelicidade = 1;
const backUrl = formatarUrlBack(window.location.href);

function formatarUrlBack(url) {
    const urlObject = new URL(url);
    const urlBack = `${urlObject.protocol}//${urlObject.hostname}:3000`;
    return urlBack;
}

function carregarUsuario() {
    carregarBarraFelicidade();
    carregarSaldo();
    carregarTransacao();
}

async function carregarMenuSuspenso() {
    const objetos = await callBack({
        metodo: "GET",
        url: `${backUrl}/usuarios`
    });
    const selectElement = document.getElementById('usuarios-lista');
    selectElement.innerHTML = ''; // Limpa as opções existentes
  
    objetos.forEach(objeto => {
      const option = document.createElement('option');
      option.value = objeto._id;
      option.textContent = objeto.nome;
      selectElement.appendChild(option);
    });
}

async function carregarBarraFelicidade() {
    const selectElement = document.getElementById('usuarios-lista');
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    if (selectedOption) {
        const selectedOptionValue = selectedOption.value; // Pega o valor da opção selecionada
        const objetosBanco = await callBack({
            metodo: "GET",
            url: `${backUrl}/usuarios`
        })

        const objetoBanco = objetosBanco.find(
            (obj) => obj._id === selectedOptionValue
        );
        
        barraFelicidade = objetoBanco.barraFelicidade;
        document.getElementById('valor-barra-felicidade').textContent = barraFelicidade.toFixed(2);
    }
}

async function carregarSaldo() {
    const selectElement = document.getElementById('usuarios-lista');
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    if (selectedOption) {
        const selectedOptionValue = selectedOption.value; // Pega o valor da opção selecionada
        const objetosBanco = await callBack({
            metodo: "GET",
            url: `${backUrl}/usuarios`
        })

        const objetoBanco = objetosBanco.find(
            (obj) => obj._id === selectedOptionValue
        );
        
        saldo = objetoBanco.saldo;
        const saldoFormatado = formatarSaldo(saldo);
        document.getElementById('saldo').textContent = saldoFormatado;
    }
}

async function carregarTransacao() {
    let selectElement = document.getElementById('transacoes-tabela');
    const corpoTabela = selectElement.querySelector('tbody'); // Pega o elementos na tabela (tbody)
    corpoTabela.innerHTML = ''; // Limpa as os elementos da tabela

    selectElement = document.getElementById('usuarios-lista');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    if (selectedOption) {
        const selectedOptionValue = selectedOption.value; // Pega o valor da opção selecionada

        const objetosBanco = await callBack({
            metodo: "GET",
            url: `${backUrl}/usuarios`
        })

        const objetoBanco = objetosBanco.find(
            (obj) => obj._id === selectedOptionValue
        );

        const historicoTransacao = objetoBanco.historicoTransacao;
        historicoTransacao.forEach(transacao => {
            const linha = document.createElement('tr'); // Create a new row

            const data = document.createElement('td');
            data.textContent = transacao.data; // Set data cell content
            linha.appendChild(data);

            const descricao = document.createElement('td');
            descricao.textContent = transacao.descricao; // Set description cell content
            linha.appendChild(descricao);

            const valor = document.createElement('td');
            valor.textContent = `M$ ${transacao.valor.toFixed(2)}`; // Format and set value cell content
            linha.appendChild(valor);

            corpoTabela.appendChild(linha); // Append the row to the table body
        });
    }
}

async function deletarUsuario() {
    const selectElement = document.getElementById('usuarios-lista');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
  
    if (selectedOption) {
      const optionValue = selectedOption.value; // Pega o valor da opção selecionada
      await callBack({
        metodo: "DELETE",
        url: `${backUrl}/usuarios/delete/${optionValue}`});
      selectElement.remove(selectElement.selectedIndex); // Remove a opção selecionada
    }
}

async function criarUsuario() {
    const nomeUsuario = document.getElementById('criar-usuario')?.value || "ERROR USUÁRIO INDEFINIDO";
    const ocupacaoUsuario = document.getElementById('ocupacao')?.value || null;
    await callBack({
        metodo: "POST",
        url: `${backUrl}/usuarios/create`,
        data: { nome: nomeUsuario, ocupacao: ocupacaoUsuario, saldo: 1000000, barraFelicidade: 1 }
    })
    carregarMenuSuspenso();
    document.getElementById('criar-usuario').value = '';
    document.getElementById('ocupacao').value = '';
}

async function atualizarBarraFelicidade() {
    barraFelicidade = parseFloat(document.getElementById('barra-felicidade').value);
    document.getElementById('valor-barra-felicidade').textContent = barraFelicidade.toFixed(2);
    const selectElement = document.getElementById('usuarios-lista');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    if (selectedOption) {
        const selectedOptionValue = selectedOption.value; // Pega o valor da opção selecionada
        await callBack({
            metodo: "PATCH",
            url: `${backUrl}/usuarios/patch/${selectedOptionValue}`,
            data: { barraFelicidade }
        })
    }
}

function adicionarValor() {
    const valorAdicionar = parseFloat(document.getElementById('valor-adicionar').value);
    if (valorAdicionar > 0) {
        saldo += valorAdicionar * barraFelicidade;
        atualizarSaldo();
        adicionarTransacao('Adição', valorAdicionar * barraFelicidade);
    }
    document.getElementById('valor-adicionar').value = '';
}

function debitarValor() {
    const valorDebitar = parseFloat(document.getElementById('valor-debitar').value);
    if (valorDebitar > 0 && valorDebitar <= saldo) {
        saldo -= valorDebitar;
        atualizarSaldo();
        adicionarTransacao('Débito', -valorDebitar);
    }
    document.getElementById('valor-debitar').value = '';
}

async function atualizarSaldo() {
    const saldoFormatado = formatarSaldo(saldo);
    document.getElementById('saldo').textContent = saldoFormatado;
    const selectElement = document.getElementById('usuarios-lista');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    if (selectedOption) {
        const selectedOptionValue = selectedOption.value; // Pega o valor da opção selecionada
        await callBack({
            metodo: "PATCH",
            url: `${backUrl}/usuarios/patch/${selectedOptionValue}`,
            data: { saldo }
        })
    }
}

async function adicionarTransacao(descricao, valor) {
    const data = new Date().toLocaleDateString();
    const tabelaTransacoes = document.getElementById('transacoes-tabela');
    const corpoTabela = tabelaTransacoes.querySelector('tbody');

    const linha = document.createElement('tr'); // Create a new row

    const colunaData = document.createElement('td');
    colunaData.textContent = data; // Set data cell content
    linha.appendChild(colunaData);

    const colunaDescricao = document.createElement('td');
    colunaDescricao.textContent = descricao; // Set description cell content
    linha.appendChild(colunaDescricao);

    const colunaValor = document.createElement('td');
    colunaValor.textContent = `M$ ${valor.toFixed(2)}`; // Format and set value cell content
    linha.appendChild(colunaValor);

    corpoTabela.appendChild(linha); // Append the row to the table body

    const selectElement = document.getElementById('usuarios-lista');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    if (selectedOption) {
        const selectedOptionValue = selectedOption.value; // Pega o valor da opção selecionada

        const objetosBanco = await callBack({
            metodo: "GET",
            url: `${backUrl}/usuarios`
        })

        const objetoBanco = objetosBanco.find(
            (obj) => obj._id === selectedOptionValue
        );

        const historicoTransacao = objetoBanco.historicoTransacao;
        historicoTransacao.push({ data, descricao, valor });

        await callBack({
            metodo: "PATCH",
            url: `${backUrl}/usuarios/patch/${selectedOptionValue}`,
            data: { historicoTransacao }
        })
    }
}

function formatarSaldo(valor) {
    return valor.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

async function callBack({ metodo, url, data }) {
    try {
      const response = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data) // Não envia um objeto vazio se 'data' for indefinido
      });
  
      if (response.ok) {
        const responseData = await response.json();
        return responseData; // Retorna os dados JSON da resposta
      } else {
        throw new Error(`A requisição falhou com o status: ${response.status}`);
      }
    } catch (error) {
      return Promise.reject(error); // Rejeita a Promise com o erro
    }
}  

async function start() {
    await carregarMenuSuspenso();
    carregarBarraFelicidade();
    carregarSaldo();
    carregarTransacao();

    
    console.log(callBack({
        metodo: "GET",
        url: `${backUrl}/usuarios`
    }));  
    
}

start();