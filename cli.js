#!/usr/bin/env node
const mdLinks = require("./md-links");
const process = require("process");

const pathRoute2 = process.argv[2];
const pathRouteOptions1 = process.argv[3];
const pathRouteOptions2 = process.argv[4];
const arrOptions = [pathRouteOptions1, pathRouteOptions2];

mdLinks(pathRoute2, arrOptions);

module.exports = mdLinks;
