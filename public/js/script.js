var produto = {lista:"http://localhost:3000/product", item:"http://localhost:3000/product/"};


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
    $('table').fadeIn('slow');
    $('#resultado').show();
    tabelaCompleta();
}

//Requisição de todos os ítens para à tabela
function tabelaCompleta(){
    $.getJSON(produto.lista, function(lst){
        var x;
        var arrOut = '<table><tr><th>Código</th><th>Produto</th><th>Valor</th><th>Status</th><th>Estoque</th><th>Editar</th><th>Excluir</th></tr>';
        for (x=0; x < lst.length; x++){
            var classe = '';
            var status = lst[x].status;
            if(status=='A'){
                classe='ativo';
            }else{
                classe='inativo';
            }
            arrOut +='<tr data-id="'+lst[x].id+'"><td><span class="'+classe+'">'+lst[x].id+'</span></td>';
            arrOut +='<td><span class="'+classe+'">'+lst[x].nome+'</span></td>';
            arrOut +='<td><span class="'+classe+'">R$ '+lst[x].valor+'</span></td>';
            arrOut +='<td><span class="'+classe+'">'+lst[x].status+'</span></td>';
            arrOut +='<td><span class="'+classe+'">'+lst[x].estoque+'</span></td>';
            arrOut +='<td><img src="img/edit.png" class="editar"></img></td>';
            arrOut +='<td><img src="img/remove.png" class="excluir"></img></td></tr>';
        }
        $('#resultado').html(arrOut);
    });
}

//Popular select
function preencheSelect(){
    $('#itens').html('');
    $('#itens').show();
    limparConteudo();
    $.getJSON(produto.lista, function(lst){
        var lista = '';
        var x;
        lista +='<option value="#">Escolha um produto...</option>';
        for (x=0; x < lst.length; x++){
            lista +='<option value="'+ lst[x].id +'">'+ lst[x].nome +'</option>';
        }
        $('#itens').append(lista);
    });
}

//Busca itens conforme onchange do select
function buscarItem(codigo){
    $.getJSON(produto.item+codigo, function(result){
        var arrOut = '';
        var classe;
        var status = result.status;
        if(status=='A'){
            classe='ativo';
        }else{
            classe='inativo';
        }
        arrOut += '<table><tr><th>Código</th><th>Produto</th><th>Valor</th><th>Status</th><th>Estoque</th></tr>';
        arrOut +='<tr><td><span class="'+classe+'">'+result.id+'</span></td>';
        arrOut +='<td><span class="'+classe+'">'+result.nome+'</span></td>';
        arrOut +='<td><span class="'+classe+'">R$ '+result.valor+'</span></td>';
        arrOut +='<td><span class="'+classe+'">'+result.status+'</span></td>';
        arrOut +='<td><span class="'+classe+'">'+result.estoque+'</span></td></tr>';
        $('#resultado').html(arrOut);
    });
}

//Verifica o value do select equivalente ao código do produto no banco
//Se inválido ou menor que 1 limpa o conteúdo do #resultado
function buscar(indice){
    var codigo = indice;
    if(codigo>=0){
        buscarItem(codigo);
    }else{
        limparConteudo();
    }
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

function mensagemDeErro(){
    $('#msgError').fadeIn('fast', function(){
        setTimeout(function(){
            $('#msgError').fadeOut('slow');
        },25000);
    });
}

//Requisição para adicionar item
function adicionarItem(){
    var nome = $('#nome').val();
    var valor = $('#valor').val();
    var status = $('#status').val();
    var estoque = $('#estoque').val();
    if(nome!==""&&valor!==''&&estoque!==''){
        $.ajax({
            type: "POST",
            url: produto.lista,
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
        url: produto.item+id,
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
    if(nome!==""&&valor!==''&&estoque!==''){
        $.ajax({
            type: "PUT",
            url: produto.item+id,
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
        url: produto.item+id,
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
    });

    $('#itens').change(function(){
        var indice = this.value;
        buscar(indice);
    });

    $('#addItem').click(function(){
        $('#formCadastrar').show();
        $('#title').html('').append('Cadastrar produto:');
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
        $('#title').html('').append('Atualizar produto:');
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

    $('#background').click(function(){
        esconderForm();
        limparCamposForm();
    });

    $('#cancelar').click(function(){
        esconderForm();
    });

    $("#nome").keyup(function(){
        var letras = $(this);
        letras.val(verificaCaracter(/[^a-zA-Záàâãéèêíïóôõöúçñ ]+/g,'', letras.val()));
    });
    $("#valor").keyup(function(){
        var numero = $(this);
        numero.val(verificaCaracter(/[^0-9.]+/g,'', numero.val()));
    });
    $("#estoque").keypress(apenasNumero);
});