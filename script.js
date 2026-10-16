// Gabarito dos quizzes: a resposta correta fica apenas no JS (não aparece no HTML)
const RESPOSTAS_QUIZ = {
  whatsapp: 1, // Ligar no número antigo antes de enviar
  pix: 2,      // Conferir o extrato no app do banco
  banco: 0,    // Desligar e ligar para o número do cartão
  compras: 1   // Prêmio real não cobra taxas
};

function criarAcertosZerados() {
  return Object.keys(RESPOSTAS_QUIZ).reduce((acc, chave) => {
    acc[chave] = false;
    return acc;
  }, {});
}

let acertosQuizzes = criarAcertosZerados();

document.addEventListener('DOMContentLoaded', () => {
  let percentualTamanho = 100;
  const PASSO = 10;
  const MIN_TAMANHO = 80;
  const MAX_TAMANHO = 150;

  const html = document.documentElement;
  const body = document.body;

  const btnAumentar = document.getElementById('btnAumentarTexto');
  const btnDiminuir = document.getElementById('btnDiminuirTexto');
  const btnResetar = document.getElementById('btnResetarTexto');
  const btnModoEscuro = document.getElementById('btnModoEscuro');
  const iconeTema = document.getElementById('iconeTema');
  const textoTema = document.getElementById('textoTema');
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');

  // TAMANHO DA FONTE + LOCALSTORAGE
  function aplicarTamanho(novoTamanho) {
    percentualTamanho = Math.min(Math.max(novoTamanho, MIN_TAMANHO), MAX_TAMANHO);
    html.style.fontSize = `${percentualTamanho}%`;
    
    if (btnResetar) btnResetar.textContent = `${percentualTamanho}%`;
    localStorage.setItem('idosoSeguro_tamanho', percentualTamanho.toString());
  }

  // MODO ESCURO + LOCALSTORAGE
  function alternarModoEscuro(ativar) {
    const estaAtivo = ativar !== undefined ? ativar : !body.classList.contains('modo-escuro');

    if (estaAtivo) {
      body.classList.add('modo-escuro');
      if (iconeTema) iconeTema.textContent = '☀️';
      if (textoTema) textoTema.textContent = 'Modo Claro';
    } else {
      body.classList.remove('modo-escuro');
      if (iconeTema) iconeTema.textContent = '🌙';
      if (textoTema) textoTema.textContent = 'Modo Escuro';
    }

    localStorage.setItem('idosoSeguro_modoEscuro', estaAtivo ? 'true' : 'false');
  }

  if (btnAumentar) btnAumentar.addEventListener('click', () => aplicarTamanho(percentualTamanho + PASSO));
  if (btnDiminuir) btnDiminuir.addEventListener('click', () => aplicarTamanho(percentualTamanho - PASSO));
  if (btnResetar) btnResetar.addEventListener('click', () => aplicarTamanho(100));
  if (btnModoEscuro) btnModoEscuro.addEventListener('click', () => alternarModoEscuro());

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => menu.classList.toggle('ativo'));
  }

  // CARREGAR PREFERÊNCIAS DO LOCALSTORAGE
  const tamanhoSalvo = localStorage.getItem('idosoSeguro_tamanho');
  if (tamanhoSalvo) aplicarTamanho(parseInt(tamanhoSalvo, 10));

  const modoEscuroSalvo = localStorage.getItem('idosoSeguro_modoEscuro');
  if (modoEscuroSalvo === 'true') alternarModoEscuro(true);

  const progressoSalvo = localStorage.getItem('idosoSeguro_progresso');
  if (progressoSalvo) {
    try {
      const salvo = JSON.parse(progressoSalvo);
      // Só aceita chaves conhecidas com valor booleano
      Object.keys(RESPOSTAS_QUIZ).forEach(chave => {
        if (salvo && salvo[chave] === true) acertosQuizzes[chave] = true;
      });
    } catch (e) {
      console.error('Erro ao ler progresso:', e);
    }
  }

  const nomeAluno = document.getElementById('nomeAluno');
  if (nomeAluno) nomeAluno.addEventListener('input', ocultarErroNome);

  atualizarBarraProgresso();
});

// TROCA DE ABAS
function mudarAba(idGolpe) {
  document.querySelectorAll('.painel-golpe').forEach(p => p.classList.remove('ativo'));
  document.querySelectorAll('.aba-btn').forEach(b => b.classList.remove('ativa'));

  const painel = document.getElementById(`golpe-${idGolpe}`);
  const aba = document.getElementById(`tab-${idGolpe}`);

  if (painel && aba) {
    painel.classList.add('ativo');
    aba.classList.add('ativa');
  }
}

// LÓGICA DO QUIZ
function responderQuiz(golpeKey, opcaoIndex) {
  const quizCard = document.getElementById(`quiz-${golpeKey}`);
  const resultado = document.getElementById(`resultado-${golpeKey}`);
  if (!quizCard || !resultado) return;

  const ehCorreta = opcaoIndex === RESPOSTAS_QUIZ[golpeKey];
  const botoes = quizCard.querySelectorAll('.opcao-btn');

  botoes.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === opcaoIndex) {
      btn.classList.add(ehCorreta ? 'correta' : 'incorreta');
    }
  });

  if (ehCorreta) {
    resultado.className = 'quiz-resultado correto';
    resultado.innerHTML = '🎉 <strong>Resposta Correta!</strong> Você acertou o comportamento seguro.';
    
    acertosQuizzes[golpeKey] = true;
    localStorage.setItem('idosoSeguro_progresso', JSON.stringify(acertosQuizzes));
    atualizarBarraProgresso();
  } else {
    resultado.className = 'quiz-resultado incorreto';
    resultado.innerHTML = '⚠️ <strong>Atenção!</strong> Essa opção colocaria seus dados em risco.';
  }
}

// BARRA DE PROGRESSO E CERTIFICADO
function atualizarBarraProgresso() {
  const total = Object.keys(acertosQuizzes).length;
  const concluidos = Object.values(acertosQuizzes).filter(Boolean).length;
  const porcentagem = Math.round((concluidos / total) * 100);

  const textoProgresso = document.getElementById('textoProgresso');
  const porcentagemProgresso = document.getElementById('porcentagemProgresso');
  const barraPreenchimento = document.getElementById('barraPreenchimento');
  const secaoCertificado = document.getElementById('secao-certificado');

  if (textoProgresso) textoProgresso.textContent = `${concluidos} de ${total} golpes dominados`;
  if (porcentagemProgresso) porcentagemProgresso.textContent = `${porcentagem}%`;
  if (barraPreenchimento) barraPreenchimento.style.width = `${porcentagem}%`;

  if (porcentagem === 100 && secaoCertificado) {
    secaoCertificado.style.display = 'block';
  }
}

// REFAZER OS QUIZZES (limpa o progresso salvo)
function reiniciarProgresso() {
  const refazer = document.getElementById('btnRefazerProgresso');
  const confirmar = window.confirm('Deseja apagar seu progresso e refazer todos os quizzes?');
  if (!confirmar) return;

  acertosQuizzes = criarAcertosZerados();
  localStorage.removeItem('idosoSeguro_progresso');

  document.querySelectorAll('.cartao-quiz').forEach(cartao => {
    cartao.querySelectorAll('.opcao-btn').forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('correta', 'incorreta');
    });
  });

  document.querySelectorAll('.quiz-resultado').forEach(resultado => {
    resultado.className = 'quiz-resultado';
    resultado.textContent = '';
  });

  const secaoCertificado = document.getElementById('secao-certificado');
  if (secaoCertificado) secaoCertificado.style.display = 'none';

  const areaCertificado = document.getElementById('areaCertificadoModal');
  if (areaCertificado) areaCertificado.style.display = 'none';

  const campoNome = document.getElementById('nomeAluno');
  if (campoNome) campoNome.value = '';
  ocultarErroNome();

  atualizarBarraProgresso();

  const primeiraAba = document.querySelector('.abas-golpes .aba-btn');
  if (primeiraAba) mudarAba(primeiraAba.id.replace('tab-', ''));
  if (refazer) refazer.blur();
}

// MITO OU VERDADE
function revelarMito(elemento) {
  elemento.classList.toggle('ativo');
}

// ERRO DO CAMPO DO NOME (sem usar alert)
function ocultarErroNome() {
  const erro = document.getElementById('erroNomeAluno');
  if (erro) erro.hidden = true;
}

// GERAR CERTIFICADO
function gerarCertificado() {
  const nomeInput = document.getElementById('nomeAluno');
  const nome = nomeInput ? nomeInput.value.trim() : '';
  
  if (!nome) {
    const erro = document.getElementById('erroNomeAluno');
    if (erro) erro.hidden = false;
    if (nomeInput) nomeInput.focus();
    return;
  }

  ocultarErroNome();

  const certNomeUsuario = document.getElementById('certNomeUsuario');
  const certData = document.getElementById('certData');
  const areaCertificado = document.getElementById('areaCertificadoModal');

  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-BR');

  if (certNomeUsuario) certNomeUsuario.textContent = nome;
  if (certData) certData.textContent = `Data: ${dataFormatada}`;
  if (areaCertificado) areaCertificado.style.display = 'block';
}

// MODAL DE EMERGÊNCIA (fecha com Esc, clique fora e devolve o foco)
let elementoFocoAnterior = null;

function abrirModalEmergencia() {
  const modal = document.getElementById('modalEmergencia');
  if (!modal) return;

  elementoFocoAnterior = document.activeElement;
  modal.style.display = 'flex';

  const btnFechar = modal.querySelector('.modal-fechar');
  if (btnFechar) btnFechar.focus();
}

function fecharModalEmergencia() {
  const modal = document.getElementById('modalEmergencia');
  if (!modal || modal.style.display === 'none') return;

  modal.style.display = 'none';

  if (elementoFocoAnterior && typeof elementoFocoAnterior.focus === 'function') {
    elementoFocoAnterior.focus();
  }
  elementoFocoAnterior = null;
}

document.addEventListener('keydown', (evento) => {
  const modal = document.getElementById('modalEmergencia');
  if (!modal || modal.style.display === 'none') return;

  if (evento.key === 'Escape') {
    fecharModalEmergencia();
    return;
  }

  // Mantém o foco dentro do modal enquanto ele estiver aberto
  if (evento.key === 'Tab') {
    const focaveis = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focaveis.length) return;

    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];

    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  }
});

// Clique no fundo escuro fecha o modal
document.addEventListener('click', (evento) => {
  const modal = document.getElementById('modalEmergencia');
  if (modal && evento.target === modal) fecharModalEmergencia();
});

// SIMULADOR PRÁTICO
function testarSimulador(opcaoSegura) {
  const feedback = document.getElementById('simuladorFeedback');
  if (!feedback) return;

  if (opcaoSegura) {
    feedback.className = 'simulador-feedback sucesso';
    feedback.innerHTML = '🎉 <strong>EXCELENTE!</strong> Ligando no número antigo, você confirma se é mesmo seu filho antes de enviar dinheiro.';
  } else {
    feedback.className = 'simulador-feedback erro';
    feedback.innerHTML = '⚠️ <strong>GOLPE DETECTADO!</strong> Nunca envie dinheiro para números novos sem falar por ligação normal primeiro.';
  }
}
