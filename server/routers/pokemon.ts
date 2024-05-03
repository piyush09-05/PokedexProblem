import {procedure, router} from "../trpc"
import {z} from "zod";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();



export const PokemonRouter = router({
    getAllPokemon: procedure.query(async () => {
        try {
            const pokemons = await prisma.pokemon.findMany();
            return pokemons;
        } catch (error) {
            console.log("Error" + error);
            return error;
        }
        return await prisma.pokemon.findMany();
    }),
    getPokemon:procedure.input(z.object({name:z.string()}))
    .query(async (opts) => {
        const {input} = opts;
        const pokemon = await prisma.pokemon.findFirst({
            where:{
                name:input.name
            }
        })
        return pokemon;

    }),
    getMultiplePokemons:procedure.input(z.object({names:z.array(z.string())}))
    .query(async (opts) => {
        const {input} = opts;
        const pokemons = await prisma.pokemon.findMany({
            where:{
                name:{
                    in:input.names
                }
            }
        })
        return pokemons;

    }),
    addPokemon:procedure.input(z.object({name:z.string(),types:z.array(z.string()),sprite:z.string()}))
    .mutation(async (opts) => {
        const {input} = opts;
        await prisma.pokemon.create({
            data:{
                name:input.name,
                types:input.types,
                sprite:input.sprite
            }
        })
    }),
    deletePokemon:procedure.mutation(async () => {
        try {
            const deletePokemon = await prisma.pokemon.deleteMany({where:{
                name:""
            }});

             return deletePokemon;
        } catch (error) {
            return error
        }
        
        
    })
})
export type AppRouter = typeof PokemonRouter;
