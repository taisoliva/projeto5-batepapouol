let nome;

let dados;

let dadosServidor = [];

let idSetInterval;


perguntarNome();

function perguntarNome(){
    nome = prompt("Digite seu lindo nome:");
    enviaParticipante();
}

function enviaParticipante(){

    dados = {name:nome}
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

function manterConexao(){
    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", dados);
    promisse.then(verificaConexao)
}

function verificaConexao(){
    console.log("estou conectado");
}

function processarMensagens(resposta){
    console.log("to aqui");
    console.log(resposta);
    dadosServidor = resposta.data;
    imprimirDados();
}

function entrarNaSala(){
    buscarMensagens(); 
    ativaStatus();
    recarregaMensagens();
}

function ativaStatus(){
    setInterval(manterConexao,5000);
}

function adicionarMensagem(){
console.log(mensagem);
}

/* imprimi as mensagens e quem entrou na sala*/ 
function imprimirDados(){
 
    let mensagem = document.querySelector("main");
    let aux ="";

    for(let i = 0; i < dadosServidor.length; i++){
        if (dadosServidor[i].type === "status"){
            
            aux = aux + `<div class="mensagem entrou">
                                                       <span> (${dadosServidor[i].time}) </span>  
                                                       <span> ${dadosServidor[i].from} </span> 
                                                       <span> ${dadosServidor[i].text} </span>
                                                    </div>`;
            
        }

       else if (dadosServidor[i].type === "message"){
            aux = aux + `<div class="mensagem normal">
                                                            <span> (${dadosServidor[i].time}) </span>  
                                                            <span> ${dadosServidor[i].from} </span> para 
                                                            <span> ${dadosServidor[i].to} </span>:
                                                            <span> ${dadosServidor[i].text} </span>
                                                        </div>`;
        }

        else {
            aux = aux + `<div class="mensagem reservado">
                                                            <span> (${dadosServidor[i].time}) </span>  
                                                            <span> ${dadosServidor[i].from} </span> reservadamente para
                                                            <span> ${dadosServidor[i].to} </span>:
                                                            <span> ${dadosServidor[i].text} </span>
                                                        </div>`;
        }
    }

    mensagem.innerHTML = aux;
    
   setTimeout(()=> document.querySelector("main div:last-child").scrollIntoView(), 0);
}

function recarregaMensagens(){
    setInterval(buscarMensagens,3000);
}

let envio = document.querySelector("input");
envio.addEventListener("keyup", function(event) {
    if(event.keyCode === 13){
        event.preventDefault();
        enviarMensagem();
    }
});

function enviarMensagem(){

    const input = document.querySelector("input");
    const texto = input.value; 
    input.value = "";

    if(texto === ""){
        return;
    }

    const textoParaEnviar = {   from:nome,
                to:'Todos',
                text:texto,
                type: "message"};

   const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",textoParaEnviar);
   
   requisicao.then(imprimir);
   requisicao.catch(atualizaPagina);
}

function atualizaPagina(){
    window.location.reload();
}

function imprimir(resposta){
    console.log("Depois de enviar");
    buscarMensagens();
}


