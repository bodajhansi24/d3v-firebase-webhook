const express = require('express');
const app=express();
const dfff=require('dialogflow-fulfillment')

var bodyParser = require('body-parser');
var admin = require("firebase-admin");
var serviceAccount = require('../config/d3v-core-firebase-adminsdk-23z3x-974655d43f.json');
// const { request } = require('express');

try {
 admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://d3v-core.firebaseio.com"
});

  console.log("Connected to DB");
  
} catch (error) {
  console.log("Error here" + error);
  
}

var db = admin.firestore();

app.get('/', (req, res)=>{
    res.send("We are inlive")
});


app.post('/', express.json(), (req, res)=>{
    const agent = new dfff.WebhookClient({
        request : req,
        response : res
	});

	

  
	function confirmed(agent){

    // var name = agent.context.get("confirmed").parameters.cust-name;
		// var email=agent.context.get("confirmed").parameters.cust-email;
    //     var phonenumber = agent.context.get("confirmed").parameter.cust-conatct;
    //     var message = agent.context.get("confirmed").parameters.cust-query;

		
		var name = agent.context.get("confirmed").parameters['cust-name'][0];
		var email=agent.context.get("confirmed").parameters['cust-email'][0];
        var phonenumber = agent.context.get("confirmed").parameters['cust-conatct'][0];
        var message = agent.context.get("confirmed").parameters['cust-query'][0];

		// var timeslot = agent.context.get("confirmed").parameters['cust-time'];
		// var date = agent.context.get("confirmed").parameters['cust-date'];
		
  
		console.log(name);
		console.log(email);
    console.log(phonenumber);
    console.log(message);
		// console.log(timeslot);
		// console.log(date);
  
  
		
  
		agent.add(`Thanks ${name}, our experts will get in touch with you soon 🤗.`);
  
    return db.collection('meeting')
    .add({
		  name : name,
		  email : email,
      phonenumber: phonenumber,
      message:message,
		  // time : Date.now()
		}).then(ref =>
  
		  //fetching free slots from G-cal
		  console.log("Meeting details added to DB")
		  )
  
	  }
	  agent.handleRequest(confirmed);
});



	app.listen(3333, ()=>console.log("Server is live at port 3333"));



    // const importRequest = {
    //     name: 'test_import',
    //     files: [
    //         {
    //             fileName: `test.csv`,
    //             fileImportPage: {
    //                 hasHeader: true,
    //                 columnMappings: [
    //                     {
    //                         columnName: 'Name',
    //                         propertyName: 'name',
    //                         columnObjectType: 'CONTACT',
    //                     },
    //                     {
    //                         columnName: 'Email',
    //                         propertyName: 'email',
    //                         columnObjectType: 'CONTACT',
    //                     },
    //                     {
    //                         columnName: 'PhoneNumber',
    //                         propertyName: 'phonenumber',
    //                         columnObjectType: 'CONTACT',
    //                     },
    //                 ],
    //             },
    //         },
    //     ],
    // }
    // const importFilePath = `./test.csv`
    // const importFileReadStream = fs.createReadStream(importFilePath)
    // const result = await hubspotClient.crm.imports.coreApi.create(JSON.stringify(importRequest), importFileReadStream)
    
    // console.log(JSON.stringify(result.body))
    