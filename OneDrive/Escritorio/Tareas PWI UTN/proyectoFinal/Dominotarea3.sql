drop database domino;
create database domino;
use domino;

create table cliente(
idCliente int not null auto_increment,
nombCompleto varchar(100) not null,
direccion varchar(120) not null,
localidad varchar(80) not null,
provincia varchar(60) not null,
telefono tinyint not null,
dni tinyint not null,
email varchar(60) not null unique,
pass varchar(60) not null,
primary key(idCliente)
);

alter table cliente modify telefono varchar(20) not null;
alter table cliente modify dni varchar(20) not null;

create table formulario(
idFormulario int not null auto_increment,
tipo boolean,
mensaje varchar(500) not null,
idCliente int not null,
primary key(idFormulario),
foreign key(idCliente) references domino.cliente(idCliente)
);

create table producto(
idProducto int not null auto_increment,
nombProducto varchar(100) not null,
imagen varchar(255) not null, 
color varchar(60) not null,
stock tinyint unsigned not null,
primary key(idProducto)
);

create table formularioProducto(
formularioId int not null,
productoId int not null,
id int auto_increment,
primary key(id),
foreign key(formularioId) references domino.formulario(idFormulario),
foreign key(productoId) references domino.producto(idProducto)
);

insert into producto values (null,"Muggle", "link", "blanco",5);
insert into producto values (null,"HJSimpson", "link", "blanco",3);
insert into producto values (null,"Rolling", "link", "blanco",2);
insert into producto values (null,"Evita", "link", "blanco",1);

delete from cliente where idCliente = 22;
alter table cliente add rol varchar (20) not null after pass;
delete from cliente where idCliente = 1;
INSERT INTO cliente (nombCompleto, direccion, localidad, provincia, telefono, dni, email, pass, rol) VALUES ('Gustavo Chaparro', 'Marconi 574', 'Diamante', 'Entre Rios', 3434652910, 35707917, 'gus.chapa24@gmail.com', '123456', 'cliente');

alter table formulario add nombCompleto varchar (50) not null;
alter table formulario add email varchar(60) not null after nombCompleto;

alter table producto modify imagen blob null;

alter table producto modify imagen longblob null;

delete from formulario where idFormulario = 1;

alter table formulario modify tipo varchar(15);