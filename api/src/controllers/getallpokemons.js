//dependencias y modelos necesarios
const axios = require("axios");
const { pokemon, type } = require("../db");
const { Op } = require("sequelize");
const pokemonalldata = require("../utils/pokemonalldata.js");

//async para la API
const getAllPokemons = async (req, res) => {
  try {
    let URL = "https://pokeapi.co/api/v2/pokemon/";
    let allPokemons = [];
    let allPokemonsData = [];
    //limito el for a 3 iteraciones para que traiga 60 pokemons
    for (let i = 0; i < 3; i++) {
      const response = await axios.get(`${URL}`);
      allPokemons = [...allPokemons, ...response.data.results];
      URL = response.data.next;
    }
    //el anterior bucle solo agarra los nombres, este busca la informacion de cada uno
    for (let e = 0; e < allPokemons.length; e++) {
      const dataPokemon = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${allPokemons[e].name}`
      );
      //llamo a pokemonalldata para que me filtre la info que quiero mostrar
      const Data = pokemonalldata(dataPokemon);
      allPokemonsData = [...allPokemonsData, Data];
    }
    // consulta a la base de datos utilizando  modelo pokemo y el metodo findAll
    const dbPokemonsFound = await pokemon.findAll({
      include: {
        model: type,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    });

    //se formatean los resultados de la db con map
    const formattedPokemons = dbPokemonsFound.map((pokemon) => ({
      ...pokemon.toJSON(),
      types: pokemon.types.map((type) => type.name),
    }));

    if (!allPokemonsData)
      //si no hay datos..
      return res
        .status(403)
        .json({ message: "No se encuentran pokemons en la API" });
    return res.status(200).json([...allPokemonsData, ...formattedPokemons]);
  } catch (error) {
    res
      .status(402)
      .json({ message: `Error al traer Pokemons || Error: ${error.message}` });
    // throw Error({ message: 'Error con la API', error })
  }
};
module.exports = getAllPokemons;
