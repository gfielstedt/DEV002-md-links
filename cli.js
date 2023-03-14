#!/usr/bin/env node 
const mdLinks = require("./md-links");
const process = require("process");

const pathRoute2 = process.argv[2]; //3er arg ruta
const pathRouteOptions1 = process.argv[3];
const pathRouteOptions2 = process.argv[4];


mdLinks(pathRoute2, [pathRouteOptions1, pathRouteOptions2]);

module.exports = mdLinks;
//linea 1 ejecutable de node
//manejar los argumentos de la terminal 