const express = require('express');
var mongoose = require("mongoose");
const app = express();

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });
mongoose.connection.on("error", function(e) { console.error(e); });

var schema = mongoose.Schema({
    count: Number,
    name: String,
  });
 
var Visitor = mongoose.model("Visitor", schema);

app.get('/', (req, res) => {

    if(req.query.name!=null && req.query.name!=''){
        Visitor.findOne({'name':req.query.name}, function(err, visitorUpdate) {
            if(visitorUpdate){
                visitorUpdate.count += 1;
                visitorUpdate.save((err, updatedUser)=> {
                    if(err){
                        res.status(500).send({ message: "Error en el servidor" });
                    }
                    else{
                        if(!updatedUser){
                            res.send(`<script>alert('No fue posible actualizar');</script>`);
                        }
                        else{
                            res.send(`<script>alert('Visitante actualizado');</script>`);
                        }
                    }
                });
            }else{
                var visitor = new Visitor({ name: req.query.name, count:1 });
                visitor.save((err, newUser)=> {
                    if(err){
                        res.status(500).send({ message: "Error en el servidor" });
                    }
                    else{
                        if(!newUser){
                            res.send(`<script>alert('No fue posible registrar usuario');</script>`);
                        }
                        else{
                            res.send(`<script>alert('${newUser.name} registrado!');</script>`);
                        }
                    }
                });
            }
        });
    }
    else{
        var visitor = new Visitor({ name: 'Anónimo', count:1 });
        visitor.save((err, newUser)=> {
            if(err){
                res.status(500).send({ message: "Error en el servidor" });
            }
            else{
                if(!newUser){

                }
                else{
                    Visitor.find({},(err,visitors)=>{
                        if(err){
                            res.status(500).send({ message: "Error en el servidor" });
                        }
                        else{
                            if(!visitors){
                                res.send(`<script>alert('No fue posible leer usuarios');</script>`);
                            }
                            else{
                                var html=`<table>
                                <thead><tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Visits</th>
                                </tr></thead>`;
                                visitors.forEach(visitor => {
                                    html+=`
                                    <tr>
                                        <td>${visitor._id}</td>
                                        <td>${visitor.name}</td>
                                        <td>${visitor.count}</td>
                                    </tr>`;
                                });
                                html+=`</body></table>`;
                                res.send(html);
                            }
                        }
    
                    });
                }
                
            }
            
        });
    }
});

app.listen(3000, () => console.log('Listening on port 3000!'));