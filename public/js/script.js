var produto = {
    url: "http://localhost:3000/product/",
    id: "http://localhost:3000/product/?id=",
    nome: "http://localhost:3000/product/?nome="
}
var mensagens = {
    cadastrarProduto: 'Cadastrar produto:',
    atualizarProduto: 'Atualizar produto:',
    cabecarioTabelaCompleta: '<table><tr><th>Código</th><th>Produto</th><th>Valor unitário</th><th>Status</th><th>Estoque</th><th>Valor em estoque</th><th>Editar</th><th>Excluir</th></tr>',
    cabecarioTabelaIndividual: '<table><tr><th>Código</th><th>Produto</th><th>Valor</th><th>Status</th><th>Estoque</th></tr>',
    optionNull: 'Escolha um produto...',
    invalido: 'Produto não encontrado'
}
var regex = {
    numeros: /[^0-9]+/g,
    letras: /[^a-zA-Záàâãéèêíïóôõöúçñ ]+/g
}

var validacao = regex.numeros;

//Efeitos de abertura da página.
function efeitoAbertura(){
    $('header').slideDown('slow', function(){
        $('header>h1').fadeIn('slow');
        $('section').fadeIn('slow', function(){
            preparaTabelaCompleta();
        });
    });
    $('footer').slideDown('slow');
}

//Efeito de abertura da tabela e omissão de itens
function preparaTabelaCompleta(){
    $('table').fadeOut('slow');
    $('#itens').hide();
    $('#pesquisa').hide();
    $('table').fadeIn('slow');
    $('#resultado').show();
    $('#procurar').hide();
    $('#produtoIndisponivel').hide();
    tabelaCompleta();
}

//Requisição de todos os ítens para à tabela
function tabelaCompleta(){
    $.getJSON(produto.url, function(lst){
        var x;
        var totalProdutos=0;
        var valorTotal=0;
        var valorUnidades=0;
        var arrOut = mensagens.cabecarioTabelaCompleta;
        for (x=0; x < lst.length; x++){
            var classe = '';
            var status = lst[x].status;
            var valorTotalDoProduto=0;
            if(status=='A'){
                classe='ativo';
            }else{
                classe='inativo';
            }
            arrOut +='<tr data-id="'+lst[x].id+'"><td><span class="'+classe+'">'+lst[x].id+'</span></td>';
            arrOut +='<td><span class="'+classe+'">'+lst[x].nome+'</span></td>';
            arrOut +='<td><span class="'+classe+'">R$ '+lst[x].valor+'</span></td>';
            arrOut +='<td><span class="'+classe+'">'+lst[x].status+'</span></td>';
            totalProdutos = totalProdutos + lst[x].estoque;
            valorTotalDoProduto = lst[x].valor * lst[x].estoque;
            valorTotal = valorTotal + valorTotalDoProduto;
            valorUnidades = valorUnidades + lst[x].valor;
            arrOut +='<td><span class="'+classe+'">'+lst[x].estoque+'</span></td>';
            arrOut +='<td><span class="'+classe+'">R$' + valorTotalDoProduto + '</span></td>';
            arrOut +='<td><img src="img/edit.png" class="editar"></img></td>';
            arrOut +='<td><img src="img/remove.png" class="excluir"></img></td></tr>';
        }
        arrOut +='<th>Total </th><th></th><th> R$' +valorUnidades +'</th><th></th><th>' +totalProdutos +'</th><th> R$' +valorTotal+ '</th><th></th><th></th></table>';
        $('#resultado').html(arrOut);
    });
}

//Popular select
function preencheSelect(){
    $('#itens').show();
    $('#pesquisa').show();
    limparConteudo();
}

//Busca itens conforme onchange do select
function buscarItem(url){
    $.getJSON(url, function(result){
        if(result == '') avisoProduto();
        else {
            var arrOut = '';
            arrOut += mensagens.cabecarioTabelaIndividual;
            arrOut +='<tr><td>'+result[0].id+'</td>';
            arrOut +='<td>'+result[0].nome+'</td>';
            arrOut +='<td>R$ '+result[0].valor+'</td>';
            arrOut +='<td>'+result[0].status+'</td>';
            arrOut +='<td>'+result[0].estoque+'</td></tr>';
            $('#resultado').html(arrOut);
        }
    })
    .fail(function() {
        avisoProduto();
    })
}

//Verifica o value do select equivalente ao código do produto no banco
//Se inválido ou menor que 1 limpa o conteúdo do #resultado
function buscar(indice){
    var codigo = indice;
    if(isNaN(indice)){
        buscarItem(produto.nome+codigo);
    }else{
        if(codigo>0){
            buscarItem(produto.id+codigo);
        }else{
            limparConteudo();
            avisoProduto();
        }
    }
    $('#pesquisa').val('');
}

function filtro(opcao){
    if(opcao === 'id'){
        validacao = regex.numeros;
        $('#pesquisa').prop('placeholder', 'Digite apenas números');
        limparConteudo();
        mostraPesquisa();
    }else if(opcao === 'nome'){
        validacao = regex.letras;
        $('#pesquisa').prop('placeholder', 'Digite apenas letras');
        limparConteudo();
        mostraPesquisa();
    }else if(opcao === 'A'){
        lstAtivoInativo(true);
    }else if(opcao === 'I'){
        lstAtivoInativo(false);
    }
}

function mostraPesquisa(){
    $('#pesquisa').show();
    $('#procurar').show();
}

function lstAtivoInativo(status){
    $.getJSON(produto.url, function(result){
        $('#pesquisa').hide();
        $('#procurar').hide();
        limparConteudo();
        var arrOut='';
        if (status === true){
            arrOut += completaAtivoInativo('A', result);
        }else {
            arrOut += completaAtivoInativo('I', result);
        }
        $('#resultado').append(arrOut);
    });
}

function completaAtivoInativo(status, result){
    var x;
    var totalProdutos=0;
    var valorTotal=0;
    var valorUnidades=0;
    var arrOut = mensagens.cabecarioTabelaCompleta;
    for (x=0; x < result.length; x++){
        if(result[x].status===status){
            var classe = '';
            var status = result[x].status;
            var valorTotalDoProduto=0;
            arrOut +='<tr data-id="'+result[x].id+'"><td>'+result[x].id+'</td>';
            arrOut +='<td>'+result[x].nome+'</td>';
            arrOut +='<td>R$ '+result[x].valor+'</td>';
            arrOut +='<td>'+result[x].status+'</td>';
            totalProdutos = totalProdutos + result[x].estoque;
            valorTotalDoProduto = result[x].valor * result[x].estoque;
            valorTotal = valorTotal + valorTotalDoProduto;
            valorUnidades = valorUnidades + result[x].valor;
            arrOut +='<td>'+result[x].estoque+'</td>';
            arrOut +='<td>R$' + valorTotalDoProduto + '</td>';
            arrOut +='<td><img src="img/edit.png" class="editar"></img></td>';
            arrOut +='<td><img src="img/remove.png" class="excluir"></img></td></tr>';
        }
    }
    arrOut +='<th>Total </th><th></th><th> R$' +valorUnidades +'</th><th></th><th>' +totalProdutos +'</th><th> R$' +valorTotal+ '</th><th></th><th></th></table>';
    return arrOut;
}

//Limpa a div onde é apresentado o resultado das requisições
function limparConteudo(){
    $('#resultado').html('');
}

//Limpa os campos dos formulários após POST(Inserção de itens)
function limparCamposForm(){
    $('#nome').val('');
    $('#valor').val('');
    $('#status').val('A');
    $('#estoque').val('');
}

//Exibe aviso antes de excluir item
function exibirAviso(){
    $('#background').fadeIn('fast', function(){
        $('#aviso').fadeIn('fast');
    });
}

//Exibe aviso quando produto não encontrado
function avisoProduto(){
    $('#background').fadeIn('fast', function(){
        $('#produtoIndisponivel').fadeIn('fast');
    });
}


//Exibe os formulários para edição ou adição de itens
function exibirForm(){
    $('#background').fadeIn('fast', function(){
        $('#caixaMensagem').fadeIn('fast', function(){
            $("input:text:eq(0):visible").focus();
        });
    });
}

//Esconde o formulário após edição ou adição de itens
function esconderForm(){
    $('#background').fadeOut('slow');
    $('#caixaMensagem').fadeOut('fast', function(){
        $('#formCadastrar').hide();
        $('#formEditar').hide();
    });
    $('#aviso').fadeOut('fast');
}

//Esconde caixa de aviso de produto não encontrado
function esconderAviso(){
    $('#background').fadeOut('slow');
    $('#produtoIndisponivel').fadeOut('fast');
}

function mensagemDeErro(){
    $('#msgError').fadeIn('fast', function(){
        setTimeout(function(){
            $('#msgError').fadeOut('slow');
        },2500);
    });
}

//Requisição para adicionar item
function adicionarItem(){
    var nome = $('#nome').val();
    var valor = $('#valor').val();
    var status = $('#status').val();
    var estoque = $('#estoque').val();
    if(nome!==""&&valor!==''&&estoque!=='' && nome.length>2){
        $.ajax({
            type: "POST",
            url: produto.url,
            data:{
                nome: nome,
                valor: valor,
                status: status,
                estoque: estoque
            }
        });
        tabelaCompleta();
        esconderForm();
        limparCamposForm();
    }else{
        mensagemDeErro();
    }
}

//Busca um item e joga os valores nos campos para edição
function buscarAtualizarItem(){
    var id = $('#caixaMensagem').data('update');
    $.ajax({
        type: "GET",
        url: produto.url+id,
        success: function(retorno){
            $('#nome').val(retorno.nome);
            $('#valor').val(retorno.valor);
            $('#status').val(retorno.status);
            $('#estoque').val(retorno.estoque);
        }
    });
}

//Update das modificações
function atualizarItem(){
    var id = $('#caixaMensagem').data('update');
    var nome = $('#nome').val();
    var valor = $('#valor').val();
    var status = $('#status').val();
    var estoque = $('#estoque').val();
    if(nome!==""&&valor!==''&&estoque!=='' && nome.length>2){
        $.ajax({
            type: "PUT",
            url: produto.url+id,
            data:{
                nome: nome,
                valor: valor,
                status: status,
                estoque: estoque
            }
        });
        tabelaCompleta();
        esconderForm();
    }else{
        mensagemDeErro();
    }
}

//Excluir um item selecionado
function excluirItem(){
    var id = $('#aviso').data('item');
    $.ajax({
        type: "DELETE",
        url: produto.url+id,
    });
    tabelaCompleta();
    esconderForm();
}

//Permite apenas número nos campos com keypress
function apenasNumero(e) {
    if(e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)){
        return false;
    }
}

//Verifica o caracter digitado e apaga caso seja inválido
function verificaCaracter( texto, emBranco, campo ){
    return campo.replace( texto, emBranco );
}

//Carrega todos os eventos e funções na página
$(document).ready(function(){
    efeitoAbertura();

    if($('#lstCompleta').is(':checked')){
        preparaTabelaCompleta();
    }

    $('#lstCompleta').click(function(){
        $('#addItem').show();
        preparaTabelaCompleta();
    });

    $('#lstProduto').click(function(){
        $('#addItem').hide();
        preencheSelect();
        $('#procurar').show();
    });

    $('#itens').change(function(){
        var indice = $('#itens').val();
        filtro(indice);
    });

    $('#procurar').click(function(){
        var indice = $('#pesquisa').val();
        buscar(indice);
    });

    $('#addItem').click(function(){
        $('#formCadastrar').show();
        $('#title').html('').append(mensagens.cadastrarProduto);
        exibirForm();
    });

    $('#cadastrar').click(function(){
        adicionarItem();
    });

    $('#editar').click(function(){
        atualizarItem();
    });

    $('#resultado').on('click', '.editar', function(){
        var id = $(this).closest('tr').data('id');
        $('#caixaMensagem').data('update', id);
        $('#title').html('').append(mensagens.atualizarProduto);
        $('#formEditar').show();
        buscarAtualizarItem();
        exibirForm();
    });

    $('#resultado').on('click', '.excluir', function(){
        var id = $(this).closest('tr').data('id');
        $('#aviso').data('item', id);
        exibirAviso();
    });

    $('#sexcluir').click(function(){
        excluirItem();
    });

    $('#nexcluir').click(function(){
        esconderForm();
    });

    $('#confirmacao').click(function(){
        esconderAviso();
    });

    $('#background').click(function(){
        esconderForm();
        limparCamposForm();
    });

    $('#cancelar').click(function(){
        esconderForm();
    });

    $("#nome").keyup(function(){
        var letras = $(this);
        letras.val(verificaCaracter(regex.letras,'', letras.val()));
    });

    $("#valor").maskMoney({showSymbol:true, symbol:"", decimal:".", thousands:","});
    
    $("#pesquisa").keyup(function(){
        var numero = $(this);
        numero.val(verificaCaracter(validacao,'', numero.val()));
    });
    
    $("#estoque").keypress(apenasNumero);
});