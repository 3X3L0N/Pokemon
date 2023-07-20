const { pokemon } = require("../db");

//funcion asincrona que tiene un id  utilizando req params  que es para identificar el pokemon a eliminar
const deletePokemon = async (req, res) => {
  try {
    const { id } = req.params;
    //utilizo metodo destroy del modelo pokemon para eliminar el id proporcionado
    const deleted = await pokemon.destroy({ where: { id } });
    console.log(deleted); // imprimo en consola y si se elimino la fila
    if (deleted === 1)
      return res.status(200).send("Pokemon eliminado correctamente");
    return res.status(400).json({
      message: `Error al eliminar el Pokemon || Error: ${error.message}`,
    });
  } catch (error) {
    res.status(400).json({
      message: `Error al eliminar el Pokemon || Error: ${error.message}`,
    });
  }
};

module.exports = deletePokemon;

/*En resumen, este código muestra una función que elimina un registro de Pokémon de la base de datos utilizando el modelo pokemon. Se verifica si se eliminó correctamente y se envía la respuesta correspondiente.*/
