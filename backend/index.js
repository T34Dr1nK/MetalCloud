const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');



const app = express();
const saltRounds = 10;
const oneDay = 1000 * 60 * 60 * 24;

app.use(cors({
    origin:["http://localhost:4200"],credentials: true
}));
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(session({
    secret: "Phusit2409",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}))



//database connection

const db = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'simpledb',
        port:3306
});

//check database Connection

db.connect(err=>{
    if(err){console.log(err,'err');}
    console.log('database connected...');
});




//get all data
app.get('/user',(req,res)=>{

    let qr = `select * from user`;

    db.query(qr,(err,result)=>{
        
        if(err){
            console.log(err,'errs');
        }

        if(result.length>0){
            res.send({
                message:'All user data',
                data:result
            });
        }

    });

});

//get single data
app.get('/user/:id',(req,res)=>{
    
    let gID = req.params.id;

    let qr = `SELECT * FROM user WHERE id = ${gID}`;

    db.query(qr,(err,result)=>{

        if(err){
            console.log(err);
        }

        if(result.length>0){
            res.send({
                message:'get single data',
                data:result
            });
        }else{
            res.send({
                message:'data not found'
            });
        }

    });

});


//create data 

app.post('/signUp',(req,res)=>{

    console.log(req.body,'createData');

    let username = req.body.username;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let pass = req.body.password;

    bcrypt.genSalt(saltRounds, (err, salt) => {

        if(err){
            console.log(err);
        }

        bcrypt.hash(pass, salt, (err, hash) => {
            if(err){
                console.log(err);
            }
            let qr = `INSERT INTO user(username,email,mobile,password) 
                        values('${username}','${email}','${mobile}','${hash}')`
    
            db.query(qr,(err,result)=>{
    
                if(err){
                    console.log(err,'errs');
                }
    
                console.log(result,'result');
                req.session.username = username;
                req.session.email = email;
                req.session.save();
                res.status(200).json({
                        loggedIn:true,
                        user:req.session.username
                });
    
            });
        });

    });

});

//Check password
app.post('/logIn',(req,res)=>{

    console.log(req.body,'Getpermission');

    let username = req.body.username;
    let pass = req.body.password;
    let qr = `SELECT * FROM user WHERE username = '${username}'`;

    db.query(qr,(err,result)=>{

        if(err){console.log(err);}

        console.log(result);

        if(result!=0){

            bcrypt.compare(pass, result[0].password, function(err, getting) {

                if(getting == true){
    
                    req.session.username = result[0].username;
                    req.session.email = result[0].email;
                    if(result[0].ascii == null){
                        req.session.twofa = false
                    }
                    req.session.save((err)=>{
                        if(!err){
                            console.log('Token is saved')
                        }else{
                            console.log(err);
                        }
                    });
                    console.log(req.session)
                    res.status(200).json({
                        loggedIn: true,
                        user:req.session.username
                    });
    
                }else{
                    res.status(200).send({
                        loggedIn:false
                    });
                }
    
              });

        }else{
            res.status(200).send({
                loggedIn:false
            })
        }

        

    });

});

//updata data
app.put('/user/:id',(req,res)=>{

    console.log(req.body,'updateData');

    let gID = req.params.id;
    let username = req.body.username;
    let Email = req.body.email;
    let Mobile = req.body.mobile;

    let qr = `update user set username = ${username}, email = ${Email}, mobile = ${Mobile} WHERE id = ${gID}`;

    db.query(qr,(err,result)=>{

        if(err){console.log(err);}

        res.send({
            message:'data update'
        });

    });

});

//getTokens

app.get('/gTokens',(req,res)=>{
    
    if(req.session.email&&req.session.username){

        let Arr = {loggedIn: true,user:req.session.username,twofa: true};

        if(req.session.twofa == false){
            Arr['twofa'] = false; 
        }

        const ObjArr = JSON.stringify(Arr);

        res.status(200).send(ObjArr);

    }else{

        let Arr = {loggedIn: false};

        const ObjArr = JSON.stringify(Arr);

        res.status(200).send(ObjArr);

    }
});

//Delete Tokens

app.get('/dTokens',(req,res)=>{



});

app.get('/createtwofa',(req,res)=>{

    var secret = speakeasy.generateSecret({
        name: req.session.username
    })
    
    qrcode.toDataURL(secret.otpauth_url,function(err,data){
        if(err) throw err;

        let Arr = { Qrdata:data }
        const aObjArr = JSON.stringify(Arr)

        res.status(200).send(ObjArr)
    })

});

app.get('/Test',(req,res)=>{

    let Arr = {loggedIn:true}

    Arr['game'] = "Apex"

    const Arrjson = JSON.stringify(Arr);

    res.status(200).send(Arrjson);

})





app.listen(3000,()=>{
    console.log('Server is listen in port 3000..');
});