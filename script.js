let nome;

let dadosServidor = [];

let mensagem = document.querySelector("main");


perguntarNome();

function perguntarNome(){
    nome = prompt("Digite seu lindo nome:");
    enviaParticipante();
}

function enviaParticipante(){

    const dados = {name:nome}
    console.log(dados);
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",dados);
    requisicao.then(processarResposta);
    requisicao.catch(processarErro);
}

function processarResposta(resposta){
    console.log(resposta.status);
    entrarNaSala();
}

function processarErro(resposta){
    console.log(resposta.response.status);
    digiteOutroNome();
}

function digiteOutroNome(){
    nome = prompt("Digite outro lindo nome:");
    enviaParticipante();
}

function buscarMensagens(){
    const promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promisse.then(processarMensagens);
}

function processarMensagens(resposta){
    console.log("to aqui");
    console.log(resposta);
    dadosServidor = resposta.data;
    imprimirDados();
}

function entrarNaSala(){
    buscarMensagens();
}

function adicionarMensagem(){
console.log(mensagem);
}

/* imprimi as mensagens e quem entrou na sala*/ 
function imprimirDados(){
 
    for(let i = 0; i < dadosServidor.length; i++){
        if (dadosServidor[i].type === "status"){
            
            mensagem.innerHTML = mensagem.innerHTML + `<div class="mensagem entrou">
                                                       <span> (${dadosServidor[i].time}) </span>  
                                                       <span> ${dadosServidor[i].from} </span> 
                                                       <span> ${dadosServidor[i].text} </span>
                                                    </div>`
            
        }

       else if (dadosServidor[i].type === "message"){
            mensagem.innerHTML = mensagem.innerHTML + `<div class="mensagem normal">
                                                            <span> (${dadosServidor[i].time}) </span>  
                                                            <span> ${dadosServidor[i].from} </span> para 
                                                            <span> ${dadosServidor[i].to} </span>:
                                                            <span> ${dadosServidor[i].text} </span>
                                                        </div>`
        }
    }
}
