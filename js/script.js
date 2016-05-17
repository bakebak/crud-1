//Correções:
//Select não exibe opção para listar tudo;
//Pesquisa por ID
//Botão para listar tudo
//
//
//

var strings = {
	endereco:'http://localhost:3000/product/', 
	mensagemErroId:'<span class="erro">Não foi possível selecionar o produto.</span>', 
	mensagemErroPreenchimento:'<span class="erro">Informe corretamente todos os campos.</span>'
};

$(document).ready(function(){
	/*listar();
	$("#produtos").change(function(){
        buscarproduto();
    });*/

    $('#pesquisarId').click(function(){
    	listarPorId();
    	fecharFormulario();
    	$('#campoId').val('');
    });

    $('#todosOsProdutos').click(function(){
    	todosProdutos();
    	fecharFormulario();
    });

    $("#formularioInserir").click(function(){
        limparCampos();
        $('#editar').hide();
        $('#incluir').show();
        abrirFormulario();
    });

    $("#incluir").click(function(){
        verificaCampos();
    });

	$("#formularioEditar").click(function(){
        pegarId();
        $('#excluir').hide();
        $('#editar').hide();
        $('#editar').show();
        atualizarformulario();
    });

    $('#cancelar').click(function(){
    	limparCampos();
    	fecharFormulario();
    });

    $("#editar").click(function(){
        editarProduto();
        limpar();
    });

	$("#excluir").click(function(){
        confirmar();
    });

    $("#valor").mask("99.99");
    $("#estoque").mask("99");
});

function todosProdutos(){
	//if (i==="@"){
		$.getJSON(strings.endereco, function(data){
			var result='';
			result+='<table border="1"><tr><th>Código</th><th>Produto</th><th>Valor</th><th>Status</th><th>Estoque</th></tr><tr>';
			for (var n=0; n<data.length; n++){
				result+='<tr><td>' + data[n].id + '</td>' ;
				result+='<td>' + data[n].nome + '</td>' ;
				result+='<td> R$ ' + data[n].valor + '</td>';
				result+='<td>' + data[n].status + '</td>';
				result+='<td>' + data[n].estoque + '</td></tr>';
			}
			'</table>';
			$('#resultado').html(result);
		});
		esconderBotoes();
	//}
}

function listarPorId(){
	var id = $('#campoId').val();
	var num = isNaN(id);
	if(id!=='' && num===false){
		buscarProduto(id);
	}else{
		mensagemErroId();
	}
}

function buscarProduto(id){
	var id = id;
	//var i=$('#produtos').val();
	//if (i>=0){
		$.getJSON(strings.endereco + id, function(data){
			var data = data;
			var result='';
			result+='<table border="1"><tr><th>Código</th><th>Produto</th><th>Valor</th><th>Status</th><th>Estoque</th></tr>';
			result+='<tr data-id='+data.id+'><td>' + data.id + '</td>' ;
			result+='<td>' + data.nome + '</td>' ;
			result+='<td> R$ ' + data.valor + '</td>';
			result+='<td>' + data.status + '</td>';
			result+='<td>' + data.estoque + '</td></tr></table>';
			$('#resultado').html(result);
			exibirBotoes();
		})
		.fail(function(){
			limpar();
			mensagemErroId();
		});
	/*	
	}

	else {
		limpar(i);
		todosprodutos(i);
	}
	*/
}

function verificaCampos(){
	var nome = $('#nome').val();
	var valor = $('#valor').val();
	var estoque = $('#estoque').val();
	if(nome===''||valor===''||estoque===''){
		mensagemErroPreenchimento();
	}else{
		incluirproduto();
		fecharFormulario();
        todosProdutos();
	}
}

function incluirproduto(){
	$.ajax({
		url:strings.endereco, 
		type: 'POST',
		data: {
			nome:$('#nome').val(), 
			valor:$('#valor').val(),
			status:$('input[name=status]:checked', '#formulario').val(),
			estoque:$('#estoque').val()
		}
	});
}

function limparCampos(){
	$('#nome').val('');
	$('#valor').val('');
	$('#estoque').val('');
}

function limpar(){
	$('#resultado').html('');
}

function esconderBotoes(){
	$('#formularioEditar').hide();
	$('#excluir').hide();
}

function exibirBotoes(){
	$('#formularioEditar').show();
	$('#excluir').show();
}

function mensagemErroId(){
	$('#resultado').html(strings.mensagemErroId);
	esconderBotoes();
}

function mensagemErroPreenchimento(){
	$('#resultado').html(strings.mensagemErroPreenchimento);
}

function fecharFormulario(){
	limparCampos();
	$("#formulario").hide();
}

function abrirFormulario(){
	limpar();
	esconderBotoes();
	$("#formulario").fadeIn('fast');
}

function atualizarformulario (){
	$('#formulario').show();
	$('#abrir').hide();
	$("#incluir").hide();
}

function pegarId(){
	var id = $('#resultado').find('tr:nth-child(2)').data('id');
	preencheCampos(id);
}

function preencheCampos(id){
	var id = id;
	$.getJSON(strings.endereco + id, function(data){
		console.log(data);
		$('#nome').val(data.nome);
		$('#valor').val(data.valor);
		if(data.status==='A'){
			$('.A').prop('checked', true);
		}else{
			$('.I').prop('checked', true);
		}
		$('#estoque').val(data.estoque);
	});
}

function editarProduto(){
	var id = $('#resultado').find('tr:nth-child(2)').data('id');
	editar(id)
}

function editar(id){
	$.ajax({
		url:strings.endereco+id,
		type: 'PUT',
		data: {
			nome:$('#nome').val(),
			valor:$('#valor').val(),
			status:$('input[name=status]:checked', '#formulario').val(),
			estoque:$('#estoque').val()
		}
	});
	fecharFormulario();
	limparCampos();
	$("#formularioEditar").hide();
}

function confirmar(){
	var confirma;
	var press = confirm('Tem certeza que deseja excluir este produto?');
	if(press===true){
		excluirProduto();
		esconderBotoes();
		limpar();
	}
}

function excluirProduto(){
	var id = $('#resultado').find('tr:nth-child(2)').data('id');
	console.log(id);
	$.ajax({
		url:strings.endereco+id,
		type: 'DELETE'
	});
	fecharFormulario();
	$("#formularioEditar").hide();
}

function listar (){
	$.getJSON(strings.endereco, function(data){
		var list='<option value="#"> Selecione uma opção. </option>';
		for (var x=0; x<data.length;x++){
			list+='<option value='+data[x].id+'>' + data[x].nome + '</option>';
		}
		$('#produtos').html(list);
	});
}