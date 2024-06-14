const express = require('express');
const PORT = process.env.PORT || 4000;


const app = express();
app.use(express.json());
app.post("*", async (req, res) => {
    res.send("Hello post");
});


app.get("*" , async (req, res) => {
    res.send("Hello get");
});

app.listen(PORT,  function(err)  {
    if (err) 
        console.log(err);
    
    console.log("Server is running on PORT" , PORT);
});