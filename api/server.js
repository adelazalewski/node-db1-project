const express = require("express");
const db = require("../data/dbConfig")
const server = express();
const welcomeRouter = require("./welcome/welcomeRouter");


server.use(express.json());
server.use(welcomeRouter)

server.get("/accounts" ,async(req, res, next) => {
	try{
		
		if(!req.query){
			const accounts = await db("accounts").orderby(null).limit(null).select("*")
			res.json(accounts)
			

		  }else{
			
			 const accountsWithQuery = await  queryHandler(req.query)
			// //console.log(res)
			 res.json(accountsWithQuery)
		 }
		
		
	}catch(err){
		next(err)
	}
});
server.get("/accounts/:id",validateID(),async (req, res, next) => {
	res.status(200).json(req.account)
});
server.post("/accounts",validateNewPost(), async(req, res, next) => {
	try{
	//insert into messages (title, contents) VALUES (?,?);
//use a payload obj just in case req.body containes an id or dates
const payload = {
	//send this to thje db
    //db auto generets the id and the dates
    name: req.body.name,
    budget: req.body.budget
}
const [id] = await db("accounts").insert(payload)
//knex returns the new generated id from the insert command
const newAccount = await db("accounts").where("id", id).first()
res.status(201).json(newAccount)
	}catch(err){
		next(err)
	}
})
server.put("/accounts/:id", validateID(), validateNewPost(), async(req, res, next) => {
	try{
		const payload = {
			//send this to thje db
			//db auto generets the id and the dates
			name: req.body.name,
			budget: req.body.budget
		}
//UPDATE messages SET name = ? AND budget = ? WHERE id = ?
await db("accounts").where("id", req.params.id).update(payload)
const updatedAccount = await db("accounts").first().where("id", req.params.id)
res.status(200).json(updatedAccount)
	}catch(err){
		next(err)
	}
});
server.delete("/accounts/:id", validateID(), async (req, res, next) => {
	try{
		//DELETE FROM accounts WHERE id = ?;
		await db("accounts").where("id", req.params.id).del()
		res.status(204).end()
	}catch(err){
		next(err)
	}
})
//custom middleware
function validateID(){
	return async(req, res, next) => {
		try{
			const [account] = await db("accounts").select("*").where("id", req.params.id).limit(1)
			if(account){
				req.account = account
				next()
			}else{
				res.status(404).json({
					message: "account with the specified id was not found"
				})
			}
		}catch(err){
			next(err)
		}
	}
}
function validateNewPost(){
	return (req, res, next) => {
		if(!req.body.name || !req.body.budget){
			res.status(400).json({
				message: "provide name and budget for the new account info"
			})
		}else{
			next()
		}
	}
}
 function queryHandler(query = {}) {
	//return (req, res, next) => {
		const {limit= 5, sortby= 'id',sortdir='desc'} = query
		
				const accounts =  db("accounts")
				.orderBy(sortby, sortdir)
				.limit(limit)
			   .select("*")
			   return accounts
			
	
	
	
   
}

module.exports = server;
