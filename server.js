let express=require("express")
var mysql2=require("mysql2");
let fileloader=require("express-fileupload");
let app=express();
app.use(fileloader());
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'deepak1442005@gmail.com',
      pass: 'qnum tgrt jrgi hnri'
    }
  });


/*let config={
    host:"localhost",
    user:"root",
    password:"@Deepak23145",
    database:"project",
    dateStrings:true
    
}*/
/*let config={
    host:"bxlhtcpo4hhlmrtjr6hw-mysql.services.clever-cloud.com",
    user:"un0wke91voucg3qk",
    password:"xFYYldl8cJ7DD4s0ffGA",
    database:"bxlhtcpo4hhlmrtjr6hw",
    dateStrings:true,
    keepAliveInitialDelay:10000,
    enableKeepAlive:true`
    
}*/
let config="mysql://avnadmin:AVNS_2J_n9_oNmdG_EWNlx45@mysql-23b6d881-deepak1442005-7e34.g.aivencloud.com:21176/defaultdb";
var mysql=mysql2.createConnection(config);
mysql.connect(function(err)
{
    if(err==null)
        console.log("Connected To Database Successfully");
    else
        console.log(err.message);

})

app.use(express.static("public"));
app.use(express.urlencoded("true"));

app.listen(2240,function()
{
    console.log("server started : ");
})

app.get("/",function(req,res)
{
    let path= __dirname +"/public/index.html";
    res.sendFile(path);
})

app.get("/add-user",function(req,res)
{
    let email=req.query.email;
    let password=req.query.pwd;
    let x=1;
    let y=req.query.utype;
    //console.log(y);
    //console.log(pwd);
    mysql.query("insert into users values(?,?,?,?)",[email,password,y,x],function(err,result)
    {
        if(err==null)
        {
            console.log("Congrats...");
            res.send("Signup Successfully")
        }

        else
            res.send(err.message);
    })

})
app.get("/forgot-password",function(req,res)
{
    let email=req.query.lemail;
    mysql.query("select pwd from users where email=?",[email],function(err,result)
    {
        if(err!=null)
        {
            res.send(err.message);
            return;
        }
        if(result.length==0)
        {
            res.send("invalid id");
            return;
        }
        res.send("Password send to your mail");
        var mailOptions = {
            from: 'deepak1442005@gmail.com',
            to: email,
            subject: 'Forgot Password',
            text: result[0].pwd
          };
          transporter.sendMail(mailOptions, function(err, info){
            if (err) 
            {
              console.log(err);
            }
            else 
            {
              console.log('Email sent: ' + info.response);
            }
          });
        
    })
})
app.get("/search-user",function(req,res)
{
    let email=req.query.lemail;
    let password=req.query.lpwd;
    mysql.query("select * from users where email=? and pwd=?",[email,password],function(err,result)
    {
        if(err!=null)
        {
            res.send(err.message);
            return;
        }
        if(result.length==0)
        {
            res.send("invalid id or password ");
            return;
        }
        if(result[0].istatus==1)
        {
            res.send(result[0].utype);
            return;
        }
        else
        {
            res.send("you are blocked");
            return;
        }
    })
})
app.get("/profile-open",function(req,res)
{
    let path= __dirname +"/public/infl-dash.html";
    res.sendFile(path);   
})
app.post("/form-data",function(req,res)
{
    let email=req.body.txtEmail;
    let name=req.body.iname;
    let gender=req.body.selectGender;
    let dob=req.body.dob;
    let address=req.body.txtAddress;
    let city=req.body.txtCity;
    let contact=req.body.txtPhone;
    let field=req.body.field;
    let insta=req.body.insta;
    let facebook=req.body.facebook;
    let youtube=req.body.youtube;
    let comments=req.body.comments;
    let fileName="";
    if(req.files!=null)
    {
        fileName=req.files.picc.name;
        let path=__dirname+"/public/uploads/"+fileName;
        req.files.picc.mv(path);
    }
    else
        fileName="nopic.jpg";

    mysql.query("insert into profile values(?,?,?,?,?,?,?,?,?,?,?,?,?)",[email,name,gender,dob,address,city,contact,field,insta,facebook,youtube,comments,fileName],function(err)
    {
        if(err==null)
            res.send("Bahut Bahut Badhai.....");
        else
            res.send(err.message);
    })
})
app.post("/form-update",function(req,res)
{
    let fileName=req.body.hdn;
    let email=req.body.txtEmail;
    let name=req.body.iname;
    let gender=req.body.selectGender;
    let dob=req.body.dob;
    let address=req.body.txtAddress;
    let city=req.body.txtCity;
    let contact=req.body.txtPhone;
    let field=req.body.field;
    let insta=req.body.insta;
    let facebook=req.body.facebook;
    let youtube=req.body.youtube;
    let comments=req.body.comments;
    if(req.files!=null)
    {
        fileName=req.files.picc.name;
        let path=__dirname+"/public/uploads/"+fileName;
        req.files.picc.mv(path);
    }
    mysql.query("update profile set iname=? ,gender=?, dob=?, address=?, city=?, contact=?, field=? ,insta=?,facebook=?,youtube=?,other=?,picpath=? where email=?",[name,gender,dob,address,city,contact,field,insta,facebook,youtube,comments,fileName,email],function(err,result)
    {
        if(err==null)
            {
                if(result.affectedRows>=1) 
                    res.send("Updated  Successfully....");
                else
                    res.send("Invalid Email ID");
            }
            else
                res.send(err.message);
    })
})
app.get("/check-email",function(req,res)
{
    let email=req.query.txtEmail;
    mysql.query("select *from profile where email=?",[email],function(err,result)
    {
        if(err!=null)
        {
            res.send(err.message);
            return;

        }
        if(result.length==0) 
            res.send("Email not exist");
        else
            res.send("Email exists");
        
    })
})
app.get("/user-search",function(req,res)
{
    let email=req.query.txtEmail;
    mysql.query("select *from profile where email=?",[email],function(err,result)
    {
        if(err!=null)
        {
            res.send(err.message);
            return;

        }
        res.send(result);
    })

})
app.get("/post-event",function(req,res)
{
    let email=req.query.pEmail;
    let event=req.query.event;
    let edate=req.query.edate;
    let etime=req.query.etime;
    let ecity=req.query.ecity;
    let evenue=req.query.evenue;
    
    mysql.query("insert into ievents(email,evnts,doe,tos,city,venue) value (?,?,?,?,?,?)",[email,event,edate,etime,ecity,evenue],function(err,result)
    {
        if(err==null)
            console.log("Bahut Bahut Badhai.....");
        else
            res.send(err.message);
    })
})
app.get("/settings",function(req,res)
{
    let email=req.query.semail;
    let opwd=req.query.opwd;
    let npwd=req.query.npwd;
    let npwd2=req.query.npwd2;
    mysql.query("update users set pwd=? where email=? and pwd=? ",[npwd,email,opwd],function(err,result)
    {
        if(err==null)
            console.log("Bahut Bahut Badhai.....");
        else
            res.send(err.message); 
        if(result.affectedRows==0) 
            res.send("Incorrect password");
    })   
})
app.get("/admin-dash",function(req,res)
{
    let path= __dirname +"/public/admin-dash.html";
    res.sendFile(path);  
})
app.get("/admin-users",function(req,res)
{
    let path= __dirname +"/public/admin-users.html";
    res.sendFile(path);  
})
app.get("/fetch-users",function(req,res)
{
    mysql.query("select * from users",function(err,result)
    {
        if(err!=null)
        {
            res.send(err.message);
            return;
        }
        res.send(result);
    })
})
app.get("/blockuser",function(req,res)
{
    let x=0;
    mysql.query("update users set istatus =? where email =?",[x,req.query.email],function(err,result)
    {
        if(!err)
        {
            res.send("ok")
        }
    })
})
app.get("/unblockuser",function(req,res)
{
    let x=1;
    mysql.query("update users set istatus =? where email =?",[x,req.query.email],function(err,result)
    {
        if(!err)
        {
            res.send("ok");
        }
    })
})
app.get("/delete-user",function(req,res)
{
    mysql.query("delete from users where email=?",[req.query.email],function(err,result)
    {
        if(err!=null)
        {
            res.send(err,message);
        }
        res.send(result);
    })
    mysql.query("delete from cprofile where email=?",[req.query.email],function(err,result)
    {
        if(err!=null)
        {
            res.send(err,message);
        }
    })
    mysql.query("delete from profile where email=?",[req.query.email],function(err,result)
    {
        if(err!=null)
        {
            res.send(err,message);
        }
    })
    mysql.query("delete from ievents where email=?",[req.query.email],function(err,result)
    {
        if(err!=null)
        {
            res.send(err,message);
        }
    })
})
app.get("/infl-data",function(req,res)
{
    let path= __dirname +"/public/admin-all-infl.html";
    res.sendFile(path);
})
app.get("/profile-data",function(req,res)
{
    mysql.query("select *from profile",function(err,result)
    {
        if(err!=null)
        {
            res.send(err.message);
            return;
        }
        res.send(result);
    })
})
app.get("/infl-finder",function(req,res)
{
    let path= __dirname +"/public/infl-finder.html";
    res.sendFile(path);
})
app.get("/influ-data",function(req,res)
{
    let name=req.query.name;
    mysql.query("select distinct city from profile where field=?",[name],function(err,result)
    {
        if(err!=null)
        {
            res.send(err.message);
            return;
        }
        res.send(result);
    })
})
app.get("/influ-selected-data",function(req,res)
{
    let field=req.query.sfield;
    let city=req.query.scity;
    mysql.query("select * from profile where field=? and city=?",[field,city],function(err,result)
    {
        if(err!=null)
        {
            res.send(err.message);
            return;
        }
        res.send(result);
    })
})
app.get("/fill-model",function(req,res)
{
    let email=req.query.email;
    mysql.query("select * from profile where email=?",[email],function(err,result)
    {
        if(err!=null)
        {
            res.send(err.message);
            return;
        }
        res.send(result);
    })
})
app.get("/events-show",function(req,res)
{
    let path= __dirname +"/public/events-manager.html";
    res.sendFile(path);
})
app.get("/events-data",function(req,res)
{
    mysql.query("select * from ievents where doe>=current_date() ",function(err,result)
    {
        if(err!=null)
        {
            res.send(err.message);
        }
        res.send(result);
    })
})
app.get("/eevents-data",function(req,res)
{
    mysql.query("select * from ievents where doe<=current_date() ",function(err,result)
    {
        if(err!=null)
        {
            res.send(err.message);
        }
        res.send(result);
    })
})
app.get("/event-delete",function(req,res)
{
    let r=req.query.rid;
    mysql.query("delete from ievents where rid=?",[r],function(err,result)
    {
        if(err!=null)
        {
            res.send(err.message)
        }
        res.send(result);
    })
})
app.get("/client-dash",function(req,res)
{
    let path= __dirname +"/public/client-profile.html";
    res.sendFile(path);
})
app.get("/admin-login",function(req,res)
{
    let path= __dirname +"/public/admin-login.html";
    res.sendFile(path);   
})
app.get("/client-data",function(req,res)
{
    let name=req.query.CName;
    let email=req.query.CEmail;
    let phone=req.query.CPhone;
    let city=req.query.CCity;
    let state=req.query.CState;
    let org=req.query.COrg;
    mysql.query("insert into cprofile values(?,?,?,?,?,?)",[email,name,city,state,org,phone],function(err)
    {
        if(err==null)
            res.send("Bahut Bahut Badhai.....");
        else
            res.send(err.message);
    })
})
app.get("/client-data-update",function(req,res)
{
    let name=req.query.CName;
    let email=req.query.CEmail;
    let phone=req.query.CPhone;
    let city=req.query.CCity;
    let state=req.query.CState;
    let org=req.query.COrg;
    mysql.query("update cprofile set iname=?, city=?,state=?, org=?,mobile=? where email=?",[name,city,state,org,phone,email],function(err)
    {
        if(err==null)
            res.send("updated");
        else
            res.send(err.message);
    })
})
app.get("/client-search",function(req,res)
{
    let email=req.query.CEmail;
    mysql.query("select *from cprofile where email=?",[email],function(err,result)
    {
        if(err!=null)
        {
            res.send(err.message);
            return;

        }
        res.send(result);
    })

})
app.get("/collab-data",function(req,res)
{
    let path= __dirname +"/public/admin-all-collab.html";
    res.sendFile(path);
})
app.get("/cprofile-data",function(req,res)
{
    mysql.query("select *from cprofile",function(err,result)
    {
        res.send(result);
    })
})
app.get("/infl-event-show",function(req,res)
{
    mysql.query("select *from ievents where rid=?",[req.query.rid],function(err,result)
    {
        res.send(result);
    })
})