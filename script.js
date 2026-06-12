// DOM Elements
const steps = document.querySelectorAll('.step');
const nextBtn = document.querySelector('.btn-next');
const prevBtn = document.querySelector('.btn-prev');
const calculateBtn = document.querySelector('.btn-calculate');
const form = document.getElementById('agroForm');
const relatorioContainer = document.getElementById('relatorioContainer');

let currentStep = 1;
const totalSteps = 2;

// Funções de validação
function validarArea(area) {
    const num = parseFloat(area);
    if (isNaN(num)) return 'Digite um número válido';
    if (num <= 0) return 'Área deve ser maior que zero';
    if (num > 10000) return 'Área máxima é 10.000 hectares';
    return null;
}

function validarHorasTrator(horas) {
    const num = parseInt(horas);
    if (isNaN(num)) return 'Digite um número válido';
    if (num < 0) return 'Horas não podem ser negativas';
    if (num > 500) return 'Máximo de 500 horas/mês';
    return null;
}

function validarIrrigacao(valor) {
    if (!valor) return 'Selecione um tipo de irrigação';
    return null;
}

function validarEnergia(energia) {
    const num = parseFloat(energia);
    if (isNaN(num)) return 'Digite um número válido';
    if (num < 0) return 'Consumo não pode ser negativo';
    if (num > 10000) return 'Consumo muito alto (máx 10.000 kWh)';
    return null;
}

function validarCombustivel(combustivel) {
    const num = parseFloat(combustivel);
    if (isNaN(num)) return 'Digite um número válido';
    if (num < 0) return 'Consumo não pode ser negativo';
    if (num > 5000) return 'Consumo muito alto (máx 5.000 litros)';
    return null;
}

function validarProducao(producao) {
    const num = parseFloat(producao);
    if (isNaN(num)) return 'Digite um número válido';
    if (num < 0) return 'Produção não pode ser negativa';
    return null;
}

// Validar etapa 1
function validarStep1() {
    const area = document.getElementById('area').value;
    const horasTrator = document.getElementById('horasTrator').value;
    const tipoIrrigacao = document.getElementById('tipoIrrigacao').value;
    
    const errorArea = document.getElementById('error-area');
    const errorHoras = document.getElementById('error-horasTrator');
    const errorIrrigacao = document.getElementById('error-irrigacao');
    
    const erroArea = validarArea(area);
    const erroHoras = validarHorasTrator(horasTrator);
    const erroIrrigacao = validarIrrigacao(tipoIrrigacao);
    
    errorArea.textContent = erroArea || '';
    errorHoras.textContent = erroHoras || '';
    errorIrrigacao.textContent = erroIrrigacao || '';
    
    return !erroArea && !erroHoras && !erroIrrigacao;
}

// Validar etapa 2
function validarStep2() {
    const energia = document.getElementById('energia').value;
    const combustivel = document.getElementById('combustivel').value;
    const producao = document.getElementById('producao').value;
    
    const errorEnergia = document.getElementById('error-energia');
    const errorCombustivel = document.getElementById('error-combustivel');
    const errorProducao = document.getElementById('error-producao');
    
    const erroEnergia = validarEnergia(energia);
    const erroCombustivel = validarCombustivel(combustivel);
    const erroProducao = validarProducao(producao);
    
    errorEnergia.textContent = erroEnergia || '';
    errorCombustivel.textContent = erroCombustivel || '';
    errorProducao.textContent = erroProducao || '';
    
    return !erroEnergia && !erroCombustivel && !erroProducao;
}

// Navegação entre etapas com transição suave
function showStep(step) {
    steps.forEach((stepElement, index) => {
        if (index + 1 === step) {
            stepElement.classList.add('active');
        } else {
            stepElement.classList.remove('active');
        }
    });
    currentStep = step;
}

// Próxima etapa
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (validarStep1()) {
            showStep(2);
        }
    });
}

// Etapa anterior
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        showStep(1);
    });
}

// Gerar relatório
function gerarRelatorio(dados) {
    // Cálculos de pegada
    const pegadaCarbonoTrator = dados.horasTrator * 2.7;
    const pegadaCarbonoCombustivel = dados.combustivel * 2.5;
    const pegadaCarbonoEnergia = dados.energia * 0.084;
    
    let pegadaHidrica = 0;
    switch(dados.tipoIrrigacao) {
        case 'aspersao':
            pegadaHidrica = dados.area * 4500;
            break;
        case 'gotejamento':
            pegadaHidrica = dados.area * 2500;
            break;
        case 'sulco':
            pegadaHidrica = dados.area * 6000;
            break;
        default:
            pegadaHidrica = dados.area * 1000;
    }
    
    const pegadaCarbonoTotal = pegadaCarbonoTrator + pegadaCarbonoCombustivel + pegadaCarbonoEnergia;
    const eficiencia = dados.producao / (pegadaCarbonoTotal + 0.01);
    
    // Gerar conselhos práticos
    let conselhos = [];
    if (pegadaCarbonoTrator > 200) {
        conselhos.push('🚜 Reduza o uso do trator em marcha lenta e faça manutenção regular.');
    }
    if (pegadaCarbonoEnergia > 100) {
        conselhos.push('💡 Instale painéis solares ou troque motores elétricos por modelos mais eficientes.');
    }
    if (pegadaHidrica > 50000 && dados.tipoIrrigacao === 'aspersao') {
        conselhos.push('💧 Considere migrar para irrigação por gotejamento, que economiza até 40% de água.');
    }
    if (eficiencia < 5) {
        conselhos.push('📈 Aumente a eficiência da sua produção com planejamento e tecnologia.');
    }
    if (conselhos.length === 0) {
        conselhos.push('🌿 Parabéns! Sua propriedade está no caminho certo para a sustentabilidade.');
    }
    
    return `
        <div class="relatorio">
            <h3>📋 Relatório AgroPegada</h3>
            
            <p><strong>🌾 Área cultivada:</strong> ${dados.area} hectares</p>
            <p><strong>🚜 Horas de trator/mês:</strong> ${dados.horasTrator} h</p>
            <p><strong>💧 Tipo de irrigação:</strong> ${dados.tipoIrrigacao === 'aspersao' ? 'Aspersão' : dados.tipoIrrigacao === 'gotejamento' ? 'Gotejamento' : dados.tipoIrrigacao === 'sulco' ? 'Sulco' : 'Nenhuma'}</p>
            <p><strong>⚡ Consumo energia:</strong> ${dados.energia} kWh/mês</p>
            <p><strong>⛽ Consumo combustível:</strong> ${dados.combustivel} L/mês</p>
            <p><strong>📦 Produção:</strong> ${dados.producao} kg/mês</p>
            
            <hr style="margin: 15px 0; border-color: #c8e6c9;">
            
            <p><span class="valor-destaque">🌍 Pegada de Carbono Total:</span> ${pegadaCarbonoTotal.toFixed(2)} kg CO₂/mês</p>
            <p><span class="valor-destaque">💧 Pegada Hídrica Estimada:</span> ${pegadaHidrica.toFixed(0)} litros/mês</p>
            <p><span class="valor-destaque">📊 Eficiência Produtiva:</span> ${eficiencia.toFixed(2)} kg/kg CO₂</p>
            
            <div class="dica">
                <strong>💡 Conselhos de Ecoeficiência:</strong><br>
                ${conselhos.map(c => `• ${c}`).join('<br>• ')}
            </div>
            
            <p style="margin-top: 15px; font-size: 0.9rem; color: #666;">
                <em>🌱 Pequenas mudanças geram grandes impactos para o planeta!</em>
            </p>
        </div>
        <button type="button" id="btnNovo" class="btn-novo">➕ Nova Consulta</button>
    `;
}

// Calcular e mostrar relatório
function calcularImpacto() {
    if (!validarStep2()) {
        return;
    }
    
    const dados = {
        area: parseFloat(document.getElementById('area').value),
        horasTrator: parseFloat(document.getElementById('horasTrator').value),
        tipoIrrigacao: document.getElementById('tipoIrrigacao').value,
        energia: parseFloat(document.getElementById('energia').value),
        combustivel: parseFloat(document.getElementById('combustivel').value),
        producao: parseFloat(document.getElementById('producao').value)
    };
    
    // Esconder o formulário
    form.style.display = 'none';
    
    // Mostrar e preencher o relatório
    relatorioContainer.innerHTML = gerarRelatorio(dados);
    relatorioContainer.style.display = 'block';
    
    // Adicionar evento ao botão de nova consulta
    document.getElementById('btnNovo').addEventListener('click', () => {
        form.reset();
        form.style.display = 'block';
        relatorioContainer.style.display = 'none';
        showStep(1);
        
        // Limpar mensagens de erro
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    });
}

if (calculateBtn) {
    calculateBtn.addEventListener('click', calcularImpacto);
}

// Permitir Enter nos campos
document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentStep === 1 && nextBtn) {
                nextBtn.click();
            } else if (currentStep === 2 && calculateBtn) {
                calculateBtn.click();
            }
        }
    });
});