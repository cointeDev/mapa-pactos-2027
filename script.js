// =========================================================================
// 1. CONFIGURAÇÃO DE CORES INSTITUCIONAIS E TIPOGRAFIA (TAILWIND CSS)
// =========================================================================
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        cointe: {
          950: "#081a33",
          900: "#0f294a",
          800: "#163b69",
          700: "#1d4ed8",
          600: "#0284c7",
          500: "#0ea5e9",
          100: "#e0f2fe",
          50: "#f0f9ff",
        },
      },
    },
  },
};

// Chave única usada para identificar os dados deste projeto no navegador
const STORAGE_KEY = "cointe_mapa_pactos_2027";

// =========================================================================
// 2. MODO APRESENTAÇÃO (PROJEÇÃO EM REUNIÕES)
// =========================================================================
function togglePresentationMode() {
  const body = document.body;
  const isPresenting = body.classList.toggle("presentation-mode");
  const btn = document.getElementById("btnPresentationMode");
  const label = document.getElementById("labelPresentation");

  if (isPresenting) {
    btn.className =
      "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-300 text-cointe-950 border border-amber-300 transition-all shadow-md cursor-pointer";
    label.textContent = "Sair do Modo Apresentação";
  } else {
    btn.className =
      "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all shadow-sm cursor-pointer";
    label.textContent = "Modo Apresentação";
  }
}

// =========================================================================
// 3. FILTRO INTERATIVO DA LINHA DO TEMPO POR NÚCLEO / RESPONSÁVEL
// =========================================================================
function filterRoadmap(owner) {
  document.querySelectorAll(".r-filter-btn").forEach((btn) => {
    if (btn.dataset.rfilter === owner) {
      btn.className =
        "r-filter-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-cointe-900 text-white shadow-xs cursor-pointer transition-all";
    } else {
      btn.className =
        "r-filter-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer transition-all";
    }
  });

  document.querySelectorAll(".roadmap-item").forEach((item) => {
    const owners = item.dataset.owners || "";
    if (owner === "todos" || owners.split(" ").includes(owner)) {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });
}

// =========================================================================
// 4. SALVAMENTO E CARREGAMENTO AUTOMÁTICO NO NAVEGADOR (LOCALSTORAGE)
// =========================================================================
function savePacts() {
  const checkboxes = document.querySelectorAll(".pact-checkbox");
  // Cria uma lista com true/false indicando quais caixas estão marcadas
  const states = Array.from(checkboxes).map((cb) => cb.checked);
  // Converte a lista em texto (JSON) e grava no navegador
  localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
}

function loadPacts() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    // Se não houver nada salvo ainda, encerra a função sem fazer nada
    if (!savedData) return;

    const states = JSON.parse(savedData);
    const checkboxes = document.querySelectorAll(".pact-checkbox");

    // Aplica o estado salvo (marcado/desmarcado) em cada checkbox correspondente
    checkboxes.forEach((cb, index) => {
      if (typeof states[index] === "boolean") {
        cb.checked = states[index];
      }
    });

    // Atualiza as cores dos cards, o contador e a barra de progresso
    updatePactCounter();
  } catch (err) {
    console.error("Erro ao recuperar os pactos salvos:", err);
  }
}

// =========================================================================
// 5. CHECKLIST INTERATIVO DOS PACTOS DE GOVERNANÇA (VALIDAÇÃO AO VIVO)
// =========================================================================
function updatePactCounter() {
  const checkboxes = document.querySelectorAll(".pact-checkbox");
  const total = checkboxes.length;
  let checkedCount = 0;

  checkboxes.forEach((cb) => {
    const parentLabel = cb.closest(".pact-item");
    if (cb.checked) {
      checkedCount++;
      parentLabel.classList.remove("border-slate-200", "bg-slate-50/50");
      parentLabel.classList.add("border-emerald-400", "bg-emerald-50/40");
    } else {
      parentLabel.classList.remove("border-emerald-400", "bg-emerald-50/40");
      parentLabel.classList.add("border-slate-200", "bg-slate-50/50");
    }
  });

  document.getElementById("pactCounterText").textContent =
    `${checkedCount} de ${total}`;
  document.getElementById("pactProgressBar").style.width =
    `${(checkedCount / total) * 100}%`;

  const banner = document.getElementById("pactSuccessBanner");
  if (checkedCount === total) {
    banner.classList.remove("hidden");
  } else {
    banner.classList.add("hidden");
  }

  // Salva o estado atual toda vez que houver uma mudança
  savePacts();
}

function resetPacts() {
  document.querySelectorAll(".pact-checkbox").forEach((cb) => {
    cb.checked = false;
  });
  localStorage.removeItem(STORAGE_KEY);
  updatePactCounter();
}

// =========================================================================
// 6. INICIALIZAÇÃO DOS ÍCONES E RESTAURAÇÃO DOS DADOS AO ABRIR A PÁGINA
// =========================================================================
window.onload = function () {
  try {
    if (window.lucide) {
      lucide.createIcons();
    }
    // Restaura automaticamente os pactos marcados anteriormente
    loadPacts();
  } catch (err) {
    console.error("Erro ao inicializar o painel:", err);
  }
};
