let modalKey = 0
// variavel para controlar a quantidade inicial de menus na modal
let quantmenus = 1
let cart = [] // carrinho


// funcoes auxiliares ou uteis
const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.menuWindowArea').style.opacity = 0 // transparente
    seleciona('.menuWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.menuWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.menuWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.menuWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    // BOTOES FECHAR MODAL
    selecionaTodos('.menuInfo--cancelButton, .menuInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDasmenus = (menuItem, item, index) => {
	menuItem.setAttribute('data-key', index)
    menuItem.querySelector('.menu-item--img img').src = item.img
    menuItem.querySelector('.menu-item--price').innerHTML = formatoReal(item.price[2])
    menuItem.querySelector('.menu-item--name').innerHTML = item.name
    menuItem.querySelector('.menu-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.menuBig img').src = item.img
    seleciona('.menuInfo h1').innerHTML = item.name
    seleciona('.menuInfo--desc').innerHTML = item.description
    seleciona('.menuInfo--actualPrice').innerHTML = formatoReal(item.price[2])
}


const pegarKey = (e) => {
    let key = e.target.closest('.menu-item').getAttribute('data-key')
    console.log('menu clicada ' + key)
    console.log(menuJson[key])

    // garantir que a quantidade inicial de menus é 1
    quantmenus = 1

    // Para manter a informação de qual menu foi clicada
    modalKey = key

    return key
}

const preencherTamanhos = (key) => {
    seleciona('.menuInfo--size.selected').classList.remove('selected')

    // selecionar todos os tamanhos
    selecionaTodos('.menuInfo--size').forEach((size, sizeIndex) => {
        (sizeIndex == 0) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = menuJson[key].sizes[sizeIndex]
    })
}

const escolherTamanhoPreco = (key) => {
    // Ações nos botões de tamanho
    // selecionar todos os tamanhos
    selecionaTodos('.menuInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            // clicou em um item, tirar a selecao dos outros e marca o q vc clicou
            seleciona('.menuInfo--size.selected').classList.remove('selected')
            size.classList.add('selected')

            // mudar o preço de acordo com o tamanho
            seleciona('.menuInfo--actualPrice').innerHTML = formatoReal(menuJson[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {
    // Ações nos botões + e - da janela modal
    seleciona('.menuInfo--qtmais').addEventListener('click', () => {
        quantmenus++
        seleciona('.menuInfo--qt').innerHTML = quantmenus
    })

    seleciona('.menuInfo--qtmenos').addEventListener('click', () => {
        if(quantmenus > 1) {
            quantmenus--
            seleciona('.menuInfo--qt').innerHTML = quantmenus	
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.menuInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

    
    	console.log("menu " + modalKey)
    	// tamanho
	    let size = seleciona('.menuInfo--size.selected').getAttribute('data-key');
	    console.log("Tamanho " + size)
	    // quantidade
    	console.log("Quant. " + quantmenus)
        // preco
        let price = seleciona('.menuInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
    
        
	    let identificador = menuJson[modalKey].id+'t'+size

        // para adicionarmos a quantidade
        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            // se encontrar aumente a quantidade
            cart[key].qt += quantmenus
        } else {
            // adicionar objeto menu no carrinho
            let menu = {
                identificador,
                id: menuJson[modalKey].id,
                size, // size: size
                qt: quantmenus,
                price: parseFloat(price) // price: price
            }
            cart.push(menu)
            console.log(menu)
            console.log('Sub total R$ ' + (menu.qt * menu.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
        // mostrar o carrinho
	    seleciona('aside').classList.add('show')
        seleciona('nav').style.display = 'flex' // mostrar barra superior
    }

    // exibir aside do carrinho no modo mobile
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    // fechar o carrinho com o botão X no modo mobile
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' 
        seleciona('nav').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    // exibir número de itens no carrinho
	seleciona('.menu-openner span').innerHTML = cart.length
	
	// mostrar ou nao o carrinho
	if(cart.length > 0) {

		// mostrar o carrinho
		seleciona('aside').classList.add('show')

		// zerar meu .cart para nao fazer insercoes duplicadas
		seleciona('.cart').innerHTML = ''

        // crie as variaveis antes do for
		let subtotal = 0
		let desconto = 0
		let total    = 0

        // para preencher os itens do carrinho, calcular subtotal
		for(let i in cart) {
			let menuItem = menuJson.find( (item) => item.id == cart[i].id )
			console.log(menuItem)

            // em cada item pegar o subtotal
        	subtotal += cart[i].price * cart[i].qt
            //console.log(cart[i].price)

			// fazer o clone, exibir na telas e depois preencher as informacoes
			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let menuSizeName = cart[i].size

			let menuName = `${menuItem.name} (${menuSizeName})`

			// preencher as informacoes
			cartItem.querySelector('img').src = menuItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = menuName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			// selecionar botoes + e -
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				// adicionar apenas a quantidade que esta neste contexto
				cart[i].qt++
				// atualizar a quantidade
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					// subtrair apenas a quantidade que esta neste contexto
					cart[i].qt--
				} else {
					// remover se for zero
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('nav').style.display = 'flex' : ''

				// atualizar a quantidade
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		}
		// calcule desconto 10% e total
		//desconto = subtotal * 0.1
		desconto = subtotal * 0
		total = subtotal - desconto

		// exibir na tela os resultados
		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		// ocultar o carrinho
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('nav').style.display = 'flex'
    })
}


 //lista de menus
menuJson.map((item, index ) => {
    let menuItem = document.querySelector('.models .menu-item').cloneNode(true)

    seleciona('.cardapio-area').append(menuItem)

    // preencher os dados de cada menu
    preencheDadosDasmenus(menuItem, item, index)
    
    // menu clicada
    menuItem.querySelector('.menu-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou na menu')

        
        let chave = pegarKey(e)
        

        // abrir janela modal
        abrirModal()

        // preenchimento dos dados
        preencheDadosModal(item)

        
        // pegar tamanho selecionado
        preencherTamanhos(chave)

		// definir quantidade inicial como 1
		seleciona('.menuInfo--qt').innerHTML = quantmenus

        // selecionar o tamanho e preco com o clique no botao
        escolherTamanhoPreco(chave)
        

    })

    botoesFechar()

}) 


// mudar quantidade com os botoes + e -
mudarQuantidade()

adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()




