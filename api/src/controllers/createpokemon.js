//se importa los modelos y se  asigna type a la var TYPE
const { pokemon, type } = require("../db");
const TYPE = type;

//funcion asincrona, recibe req y res. dentro del trycatch desestrctura req body
const createPokemon = async (req, res) => {
  try {
    const {
      name,
      height,
      image,
      thumbnailImage,
      hp,
      attack,
      defense,
      specialAttack,
      specialDefense,
      speed,
      weight,
      type,
    } = req.body;

    //verifica si existe  el pokemon, isi existe tira error
    const pokeFound = await pokemon.findOne({ where: { name } });
    if (pokeFound)
      return res
        .status(400)
        .json({ message: `Ese pokemon ya existe en la base de datos` });

    // si no existe pokemon, se rea nuevo registro con findorcreate del modelo pokemon
    const newpokemon = await pokemon.findOrCreate({
      where: {
        name,
        height,
        image,
        thumbnailImage,
        hp,
        attack,
        defense,
        specialAttack,
        specialDefense,
        speed,
        weight,
      },
    });
    console.log(newpokemon);

    //este bucle es para las relaciones y se utiliza addtypes para la relacion entre el pokemon y el tipo
    for (let i = 0; i < type.length; i++) {
      const typedb = await TYPE.findOne({ where: { name: type[i] } });
      newpokemon[0].addTypes(typedb);
    }
    res.status(200).json(newpokemon[0]);
  } catch (error) {
    res.status(408).send({
      message: `Error al crear el Pokemons || Error: ${error.message}`,
    });
  }
};
module.exports = createPokemon;
