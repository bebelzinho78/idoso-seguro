let acertosQuizzes = {
  whatsapp: false,
  pix: false,
  banco: false,
  compras: false
};

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
      acertosQuizzes = JSON.parse(progressoSalvo);
    } catch (e) {
      console.error('Erro ao ler progresso:', e);
    }
  }

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
function responderQuiz(golpeKey, opcaoIndex, ehCorreta) {
  const quizCard = document.getElementById(`quiz-${golpeKey}`);
  const resultado = document.getElementById(`resultado-${golpeKey}`);
  if (!quizCard || !resultado) return;

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
  const total = 4;
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

// MITO OU VERDADE
function revelarMito(elemento) {
  elemento.classList.toggle('ativo');
}

// GERAR CERTIFICADO
function gerarCertificado() {
  const nomeInput = document.getElementById('nomeAluno');
  const nome = nomeInput ? nomeInput.value.trim() : '';
  
  if (!nome) {
    alert('Por favor, digite seu nome completo para gerar o certificado.');
    return;
  }

  const certNomeUsuario = document.getElementById('certNomeUsuario');
  const certData = document.getElementById('certData');
  const areaCertificado = document.getElementById('areaCertificadoModal');

  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-BR');

  if (certNomeUsuario) certNomeUsuario.textContent = nome;
  if (certData) certData.textContent = `Data: ${dataFormatada}`;
  if (areaCertificado) areaCertificado.style.display = 'block';
}

// MODAL DE EMERGÊNCIA
function abrirModalEmergencia() {
  const modal = document.getElementById('modalEmergencia');
  if (modal) modal.style.display = 'flex';
}

function fecharModalEmergencia() {
  const modal = document.getElementById('modalEmergencia');
  if (modal) modal.style.display = 'none';
}

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
