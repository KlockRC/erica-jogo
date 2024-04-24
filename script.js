let saldo = 0;
let barraFelicidade = 1;

function atualizarBarraFelicidade() {
    barraFelicidade = parseFloat(document.getElementById('barra-felicidade').value);
    document.getElementById('valor-barra-felicidade').textContent = barraFelicidade.toFixed(2);
}

function adicionarValor() {
    const valorAdicionar = parseFloat(document.getElementById('valor-adicionar').value);
    if (valorAdicionar > 0) {
        saldo += valorAdicionar * barraFelicidade;
        atualizarSaldo();
        adicionarTransacao('Adição', valorAdicionar * barraFelicidade);
    }
}

function debitarValor() {
    const valorDebitar = parseFloat(document.getElementById('valor-debitar').value);
    if (valorDebitar > 0 && valorDebitar <= saldo) {
        saldo -= valorDebitar;
        atualizarSaldo();
        adicionarTransacao('Débito', -valorDebitar);
    }
}

function atualizarSaldo() {
    const saldoFormatado = formatarSaldo(saldo);
    document.getElementById('saldo').textContent = saldoFormatado;
}

function adicionarTransacao(descricao, valor) {
    const data = new Date().toLocaleDateString();
    const transacaoRow = `<tr><td>${data}</td><td>${descricao}</td><td>R$ ${valor.toFixed(2)}</td></tr>`;
    document.getElementById('transacoes-tabela').insertAdjacentHTML('beforeEnd', transacaoRow);
}

function formatarSaldo(valor) {
    return valor.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
