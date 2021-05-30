const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')




router.get('/', (req,res)=>{
    redirect('/welcome')
})

router.get('/home', async (req,res)=>{
   
    try{

        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, "secret")

        if(!claims){
            return res.status(401).send({
                message:'Você não está autenticado!'
            })

        }
        const user = await User.findOne({_id: claims._id})

        const {password, ...data} = await user.toJSON()
        
        res.send(data)
    }catch(error){
        return res.status(401).send({
            message:'Você não está autenticado!'
        }) 
    }
})

router.post('/login', async (req,res)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(404).send({
            message:'Usuário não encontrado!'
        })
    }
    if(!await bcrypt.compare(req.body.password, user.password)){
        return res.status(400).send({
            message:'Senha incorreta!'
        })
    }

    const token = jwt.sign({_id: user.id},"secret")

    res.cookie('jwt', token, {
        httpOnly:true,
        maxAge:24*60*60*1000 // 1 dia
    })
    
    res.send({
        message:'success'
    })

})

router.post('/signin', async (req,res)=>{
    const salt = await bcrypt.genSalt(10)
    const hashedPassword =  await bcrypt.hash(req.body.password, salt)
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    })
    const result = await user.save()
    const {password, ...data} = await result.toJSON()
    res.send(data)
    console.log("sucesso")
})

router.post('/logout', (req,res)=>{
    res.cookie('jwt','',{maxAge:0})
    res.send({
        message:'logout feito com sucesso'
    })
})

router.get('/transactions', (req,res)=>{
    res.send('transactions')
})

router.get('/welcome', (req,res)=>{
    res.send('welcome')
})

router.post('/transactions/new', (req,res)=>{
    res.send('transactions new')
})



module.exports = router;