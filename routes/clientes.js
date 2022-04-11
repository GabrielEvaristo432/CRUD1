var express = require('express');
var router = express.Router();
const db = require('../db.js');
ObjectID = require('mongodb').ObjectID;

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const conn = await db.connect()
  const clientes = conn.collection('clientes');
  const docs = await clientes.find().toArray();
  res.render('list', { docs: docs, inserido: false, removido: false })
});

router.post('/', async function(req, res, next) {
  const conn = await db.connect()
  const clientes = conn.collection('clientes');
  const nome = req.body.nome;
  const telefone = req.body.telefone;
  const uf = req.body.uf;
  if(req.body.hiddenid){
    const info = {_id: new ObjectID(req.body.hiddenid)}
    await clientes.updateOne(info, {$set:{nome: nome, telefone: telefone, uf: uf}})
    res.redirect('/clientes')
  } else {
    await clientes.insertOne({
      nome: nome,
      telefone: telefone,
      uf: uf})
      const docs = await clientes.find().toArray();
      res.render('list', { docs: docs, inserido: true, removido: false 
    })
  }
});

router.post('/delete', async function(req, res, next) {
  const conn = await db.connect()
  const clientes = conn.collection('clientes');
  const _id = req.body.hiddenid;
  await clientes.deleteOne({_id: new ObjectID(_id)})
  //res.render('list', { docs: docs, removido: true, inserido: false })
  res.redirect('/clientes')
});

router.post('/edit', async function(req, res, next) {
  const conn = await db.connect()
  const clientes = conn.collection('clientes');
  const _id = req.body.hiddenid;
  const up = await clientes.findOne({_id: new ObjectID(_id)})
  res.render('add', { obj: up, lbl: "Atualizar", titulo:"Atualizar cadastro" })
});

router.get('/add', async function(req, res, next) {
  res.render('add', {lbl: "Cadastrar", titulo: "Adicionar cliente", obj:{nome: "", telefone:"", uf:""}});
});
module.exports = router;
