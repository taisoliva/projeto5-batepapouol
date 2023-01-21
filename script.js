let nome;

let dados;

let dadosServidor = [];

let idSetInterval;

let participantes = [];

let nomeParticipante ="Todos";

let tipoEscolhido="message";


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

function buscarParticipantes(){
    const promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promisse.then(processarParticipantes);
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

function processarParticipantes(resposta){
    participantes = [];
    console.log("buscou participante");
    for(let i = 0; i< resposta.data.length; i++){
        participantes.push(resposta.data[i]);
    }

    exibirContatos();
    console.log(participantes);
}

function entrarNaSala(){
    buscarMensagens(); 
    ativaStatus();
    recarregaMensagens();
    buscarParticipantes();
    recarregarParticipantes();

    document.querySelector(".usuario").innerHTML = ` Bem vindo(a): ${nome}`;
}

/* verifica se o usuário está na sala*/
function ativaStatus(){
    setInterval(manterConexao,5000);
}

function adicionarMensagem(){
console.log(mensagem);
}

/* imprimi as mensagens e quem entrou na sala*/ 
function imprimirDados(){
 
    let mensagem = document.querySelector(".local");
    let aux ="";

    for(let i = 0; i < dadosServidor.length; i++){
        if (dadosServidor[i].type === "status"){
            
            aux = aux + `<div class="mensagem entrou " data-test="message">
                                                       <span> (${dadosServidor[i].time}) </span>  
                                                       <span> ${dadosServidor[i].from} </span> 
                                                       <span> ${dadosServidor[i].text} </span>
                                                    </div>`;
            
        }

       else if (dadosServidor[i].type === "message"){
            aux = aux + `<div class="mensagem normal" data-test="message">
                                                            <span> (${dadosServidor[i].time}) </span>  
                                                            <span> ${dadosServidor[i].from} </span> para 
                                                            <span> ${dadosServidor[i].to} </span>:
                                                            <span> ${dadosServidor[i].text} </span>
                                                        </div>`;
        }

        else if(dadosServidor[i].to === nome || dadosServidor[i].from === nome){
            aux = aux + `<div class="mensagem reservado" data-test="message">
                                                            <span> (${dadosServidor[i].time}) </span>  
                                                            <span> ${dadosServidor[i].from} </span> reservadamente para
                                                            <span> ${dadosServidor[i].to} </span>:
                                                            <span> ${dadosServidor[i].text} </span>
                                                        </div>`;
        }
    }

    mensagem.innerHTML = aux;
    
    /* quando tem mensagem nova rola a tela*/
   setTimeout(()=> document.querySelector("main div:last-child").scrollIntoView(), 0);
}

/* recarregar mensagens do chat para manter atualizado*/
function recarregaMensagens(){
    setInterval(buscarMensagens,3000);
}

function recarregarParticipantes(){
    setInterval(buscarParticipantes,10000);
}

let envio = document.querySelector("input");
envio.addEventListener("keyup", function(event) {
    if(event.keyCode === 13){
        event.preventDefault();
        enviarMensagem();
    }
});

function abrirBarra(){
    
    document.querySelector("body").classList.remove("cor");
    document.querySelector("body").classList.add("cor-fundo");

    document.querySelector(".local").classList.add("fundo-preto");

    const barra = document.querySelector("aside");
    barra.classList.remove("escondido");

}

function fecharBarra(){
    
    document.querySelector("body").classList.add("cor");
    document.querySelector("body").classList.remove("cor-fundo");

    document.querySelector(".local").classList.remove("fundo-preto");

    const barra = document.querySelector("aside");
    barra.classList.add("escondido");

    atualizaInput();

}

function exibirContatos(){

    let contatos = document.querySelector(".nomes ul");
    contatos.innerHTML = "";

    contatos.innerHTML = contatos.innerHTML + `<li data-test="all" onclick="selecionarParticipante(this)" > 
                                                    <ion-icon name="people"></ion-icon> 
                                                    <p > Todos </p> 
                                                    <span> <ion-icon class="check" name="checkmark"></ion-icon> </span> </li>`

    for(let i = 0; i< participantes.length; i++){

        if(participantes[i].name !== nome){
            contatos.innerHTML = contatos.innerHTML +  `<li data-test="participant" data-test="check" onclick="selecionarParticipante(this)"> 
                                                        <ion-icon name="person-circle"></ion-icon> <p> ${participantes[i].name} </p>
                                                        <span> <ion-icon class="check" name="checkmark"></ion-icon> </span>
                                                     </li>`
        }
        
    }
}

function selecionarParticipante(participanteSelecionado){

    const selecionado = document.querySelector(".selecionado");

    if(selecionado !== null){
        selecionado.classList.add("check");
        selecionado.classList.remove("selecionado");
    }
    
        nomeParticipante = participanteSelecionado.querySelector("p").innerHTML;
        participanteSelecionado.querySelector("span ion-icon").classList.remove("check");
        participanteSelecionado.querySelector("span ion-icon").classList.add("selecionado");
        
}

function selecionarTipo(tipoSelecionado){

    const selecionado = document.querySelector(".selecionado-tipo");

    if(selecionado !== null){
        selecionado.classList.add("check");
        selecionado.classList.remove("selecionado-tipo");
    }
    
   const valor = tipoSelecionado.querySelector("p").innerHTML;
   
   if (valor == "Privado"){
        tipoEscolhido = "private_message";
    } else{
        console.log("não é");
        tipoEscolhido = "message";
    }


    tipoSelecionado.querySelector("span ion-icon").classList.remove("check");
    tipoSelecionado.querySelector("span ion-icon").classList.add("selecionado-tipo");
        
}

function atualizaInput(){

    const input = document.querySelector(".texto-embaixo");
    

    if(tipoEscolhido === "private_message"){
        input.innerHTML = `Enviando para ${nomeParticipante} (reservadamente)`;
    }else{
        input.innerHTML = `Enviando para ${nomeParticipante} (publico)`;
    }
    
}



function enviarMensagem(){

    const input = document.querySelector("input");
    const texto = input.value; 
    input.value = "";

    if(texto === ""){
        return;
    }
        const textoParaEnviar = { from:nome,
            to:nomeParticipante,
            text:texto,
            type:tipoEscolhido};

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

