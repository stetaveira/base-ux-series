let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector("header input");
let dados = [];

async function iniciarBusca() {
    // Se os dados ainda não foram carregados, busca do JSON.
    if (dados.length === 0) {
        try {
            let resposta = await fetch("./data/datafilmes.json");
            dados = await resposta.json();
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
            // Mensagem de erro ao carregar o JSON
            cardContainer.innerHTML = "<p>❌ Erro ao carregar o glossário. Tente recarregar a página.</p>";
            return; // Interrompe a execução se houver erro
        }
    }

    const termoBusca = campoBusca.value.toLowerCase();
    const dadosFiltrados = dados.filter(dado => 
        dado.nome.toLowerCase().includes(termoBusca) || 
        dado.descricao.toLowerCase().includes(termoBusca) ||
        dado.tags.some(tag => tag.toLowerCase().includes(termoBusca)) // Opcional: Busca nas tags
    );

    renderizarCards(dadosFiltrados, termoBusca); // Passamos o termo de busca
}

function renderizarCards(dados, termoBusca) {
    cardContainer.innerHTML = ""; // Limpa o container

    // 1. Lógica para NENHUM RESULTADO
    if (dados.length === 0) {
        let mensagem = document.createElement("div");
        mensagem.classList.add("mensagem-erro"); // Adicione uma classe para estilizar no CSS
        mensagem.innerHTML = `
            <h2>Termo não encontrado 🧐</h2>
            <p>Não encontramos nenhum termo relacionado a "<strong>${termoBusca}</strong>".</p>
            <p>Tente refinar sua busca com palavras-chave diferentes.</p>
        `;
        cardContainer.appendChild(mensagem);
        return; // Interrompe a função
    }

    // 2. Lógica para RENDERIZAR CARDS (se houver resultados)
    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        
        // Renderiza as tags
        const tagsHtml = dado.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        article.innerHTML = `
            <h2>${dado.nome}</h2>
            <div class="meta-data">
                <span>Criado em: ${dado.data_criacao}</span>
            </div>
            <p>${dado.descricao}</p>
            <div class="card-tags">${tagsHtml}</div>
            <a href="${dado.link_oficial}" target="_blank">Saiba mais</a>
        `;
        cardContainer.appendChild(article);
    }
}
