let saldo = parseFloat(document.getElementById('saldo-atual').textContent.replace(/\./g, ""));
const saldoAtual = document.getElementById('saldo-atual');
const historicoLista = document.getElementById('historico-lista');

const adicionarSaldoForm = document.getElementById('adicionar-saldo');
const valorAdicionarInput = document.getElementById('valor-adicionar');

const subtrairSaldoForm = document.getElementById('subtrair-saldo');
const valorSubtrairInput = document.getElementById('valor-subtrair');


adicionarSaldoForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const valorAdicionar = parseFloat(valorAdicionarInput.value);
    adicionarValor(valorAdicionar);

    atualizarSaldo();
    adicionarHistorico('Adição', valorAdicionar);

    valorAdicionarInput.value = '';
});

subtrairSaldoForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const valorSubtrair = parseFloat(valorSubtrairInput.value);
    subtrairValor(valorSubtrair);

    atualizarSaldo();
    adicionarHistorico('Subtração', -valorSubtrair);

    valorSubtrairInput.value = '';
});

function adicionarValor(valor) {
    saldo += valor;
}

function subtrairValor(valor) {
    if (saldo >= valor) {
        saldo -= valor;
    } else {
        alert('Saldo insuficiente!');
    }
}

function atualizarSaldo() {
    const Array = saldo.toFixed(2).replace(/\./g, ",").split(',');
    Array[0] = Array[0].split("").reverse().join("").split(/(.{3})/g).join('.');
    saldoAtual.textContent = Array.join(',');
}

function adicionarHistorico(tipo, valor) {
    const data = new Date().toLocale
}