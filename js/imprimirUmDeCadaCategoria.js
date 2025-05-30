import { adicionarProdutoAoLocalStorage } from "./adicionarProdutoAoLocalStorage.js";

function adicionarProduto(camiseta) {
  adicionarProdutoAoLocalStorage({
    nome: camiseta.nome,
    preco: camiseta.preco,
    descricao: camiseta.descricao,
    imagens: camiseta.imagens,
  });
}

function atualizarIconeFavorito(botao, favoritar) {
  if (favoritar) {
    botao.innerHTML = "<i class='bi bi-heart-fill'></i>";
  } else {
    botao.innerHTML = "<i class='bi bi-heart'></i>";
  }
}

function verificarItemNoCarrinho(produto) {
  const sacola = JSON.parse(localStorage.getItem("sacola") || []);

  const nomesDosItensNaSacola = sacola.map((item) => item.nome);

  return nomesDosItensNaSacola.includes(produto.nome);
}

export function imprimirUmDeCadaCategoria(produtos) {
  const row = document.querySelector("#produtos");

  for (const categoria in produtos.produtos) {
    if (produtos.produtos.hasOwnProperty(categoria)) {
      const produto = produtos.produtos[categoria][0];

      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-xxl-4 pb-4";
      row.appendChild(col);

      const card = document.createElement("div");
      card.className = "card";
      col.appendChild(card);

      const images = `
        <img class="d-block d-md-none" src="${produto.imagens.mobile}" alt="${produto.nome}">
        <img class="d-none d-md-block d-xl-none" src="${produto.imagens.tablet}" alt="${produto.nome}">
        <img class="d-none d-xl-block" src="${produto.imagens.desktop}" alt="${produto.nome}">
      `;

      const cardBody = `
        <div class="card-body">
          <h5 class="card-title fw-bold">${produto.nome}</h5>
          <p class="card-text">${produto.descricao}</p>
          <p class="fw-bold">${produto.preco}</p>
          <button type="button" class="btn btn-primary botao-lilas rounded-0 border-0" data-bs-toggle="modal" data-bs-target="#modal${categoria}">Ver mais</button>
        </div>
      `;

      card.innerHTML = images + cardBody;

      const modalContent = `
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-header-icon">
              <img src="assets/check-circle.svg">
              <h1 class="modal-title fs-5" id="modalLabel${categoria}">Confira detalhes sobre o produto</h1>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <img class="modal-imagem" src="${produto.imagens.desktop}" alt="${
        produto.nome
      }">
            <div>
            <div id="mensagem-carrinho-${produto.nome.replace(
              /\s+/g,
              "-"
            )}"></div>
              <h3>${produto.nome}</h3>
              <p class="modal-description">${produto.descricao}</p>

              <hr class="divider-principal">

              <p class="modal-price">${produto.preco}</p>
              <p class="modal-seller">Vendido e entregue por Riachuelo</p>

              <hr class="divider-secondary">
              <p><b>Cores</b></p>
              <form>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                  <label class="form-check-label" for="flexRadioDefault1">
                    Amarelo
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2">
                  <label class="form-check-label" for="flexRadioDefault2">
                    Offwhite
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3">
                  <label class="form-check-label" for="flexRadioDefault3">
                    Preto
                  </label>
                </div>
              </form>

              <hr class="divider-secondary">

              <p><b>Tamanho</b></p>
              <form>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="flexRadio" id="flexRadio1">
                  <label class="form-check-label" for="flexRadio1">
                    P
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="flexRadio" id="flexRadio2">
                  <label class="form-check-label" for="flexRadio2">
                    M
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="flexRadio" id="flexRadio3">
                  <label class="form-check-label" for="flexRadio3">
                    G
                  </label>
                </div>
              </form>
            </div>
          </div>
    <div class="modal-footer">
            <button type="button" class="btn botao-lilas" id="adicionar-btn-${produto.nome.replace(
              /\s+/g,
              "-"
            )}">Adicionar à sacola</button>
           <button type="button" class="botao-favorito" id="favoritar-btn-${produto.nome.replace(
             /\s+/g,
             "-"
           )}">
              <i class="bi bi-heart"></i>
           </button>
            </div>
        </div>
      `;

      const modal = `
        <div class="modal fade" id="modal${categoria}" tabindex="-1" aria-labelledby="modalLabel${categoria}" aria-hidden="true">
          <div class="modal-dialog">
            ${modalContent}
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", modal);

      const botao = document.querySelector(
        `#adicionar-btn-${produto.nome.replace(/\s+/g, "-")}`
      );
      botao.addEventListener("click", () => adicionarProduto(produto));

      const botaoFavorito = document.querySelector(
        `#favoritar-btn-${produto.nome.replace(/\s+/g, "-")}`
      );
      botaoFavorito.addEventListener("click", function () {
        const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        const index = favoritos.indexOf(produto.nome);

        if (index !== -1) {
          favoritos.splice(index, 1);
        } else {
          favoritos.push(produto.nome);
        }

        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        atualizarIconeFavorito(this, index === -1);
      });

      const mensagemDeAviso = document.querySelector(
        `#mensagem-carrinho-${produto.nome.replace(/\s+/g, "-")}`
      );

      if (verificarItemNoCarrinho(produto)) {
        mensagemDeAviso.innerHTML =
          "<div class='alert alert-warning' role='alert'> Este item já está no seu carrinho! </div>";
      }
    }
  }

  // Adicionando o container ao corpo da página
  row.appendChild(card);
}
