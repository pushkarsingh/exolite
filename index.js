const fs = require("fs/promises");
const express = require("express");
const cors = require("cors");
const _ = require("lodash");

const {v4:uuid} = require("uuid");

const app = express();

const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://exolite:exolite@exolite.pbixjpp.mongodb.net/?retryWrites=true&w=majority");
app.use(express.json());

const Images = require("./models/images");

app.get("/images/:exam_id",(req,res) => {

    const exam_id = req.params.exam_id;
    
    Images.find({exam_id:exam_id})
    .exec()
    .then(docs => {
      
      if (docs) {
       docs.forEach(doc => {
            console.log("From database", doc);      
        });
        //res.status(200).json(doc);
        res.status(200).json(docs
        )
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
    

}

);

app.get("/images/:exam_id/:file_name", function (req, res) {
  
    const exam_id = req.params.exam_id;
    const file_name = req.params.file_name;

    res.download(process.cwd()+ `/exams/${exam_id}/${file_name}`, function (err) {
      if (err) {
        console.log(err);
      }
    });
  });

app.post("/comment",(req,res) => {

      Images
        .updateOne({
            name: req.body.name,
            price: req.body.exam_id
          },{comment:req.body.comment})
          .exec()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: "Handling POST requests to /images",
            updatedImage: result
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });

});

app.get("/comment/:exam_id/:name",(req,res) => {

    const exam_id = req.params.exam_id;
    const name = req.params.name;

    Images.findOne({exam_id:exam_id,name:name})
    .exec()
    .then(docs => {
      
      if (docs) {
        res.status(200).json({"comment" : docs.comment})
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
    
});

app.post("/images", async (req, res) => {

    console.log(req.body);

    var jsonRequest = req.body;

    const exam_id = jsonRequest.exam_id;
    const file_name = jsonRequest.file_name;

	if (!exam_id) {
		return res.sendStatus(400);
	}

    if (!file_name) {
		return res.sendStatus(400);
	}

	await fs.mkdir(process.cwd()+ `/exams/${exam_id}`, { recursive: true });
//	await fs.writeFile(`exams/${id}/`, content);

	res.status(201).json({
		exam_id: exam_id,
        file_name:file_name
	});
});




app.listen( 3000,'0.0.0.0',() => console.log("API Server running "));
