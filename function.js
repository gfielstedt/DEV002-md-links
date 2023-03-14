const fs = require("fs");
const path = require("path");
const process = require("process");
const axios = require("axios"); //npm
//console.log(fs);

//verificar que la ruta es valida
//
const validateRoute = (pathRoute) => fs.existsSync(pathRoute); //valida si existe una ruta

//valida si es absoluta
const absoluteRoute = (pathRoute) => path.isAbsolute(pathRoute); // valida si es absoluta 

//convierte relativa en absoluta
const convertAbsulute = (pathRoute) => {
  const validateDirectory = process.cwd(); //verifica si el archivo exixte en la pc
  return path.resolve(validateDirectory, pathRoute); //el proceso devuelve una ruta absoluta
};

//validar que sea un directorio
const validateDirectory = (pathRoute) => {
  const stats = fs.statSync(pathRoute);
  return stats.isDirectory();
};

//leer los archivos de ese directorio // devuelve un arr con el contenido del direct
const readDirectory = (pathRoute) => fs.readdirSync(pathRoute);

//validar que la extención sea .md
const validateRouteMd = (pathRoute) =>
  path.extname(pathRoute) === ".md" ? true : false; //exname :devuelve la extensión de una ruta de archivo.

//implementando la recursividad // buscando arch md
const recursiveFunction = (pathRoute) => {
  let arrReadMd = [];
  if (validateRouteMd(pathRoute)) {
    arrReadMd.push(pathRoute); //se llena si la ruta tiene ext md si no es un directory
  } else if (validateDirectory(pathRoute)) {
    const contentRoute = readDirectory(pathRoute); //leer las rutas del directorio e itera el contenido que tiene
    contentRoute.forEach((route) => {
      //rote es el elemt que se esta iterando del arr de string qur me devolv contenRoute

      arrReadMd = arrReadMd.concat(recursiveFunction(`${pathRoute}/${route}`));
      //concatenar la ruta de los directorios para que me los devuelva en un arr
    });
  }
  return arrReadMd;
};

//Leer contenido de archivos md
const readContentMd = (pathRoute) => {
  return new Promise((resolve, reject) => {
    fs.readFile(pathRoute, "utf-8", (error, data) => {
      error ? reject("hubo  un error") : resolve(data);
    });
  });
};

// readContentMd('README.md').then((data) => {
//  console.log(data)
// }).catch((error) => {
//   console.log(error)
// })

//validar todo tipo de ruta (caso false)
const invalidateAllRoutes = (pathRoute) => {
  return new Promise((resolve, reject) => {
    const arrFinalObjet = []; //usar este arr para crear un objet
    readContentMd(pathRoute) // es lento se maneja con una promesa // provar con readme
      .then((data) => {
        const regEx =
          /\[([\w\s\d]+)\]\(((?:\/|https?:\/\/)[\w\d./?=#]+[a-zA-Z0-9!-_$]+)\)/gi; // link que conindan con regEx me los devuelva
        //regEx.exec(data)//devuelve arr con link que cumplan con la expresion reg
        let arrResultRegEx = regEx.exec(data); //devuelve arr iterado new arr
         while (arrResultRegEx !== null) {
          // evitar que me devuelva null por eso le pido todo lo que dif

          arrFinalObjet.push({
            href: arrResultRegEx[2], //url de archivo md
            text: arrResultRegEx[1],
            file: pathRoute, //provar con readme
          });
          arrResultRegEx = regEx.exec(data);
        }
        resolve(arrFinalObjet);
        
      })
      .catch((error) => {
        reject(error);
      });
  });
};
// invalidateAllRoutes('README.md')
//   .then((data) => {
//     console.log(data)
//   })
//   .catch((error) => {
//     console.log(error);
//   });

//validar todo tipo de ruta (caso true) // devolver un arr de aobjet
const validateAllRoutes = (arrFinalObjet) => {
  // simulando parameter
  return Promise.all(
  arrFinalObjet.map((element) => {
      //cada objetc es una promesa y all me dev un arr de promise
      return axios //lib js desc en npm hace peticiones a un serv recib resp para procesar
        .get(element.href) // hace peticion para obtener datos //obtener inf de esa url *get post put delete
        .then((data) => {
          //data resp de axios big object
          const objetcValidateTrue = {
            // spreadOperator copia desde otro lado todo lo que tenga un object (...) copia href tax/ file
            ...element,
            status: data.status, //num
            statusText: data.statusText,
          };
          return objetcValidateTrue;
        })
        .catch((error) => {
          const failObject = {
            ...element,
            status: error.data ? 404 : 404, //consicional abreviada (if)
            statusText: "FAIL",
          };
          return failObject;
        });
    })
  );
};
// validateAllRoutes([
//   {
//     href: "https://es.wikipedia.org/wiki/Markdown/gina",
//     text: "Markdown",
//     file: "README.md",
//   },
// ]);

// pueden haber repetidos//console.log(new Set([10,20,30,'quince', 'ocho', 8,10,'quince'])) //instancia de un modelo existente 
// set no funciona con lengh si no con size
const statsFunction = (arrFinalObjet) => {
  // me va a devolver un arr de links
  const arrLinks = arrFinalObjet.map((element) => element.href);
  const linksUnicos = new Set(arrLinks); //saca los link que estan repetidos
  return {
    total: arrLinks.length,
    unique: linksUnicos.size, // me va a dar linsk unicos
  };
};
// console.log(statsFunction([
//   {
//     href: "https://es.wikipedia.org/wiki/Markdown/gina",
//     text: "Markdown",
//     file: "README.md",
//   },
//   {
//     href: "https://es.wikipedia.org/wiki/Markdown/gina",
//     text: "Markdown",
//     file: "README.md",
//   },
// ]));

//validar links rotos
const brokenLinks = (arrFinalObjet) => {
  const brokenArr = arrFinalObjet.filter(
    (element) => element.statusText === "FAIL"
  ); //filter esta diseñado para filtrar de acuerdo a una condición //devuelve un arr con los rotos
  return {
    total: arrFinalObjet.length,
    unique: statsFunction(arrFinalObjet).unique,
    broken: brokenArr.length,
  };
};
// console.log(brokenLinks([
//         {
//           href: "https://es.wikipedia.org/wiki/Markdown/gina",
//           text: "Markdown",
//           file: "README.md",
//           statusText:"FAIL",
//         },
//         {
//           href: "https://es.wikipedia.org/wiki/Markdown/gina",
//           text: "Markdown",
//           file: "README.md",
//           statusText: "FAIL",
//         },
//       ]))

//obtener archivos md //usar ej readme
const obtenerArchivosMd = (pathRoute) => {
  if (validateRoute(pathRoute)) {
    absoluteRoute(pathRoute);
    convertAbsulute(pathRoute);
  }
  return recursiveFunction(pathRoute); // dev un arr con archivos md
};


module.exports = {
  obtenerArchivosMd, //obtener archivos md
  invalidateAllRoutes, //validar todo tipo de ruta caso falso
  validateAllRoutes, //valida todo tipo de ruta //falta en md
  brokenLinks, //valida link rotos
  statsFunction, // devuelve estadisticas // falta en md
};
//fin