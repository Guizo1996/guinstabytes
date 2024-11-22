import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini  from "../services/geminiService.js";

export async function listarPosts(req, res) {
   //Define uma rota GET para endpoint /post/
   const posts = await getTodosPosts() //Chama a função para obter os posts
   res.status(200).json(posts);//Envia uma resposta HTTPP com status 200(ok)e os posts  em formato JSON 
}

export async function postarNovoPost(req, res) {
    // Função assíncrona para criar um novo post
    const novoPost = req.body; // Obtém os dados do novo post enviados no corpo da requisição
    try {
        // Bloco try-catch para tratamento de erros
        const postCriado = await criarPost(novoPost); // Chama a função criarPost para inserir o novo post no banco de dados e retorna o post criado
        res.status(200).json(postCriado); // Retorna uma resposta HTTP com status 200 (sucesso) e o post criado no formato JSON
    } catch (erroPost) {
        // Caso ocorra algum erro durante a criação do post
        console.error(erroPost.message); // Loga a mensagem de erro no console para facilitar a depuração
        res.status(500).json({"Erro":"Falha na requisição"}); // Retorna uma resposta HTTP com status 500 (erro interno do servidor) e uma mensagem de erro genérica
    } 
}

export async function uploadImagem(req, res) {
    // Função assíncrona para criar um novo post com upload de imagem
    const novoPost = { 
        // Cria um objeto com os dados do novo post, incluindo o nome original da imagem
        descricao:"",
        imgUrl: req.file.originalname,      
        alt: ""
    };
    try {
        // Bloco try-catch para tratamento de erros
        const postCriado = await criarPost(novoPost); // Chama a função criarPost para inserir o novo post no banco de dados e retorna o post criado
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`; // Gera o novo nome da imagem com base no ID do post
        fs.renameSync(req.file.path, imagemAtualizada); // Renomeia a imagem para o novo nome e move para a pasta de uploads
        res.status(200).json(postCriado); // Retorna uma resposta HTTP com status 200 (sucesso) e o post criado no formato JSON
    } catch (erroPost) {
        // Caso ocorra algum erro durante a criação do post ou o upload da imagem
        console.error(erroPost.message); // Loga a mensagem de erro no console para facilitar a depuração
        res.status(500).json({"Erro":"Falha na requisição"}); // Retorna uma resposta HTTP com status 500 (erro interno do servidor) e uma mensagem de erro genérica
    } 
}

export async function atualizarNovoPost(req, res) {
    // Função assíncrona para criar um novo post
    const id = req.params.id; // Obtém os dados do novo post enviados no corpo da requisição
    const urlImagem = `http://localhost:3000/${id}.png`
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini (imgBuffer);
        
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt, 
        }

        // Bloco try-catch para tratamento de erros
        const postCriado = await atualizarPost(id, post); // Chama a função criarPost para inserir o novo post no banco de dados e retorna o post criado
        res.status(200).json(postCriado); // Retorna uma resposta HTTP com status 200 (sucesso) e o post criado no formato JSON
    } catch (erroPost) {
        // Caso ocorra algum erro durante a criação do post
        console.error(erroPost.message); // Loga a mensagem de erro no console para facilitar a depuração
        res.status(500).json({"Erro":"Falha na requisição"}); // Retorna uma resposta HTTP com status 500 (erro interno do servidor) e uma mensagem de erro genérica
    } 
}