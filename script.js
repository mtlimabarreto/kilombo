// >>> TROQUE AQUI pelo seu número, com 55 + DDD + número, só dígitos. Ex.: 5574999999999
var WHATSAPP = "5574000000000";
document.getElementById("wa-link").href = "https://wa.me/" + WHATSAPP;

/* Modo dia / noite: respeita a escolha salva; sem escolha, segue o aparelho */
(function () {
  var root = document.documentElement, btn = document.getElementById("tema");
  function atual() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function aplicar(t) {
    root.setAttribute("data-theme", t);
    btn.textContent = t === "dark" ? "☀ Dia" : "☾ Noite";
  }
  var salvo = null;
  try { salvo = localStorage.getItem("kt-tema"); } catch (e) {}
  aplicar(salvo === "dark" || salvo === "light" ? salvo : atual());
  btn.addEventListener("click", function () {
    var novo = atual() === "dark" ? "light" : "dark";
    aplicar(novo);
    try { localStorage.setItem("kt-tema", novo); } catch (e) {}
  });
})();

/* Blocos de pixel (estilo Pixel Grid): padrão fixo, mais denso perto do canto */
function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }
document.querySelectorAll(".px").forEach(function (el) {
  var cols = +el.dataset.cols, rows = +el.dataset.rows, r = rng(+el.dataset.seed * 977), corner = el.dataset.corner;
  el.style.setProperty("--c", el.dataset.c);
  el.style.gridTemplateColumns = "repeat(" + cols + ",1fr)";
  el.style.gridTemplateRows = "repeat(" + rows + ",1fr)";
  var html = "";
  for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
    var dx = (corner.indexOf("l") > -1 ? x : cols - 1 - x) / cols;
    var dy = (corner.indexOf("t") > -1 ? y : rows - 1 - y) / rows;
    var p = Math.max(0, 0.92 - ((dx + dy) / 2) * 1.9);
    html += '<i class="' + (r() < p ? "on" : "") + '"></i>';
  }
  el.innerHTML = html;
});

/* Formulário por perfil (aluno / professor / associação) */
var PAPEIS = {
  aluno: "aluno(a)",
  professor: "professor(a)",
  parceiro: "representante de associação/parceiro(a)"
};
var form = document.getElementById("f");
var campos = document.getElementById("campos");

function show(id, bad) { document.getElementById(id).style.display = bad ? "block" : "none"; }
function papelAtual() {
  var c = document.querySelector('input[name="papel"]:checked');
  return c ? c.value : "";
}

document.querySelectorAll('input[name="papel"]').forEach(function (r) {
  r.addEventListener("change", function () {
    var p = papelAtual();
    show("e-papel", false);
    campos.hidden = !p;
    document.querySelectorAll(".panel").forEach(function (pn) {
      pn.hidden = pn.getAttribute("data-role") !== p;
    });
  });
});

form.addEventListener("submit", function (ev) {
  ev.preventDefault();
  var papel = papelAtual();
  var nome = document.getElementById("nome").value.trim();
  show("e-papel", !papel);
  show("e-nome", !!papel && !nome);
  if (!papel || !nome) return;

  var painel = document.querySelector('.panel[data-role="' + papel + '"]');
  var linhas = [
    "Olá! Vim pela página do Kilombo Tech e sou " + PAPEIS[papel] + ".",
    "",
    "Nome: " + nome
  ];
  painel.querySelectorAll("[data-label]").forEach(function (el) {
    var v;
    if (el.classList.contains("checks")) {
      v = Array.prototype.slice.call(el.querySelectorAll("input:checked"))
        .map(function (i) { return i.value; }).join("; ");
    } else {
      v = el.value.trim();
    }
    if (v) linhas.push(el.getAttribute("data-label") + ": " + v);
  });

  window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(linhas.join("\n")), "_blank", "noopener");
});