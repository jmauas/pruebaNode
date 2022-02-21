const axios = require('axios');

const get = async (url)=> {
  try {
    const resp =  await axios.get(url);
    //console.log(resp.data);
    return resp.data;
  } catch (err) {
    console.dir(err);
  }
}

const proceso = async () => {
  try {
    const info = await get(`https://swapi.dev/api/films/`);
    const pelis = info.results;
    //console.log(pelis);
    let peliculas = await Promise.all(
      pelis.map(async p => {
        return {
          title: p.title
          , planets: await recorrerPlanetas(p.planets)
          , characters: await recorrerPersonas(p.characters)
          , starships: await recorrerNaves(p.starships)
        }
      })
    );
    console.table(JSON.stringify(peliculas));
  } catch (err) {
    console.error("Error: "  + err.stack + err.message);    
  }
}

const recorrerPlanetas = async planetas => {
  const rsdo = await Promise.all(
    planetas.map( async p => {
      const planeta = await get(p);
      return {
        name: planeta.name
        , terrain: planeta.terrain
        , gravity: planeta.gravity
        , diameter: planeta.diameter
        , population: planeta.population
      }  
    })
  );
  return rsdo;
}

const recorrerPersonas = async personas => {
  const rsdo = await Promise.all(
    personas.map(async p => {
      const persona = await get(p);  
      return {
        name: persona.name
        , gender: persona.gender
        , hair_color: persona.hair_color
        , skin_color: persona.skin_color
        , height: persona.height
        , homeworld: await nombrePlaneta(persona.homeworld)
        , species: await recorrerEspecies(persona.species)
      }
    })
  );
  return rsdo;
};

const nombrePlaneta = async (p) => {
  const planeta = await get(p);
  return planeta.name
};

const recorrerEspecies = async (especies) => {
  if (especies.length>0) {
    const especie = await get(especies[0]);
    return {
      name: especie.name
      , language: especie.language
      , average_height: especie.average_height
    }    
  } else {
    return '';
  }  
};

const recorrerNaves = async (naves) => {
  const navesConDatos = [];
  for (n of naves) {
    const nave = await get(n);
    navesConDatos.push(nave);
  };
  let largo = 0;
  let index = 0;
  for (let i of navesConDatos) {
    if (Number(i['length'])>largo) {
      largo = Number(i['length']);
      index = i;
    }
  };
  try { 
    const nave = navesConDatos[index];
    return  {
      name: nave.name
      , model: nave.model
      , manufacturer: nave.manufacturer
      , passengers: nave.passengers
    }
  } catch {
    return "";
  }
};

proceso();


