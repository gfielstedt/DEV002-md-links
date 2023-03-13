const {
  obtenerArchivosMd,
  invalidateAllRoutes,
  brokenLinks,
  validateAllRoutes,
  statsFunction,
} = require("./function"); //use destructuración para importar funciones

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    if (options[0] === undefined && options[1] === undefined) {
      //se detiene
      const pathArr = obtenerArchivosMd(path);
      pathArr.map((element) => {
        //map recibe una funct y la funct recibe un elemento a iterar
        invalidateAllRoutes(element)
          .then((data) => {
            console.log(data);
            return resolve(data);
          })
          .catch((error) => {
            reject("TU RUTA ES INVALIDA", error);
          });
      });
    } else {
      if (
        (options[0] === "--validate" && options[1] === "--stats") ||
        (options[0] === "--stats" && options[1] === "--validate")
      ) {
        const pathArr2 = obtenerArchivosMd(path);
        pathArr2.map((element) => {
          invalidateAllRoutes(element).then((data) => {
            console.log(brokenLinks(data));
            return resolve(brokenLinks(data));
          });
        });
      } else if (options[0] === "--validate") {
        const arrMd = obtenerArchivosMd(path);
        arrMd.map((element) => {
          invalidateAllRoutes(element)
            .then((data) => {
              validateAllRoutes(data).then((data)=> {
                console.log(data) 
                return resolve(data)
              }
              );
            })
            .catch((error) => {
              return reject("TU RUTA ES INVALIDA", error);
            });
        });
      } else if (options[0] === "--stats") {
        const arrMdStast = obtenerArchivosMd(path);
        arrMdStast.map((element) => {
          invalidateAllRoutes(element).then((data) => {
            console.log(statsFunction(data));
            return resolve(statsFunction(data));
          });
        });
      }
    }
  });
};
//mdLinks()

module.exports = mdLinks;
