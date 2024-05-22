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
    atualizarMenuSuspensoTransacoes();
}

async function carregarMenuSuspenso() {
    const objetos = await callBack({
        metodo: "GET",
        url: `${backUrl}/usuarios`
    });

    const selectElement = [
        document.getElementById('usuarios-lista'),
        document.getElementById('usuarios-transferir')
    ];
    
    selectElement[0].innerHTML = ''; // Limpa as opções existentes
  
    objetos.forEach(objeto => {
      selectElement.forEach(menu => {
        if(!(objeto === objetos[0] && menu === selectElement[1])) {
            const option = document.createElement('option');
            option.value = objeto._id;
            option.textContent = objeto.nome;
            menu.appendChild(option);
        };
      });
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
        document.getElementById('barra-felicidade').value = barraFelicidade;
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
      carregarUsuario();
      atualizarMenuSuspensoTransacoes();
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

function atualizarMenuSuspensoTransacoes() {
    const selectElement = [
        document.getElementById('usuarios-lista'),
        document.getElementById('usuarios-transferir')
    ];
    const selectElementOptions = selectElement[0].options;
    const selectedOption = selectElement[0].options[selectElement[0].selectedIndex];
    selectElement[1].innerHTML = ''; // Limpa as opções existentes

    // Adiciona a opção default
    const optionDefault = document.createElement('option');
    optionDefault.textContent = 'Transferir para ...';
    selectElement[1].appendChild(optionDefault);

    //Adiciona todos os usuários exceto o atual selecionado
    for (let i = 0; i < selectElementOptions.length; i++) {
        if(selectElementOptions[i] === selectedOption) continue;
        const newOption = document.createElement('option');
        newOption.value = selectElementOptions[i].value;
        newOption.textContent = selectElementOptions[i].textContent;
        selectElement[1].appendChild(newOption);
    }
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

function transferirValor() {
    const selectElement = document.getElementById('usuarios-transferir');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const valorTransferir = parseFloat(document.getElementById('valor-transferir').value);

    if(!(selectedOption && valorTransferir)) return;

    if (valorTransferir > 0 && valorTransferir <= saldo) {
        if(selectedOption.value) {
            saldo -= valorTransferir;
            atualizarSaldo(valorTransferir);
            adicionarTransacao(`Transferencia realizada para ${selectedOption.textContent}`, -valorTransferir);
        }
    }
    document.getElementById('valor-transferir').value = '';
}

async function atualizarSaldo(transferir = null) {
    const saldoFormatado = formatarSaldo(saldo);
    document.getElementById('saldo').textContent = saldoFormatado;
    const selectElement = document.getElementById('usuarios-lista');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    if (!selectedOption) return;
    const selectedOptionValue = selectedOption.value; // Pega o valor da opção selecionada
    
    if(transferir !== null) {
        const userToTranfer = document.getElementById('usuarios-transferir');
        const userToTranferSelectedOption = userToTranfer.options[userToTranfer.selectedIndex];
        const userToTranferValue = userToTranferSelectedOption.value;
        const objetosBanco = await callBack({
            metodo: "GET",
            url: `${backUrl}/usuarios`
        })

        const objetoBanco = objetosBanco.find(
            (obj) => obj._id === userToTranferValue
        );

        const objetoBancoSaldo = objetoBanco.saldo + transferir;
        const historicoTransacao = objetoBanco.historicoTransacao;
        const data = new Date().toLocaleDateString();
        const descricao = `Transferencia recebida de ${selectedOption.textContent}`;
        historicoTransacao.push({ data, descricao, valor: transferir });

        await callBack({
            metodo: "PATCH",
            url: `${backUrl}/usuarios/patch/${userToTranferValue}`,
            data: { historicoTransacao, saldo: objetoBancoSaldo }
        })

        await callBack({
            metodo: "PATCH",
            url: `${backUrl}/usuarios/patch/${selectedOptionValue}`,
            data: { saldo }
        })
        return;
    }

    await callBack({
        metodo: "PATCH",
        url: `${backUrl}/usuarios/patch/${selectedOptionValue}`,
        data: { saldo }
    })
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

function chamarLogs(path) {
    const urlLogs = `${window.location.href}${path}`
    return urlLogs
}

async function logs() {
    const selectElement = document.getElementById('transacoes-tabela-logs');
    const corpoTabela = selectElement.querySelector('tbody'); // Pega o elementos na tabela (tbody)
    corpoTabela.innerHTML = ''; // Limpa as os elementos da tabela

    const objetosBanco = await callBack({
        metodo: "GET",
        url: `${backUrl}/usuarios`
    })

    objetosBanco.forEach(usuario => {
        const historicoTransacao = usuario.historicoTransacao;
        historicoTransacao.forEach(transacao => {
        const linha = document.createElement('tr'); // Create a new row

        const data = document.createElement('td');
        data.textContent = transacao.data; // Set data cell content
        linha.appendChild(data);

        const descricao = document.createElement('td');
        descricao.textContent = `De "${usuario.nome}": ${transacao.descricao}`; // Set description cell content
        linha.appendChild(descricao);

        const valor = document.createElement('td');
        valor.textContent = `M$ ${transacao.valor.toFixed(2)}`; // Format and set value cell content
        linha.appendChild(valor);

        corpoTabela.appendChild(linha); // Append the row to the table body
        });
    });
}

async function start() {
    await carregarMenuSuspenso();
    carregarBarraFelicidade();
    carregarSaldo();
    carregarTransacao();
}
