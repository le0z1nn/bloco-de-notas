const novaNota = document.getElementById("nova-nota");
const adicionarNota = document.getElementById("adicionar-nota");
const limparNotas = document.getElementById("limpar-notas");
const notasSalvas = document.getElementById("notas-salvas");

// Verifica se há alguma nota no armazenamento local
if (localStorage.getItem("notas")) {
    // Recupera o valor do item "notas" do localStorage e converte de volta para JS usando JSON.parse()
    const notas = JSON.parse(localStorage.getItem("notas"));

    // Percorre cada nota usando loop e usa a função criarNota()
    notas.forEach(function (nota, index) {
        criarNota(nota.texto, index, nota.cor);
    });
}

// Adiciona nova nota
adicionarNota.addEventListener("click", function () {
    // Pega texto do textarea, salvando em textoNota sem espaços no início e final
    const textoNota = novaNota.value.trim();

    if (textoNota !== '') {
        criarNota(textoNota);
        salvarNota();
        novaNota.value = '';
    }
});

// Apaga todas as notas
limparNotas.addEventListener("click", function () {
    notasSalvas.innerHTML = '';
    localStorage.removeItem('notas');
});

// Função para criar nova nota
function criarNota(texto, index, cor, corTexto) {
    const div = document.createElement("div");

    const p = document.createElement("p");
    const botaoEditar = document.createElement("button");
    const botaoExcluir = document.createElement("button");

    const inputCor = document.createElement("input");
    inputCor.type = "color";

    const inputCorTexto = document.createElement("input");
    inputCorTexto.type = "color";

    p.textContent = texto;
    botaoEditar.textContent = "Editar";
    botaoExcluir.textContent = "Excluir";

    div.appendChild(p);
    div.appendChild(botaoEditar);
    div.appendChild(botaoExcluir);
    div.appendChild(inputCor);
    div.appendChild(inputCorTexto);

    div.className = "nota";

    // Verifica se o índice é indefinido
    if (index !== undefined) {
        inputCor.value = cor;
        inputCorTexto.value = corTexto;
        div.style.backgroundColor = cor;
        p.style.color = corTexto;
    }

    notasSalvas.appendChild(div);

    // Função para excluir nota
    botaoExcluir.addEventListener("click", function () {
        if (confirm("Tem certeza que deseja excluir esta nota?")) {
            div.remove();
            salvarNota();
        }
    });

    // Função para editar nota
    botaoEditar.addEventListener("click", function () {
        editarNota(p, div, inputCor, inputCorTexto);
    });

    // Detect mudança de cor test verigor de fundo
    inputCor.addEventListener("input", function () {
        div.style.backgroundColor = inputCor.value;
        salvarNota();
    });

    // Detect mudança de cor do texto
    inputCorTexto.addEventListener("input", function () {
        p.style.color = inputCorTexto.value;
        salvarNota();
    });

    function editarNota(p, div, inputCor, inputCorTexto) {
        const textareaEdicao = document.createElement("textarea");
        textareaEdicao.value = p.textContent;
        div.replaceChild(textareaEdicao, p);

        const botaoSalvar = document.createElement("button");
        botaoSalvar.textContent = "Salvar";
        div.appendChild(botaoSalvar);

        botaoSalvar.addEventListener("click", function() {
            p.textContent = textareaEdicao.value;
            div.replaceChild(p, textareaEdicao);
            div.removeChild(botaoSalvar);
            div.style.backgroundColor = inputCor.value;
            p.style.color = inputCorTexto.value;
            salvarNota();
        });
    }
}

// Função para salvar notas no armazenamento local
function salvarNota() {
    const notas = [];
    const divsNotas = notasSalvas.querySelectorAll(".nota");

    divsNotas.forEach(function (div) {
        const p = div.querySelector('p');
        const inputCor = div.querySelector("input");
        notas.push({
            texto: p.textContent,
            cor: inputCor.value
        });
    });

    // JSON.stringify converte o array de notas em uma string JSON
    localStorage.setItem("notas", JSON.stringify(notas));
}