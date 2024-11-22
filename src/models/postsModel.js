import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

//Estabelece a conexão com o banco de dados usando a string de conexão obtida do ambiente
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

export async function getTodosPosts(){
    //Função  assincrona para obter todos os posts do banco de dados
    const db = conexao.db("imersao-instabytes") //Seleciona o banco de dados
    const colecao = db.collection("posts") //Seleciona a coleção de posts
    return colecao.find().toArray()//Retorna todos os documentos da coleção como um array
}

export async function criarPost(novoPost){
const db = conexao.db("imersao-instabytes") 
const colecao = db.collection("posts") 
return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost){
    const db = conexao.db("imersao-instabytes"); 
    const colecao = db.collection("posts"); 
    const objID = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost});
    }