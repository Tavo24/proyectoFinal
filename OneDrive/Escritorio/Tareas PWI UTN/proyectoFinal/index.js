
const express = require('express');
const app = express();
const Port = process.env.PORT || 3000;
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');
const mysql = require('mysql');
const crypto = require('crypto');
var bodyParser = require('body-parser')

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:false, limit:'50mb'}));
app.use(bodyParser.json({ limit: '50mb' }));
app.set('views', path.join(__dirname, 'views'));

const dbConfig = {
	host     : 'us-cdbr-east-05.cleardb.net',
	user     : 'bd455b74f2792a',
    port: 3306,
	password : '9852f9e2105a302',
	database : 'heroku_dfe3ae3becb4086'
}

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(dbConfig); // Recreate the connection, since
                                                  // the old one cannot be reused.
  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
    console.log('conexion exitosa a la db');
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}


const createFirstUser = () => {
    const userAdmin = {
        nombCompleto: 'Rebe',
        direccion: 'Pues si como sea',
        localidad: 'Diamond City',
        provincia: 'Entre Rios',
        telefono: 11111111,
        dni: 11111111,
        email: 'rebe.g_r@hotmail.com',
        pass: 'FuckmyLife114',
        rol: 'administrador'
    }
    connection.query('SELECT * FROM cliente WHERE email = ?', [userAdmin.email], function(error, results, fields){
        if (error) throw error;
        if (results.length > 0){
        }else {
            const hashedPassword = getHashedPassword(userAdmin.pass);
            connection.query('INSERT INTO cliente (nombCompleto, direccion, localidad, provincia, telefono, dni, email, pass, rol) VALUES (?) ', [[userAdmin.nombCompleto, userAdmin.direccion, userAdmin.localidad, userAdmin.provincia, userAdmin.telefono, userAdmin.dni, userAdmin.email, hashedPassword, userAdmin.rol]], function(error, results) {
                // If there is an issue with the query, output the error
                if (error) throw error;
                // If the account exists
                console.log('se creo el usuario admin correctamente!')
            });
        }
    });
}
createFirstUser();

//Configuramos el Motor de Plantillas
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.post('/logout', function(request, response) {
    request.session.destroy()
    response.render('index', {
        titulo: 'Bienvenidos!'
    })
});

app.post('/auth', function(request, response) {
	// Capture the input fields
	let mail = request.body.mail;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (mail && password) {
        const hashedPassword = getHashedPassword(password);

		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM cliente WHERE email = ? AND pass = ?', [mail, hashedPassword], function(error, results) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
                var rows = JSON.parse(JSON.stringify(results[0]));
                
                if(rows.rol === 'administrador') {
                    request.session.isAdmin = true;
                }else {
                    request.session.isClient = true;
                }
				request.session.idCliente = rows.idCliente;
				request.session.loggedIn = true;
				request.session.mail = mail;
				// Redirect to home page
				response.redirect('/');
			} else {
				response.send('Pass o email incorrecto!');
			}			
			response.end();
		});
	} else {
		response.send('ingrese su email y password!');
		response.end();
	}

});

app.post('/register', function(request, response) {
	// Capture the input fields
    let nombCompleto = request.body.nombCompleto;
    let direccion = request.body.direccion;
    let localidad = request.body.localidad;
    let provincia = request.body.provincia;
    let telefono = request.body.telefono;
    let dni = request.body.dni;
	let email = request.body.email;
	let pass = request.body.pass;
    let rol = "cliente";
        
    // Ensure the input fields exists and are not empty
	if (nombCompleto && direccion && localidad && provincia && telefono && email && pass && rol) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
        connection.query('SELECT * FROM cliente WHERE email = ?', [email], function(error, results, fields){
            if (error) throw error;
            if (results>0){
                response.send("email ya registado")
            }
        });

        const hashedPassword = getHashedPassword(pass);

        connection.query('INSERT INTO cliente (nombCompleto, direccion, localidad, provincia, telefono, dni, email, pass, rol) VALUES (?) ', [[nombCompleto, direccion, localidad, provincia, telefono, dni, email, hashedPassword, rol]], function(error, results) {
            // If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
				// Authenticate the user
                request.session.isClient = true;
				request.session.loggedIn = true;
				request.session.mail = email;
                // Redirect to home page
				response.redirect('/');
			    response.end();
		    });
        } else {
        response.send('Complete todos sus datos por favor!');
        response.end();
        }
    
});

app.get('/', (req, res) =>{
	res.render('index', {
        titulo: 'Bienvenidos a Domino!',
        loggedIn: req.session.loggedIn,
        mail: req.session.mail,
        isAdmin: req.session.isAdmin,
        isClient: req.session.isClient
    })
});

app.get('/contacto', (req, res) =>{
    res.render('contacto', {titulo: 'Alguna consulta o encargue? escribenos por aca:',
    loggedIn: req.session.loggedIn,
    mail: req.session.mail,
    isAdmin: req.session.isAdmin,
    isClient: req.session.isClient})
});

app.get('/clientes', (req, res) =>{
    if(req.session.isClient) {
        let sql = " SELECT * FROM cliente where email = '" + req.session.mail + "'";
        connection.query(sql, (err, results) => {
        if (err) throw err;
            res.render("clientes",{
                titulo:'Bienvenido al panel de usuarios',
                loggedIn: req.session.loggedIn,
                mail: req.session.mail,
                isClient: req.session.isClient,
                results
            })
        });
        } else {
            res.render("index",{
                titulo:'Bienvenidos!',
                loggedIn: req.session.loggedIn,
                mail: req.session.mail,
                isClient: req.session.isClient
            })
        }
    
});


app.get('/registro', (req, res) =>{
    res.render('registro')
});

app.get('/administracion', (req, res) => {
    if(req.session.isAdmin) {
    let sql = " SELECT * FROM producto";
    let sqlcontacto = "SELECT formulario.*, cliente.telefono FROM formulario INNER JOIN cliente ON formulario.idCliente = cliente.idCliente;";

    connection.query(sql, (err, resultados) => {
        if (err) throw err;
        connection.query(sqlcontacto, (error, results) => {
            if (error) throw error;
            res.render("administracion",{
                titulo:'Bienvenido Administrador',
                loggedIn: req.session.loggedIn,
                mail: req.session.mail,
                isAdmin: req.session.isAdmin,
                results:resultados,
                formularios: results
            })
        });
    
    });

    } else {
        res.render("index",{
            titulo:'Bienvenidos!',
            loggedIn: req.session.loggedIn,
            mail: req.session.mail,
            isAdmin: req.session.isAdmin
        })
    }

});

app.get('/productos', (req, res) =>{
    let sql = " SELECT * FROM producto";
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        res.render("productos", {
            titulo: 'Chusmea lo que hacemos, cualquier cosa consultanos:',
            results: results,
            loggedIn: req.session.loggedIn,
            mail: req.session.mail,
            isAdmin: req.session.isAdmin
        });
        });
    
});

app.post('/productos', function(request, response) {
	// Capture the input fields
    let nombProducto = request.body.producto_nombProducto;
    let imagen = request.body.imagenBaseAdd;
    let color = request.body.producto_color;
	let stock = request.body.producto_stock;
	// Ensure the input fields exists and are not empty
	if (nombProducto && imagen && color && stock) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('INSERT INTO producto (nombProducto, imagen, color, stock) VALUES (?) ', [[nombProducto, imagen, color, stock]], function(error, results) {
			// If there is an issue with the query, output the error
			if (error) throw error;
                // Redirect to home page
				response.redirect('administracion');
			    response.end();
		    });
        } else {
        response.send('Complete los campos');
        response.end();
        }
});

//UPDATE prod
app.post("/update", (req, res) => {
    let sql =
    "UPDATE producto SET nombProducto='" +
    req.body.producto_nombProducto +
    "', imagen='" +
    req.body.imagenBaseEdit +
    "', color='" +
    req.body.producto_color +
    "', stock='" +
    req.body.producto_stock +
    "' WHERE idProducto=" +
    req.body.idProducto;

    let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("administracion");
    });
});

// DELETE prod
app.post("/delete", (req, res) => {
    let sql = "DELETE FROM producto WHERE idProducto=" + req.body.idProducto;
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect("administracion");
    });
});

//UPDATE cliente
app.post("/updatecliente", async (req, res) => {
    let sql =
    "UPDATE cliente SET nombCompleto='" +
    req.body.cliente_nombCompleto +
    "', direccion='" +
    req.body.cliente_direccion +
    "', localidad='" +
    req.body.cliente_localidad +
    "', provincia='" +
    req.body.cliente_provincia +
    "', telefono='" +
    req.body.cliente_telefono +
    "', dni='" +
    req.body.cliente_dni +
    "', email='" +
    req.body.cliente_email +
    "' WHERE idCliente=" +
    req.body.idCliente;


    let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("clientes");
    });
});


app.post('/contacto', function(request, response) {
	// Capture the input fields
    let nombCompleto = request.body.nombCompleto;
    let email = request.body.email;
    let tipo = request.body.tipo;
	let mensaje = request.body.mensaje;
	let idCliente = request.session.idCliente;
	// Ensure the input fields exists and are not empty
	if (nombCompleto && email && tipo && mensaje) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('INSERT INTO formulario (nombCompleto, email, tipo, mensaje, idCliente) VALUES (?) ', [[nombCompleto, email, tipo, mensaje, idCliente]], function(error, results) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
				// Authenticate the user
                // Redirect to home page
				response.redirect('/');
			    response.end();
		    });
        } else {
        response.send('Consulta enviada, gracias!');
        response.end();
        }
    
});

app.listen(Port, () =>{
    console.log(`Servidor está trabajando en el Puerto ${Port}`);
});

app.on('error', (err) =>{
    console.log(`Error en la ejecución del Servidor ${error}`);
})




