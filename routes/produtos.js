var express = require('express');
var router = express.Router();
const db = require('../db.js');
ObjectID = require('mongodb').ObjectID;

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const conn = await db.connect()
  const produtos = conn.collection('produtos');
  const docs = await produtos.find().toArray();
  res.render('list', { docs: docs, inserido: false, removido: false })
});

router.post('/', async function(req, res, next) {
  const conn = await db.connect()
  const produtos = conn.collection('produtos');
  const nome = req.body.nome;
  const tipo = req.body.tipo;
  const quantidade = req.body.quantidade;
  const lote = req.body.lote;
  const fornecedor = req.body.fornecedor;
  const valor = req.body.valor;
  const unidadeDeMedida = req.body.unidadeDeMedida;
  if(req.body.hiddenid){
    const info = {_id: new ObjectID(req.body.hiddenid)}
    await produtos.updateOne(info, {$set:{
      nome: nome, 
      tipo: tipo, 
      quantidade: quantidade,
      unidadeDeMedida: unidadeDeMedida, 
      lote: lote, 
      fornecedor: fornecedor,
      valor: valor
    }})
    res.redirect('/produtos')
  } else {
    await produtos.insertOne({
      nome: nome,
      tipo: tipo,
      quantidade: quantidade,
      unidadeDeMedida: unidadeDeMedida,
      lote: lote,
      fornecedor: fornecedor,
      valor: valor,
      unidadeDeMedida: unidadeDeMedida
    })
    // const docs = await produtos.find().toArray();
    // res.render('list', {
    //   docs: docs, inserido: true, removido: false
    // })
    res.redirect('/produtos')
  }
});

router.post('/delete', async function(req, res, next) {
  const conn = await db.connect()
  const produtos = conn.collection('produtos');
  const _id = req.body.hiddenid;
  await produtos.deleteOne({_id: new ObjectID(_id)})
  //res.render('list', { docs: docs, removido: true, inserido: false })
  res.redirect('/produtos')
});

router.post('/edit', async function(req, res, next) {
  const conn = await db.connect()
  const produtos = conn.collection('produtos');
  const _id = req.body.hiddenid;
  const up = await produtos.findOne({_id: new ObjectID(_id)})
  res.render('add', { obj: up, lbl: "Atualizar", titulo:"Atualizar informações" })
});

router.get('/add', async function(req, res, next) {
  res.render('add', {lbl: "Cadastrar", titulo: "Adicionar produto", obj:{
    nome: "", 
    tipo:"", 
    quantidade:"",
    unidadeDeMedida: "",
    lote: "",
    fornecedor:"",
    valor:""
  }});
});
module.exports = router;
