<template>
  <div class="px-8">
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <Card
        v-for="p in pokemons"
        :key="p.name"
        :pokemon="p"
      />
    </div>
    <div class="flex justify-center gap-4 p-6">
      <button @click="beforePokemons" :disabled="offset === 0" class="bg-cyan-800 text-white rounded hover:bg-sky-950 px-4 py-2 lg:px-12 cursor-pointer hover:transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">Voltar</button>
      <button @click="nextPokemons" class="bg-cyan-800 text-white rounded hover:bg-sky-950 px-4 py-2 lg:px-12 cursor-pointer hover:transition duration-300">Próximo</button>
    </div>
  </div>
</template>

<script setup>

import {ref,onMounted } from 'vue'
import axios from 'axios'
import Card from '../components/card.vue';

const pokemons = ref([])
const offset = ref(0)
const limit = 12

const fetchPokemons = async () =>{
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset.value}&limit=${limit}`)
  const results = response.data.results
  
  console.log(results)

  const detailed = await Promise.all(
      results.map(pokemon => axios.get(pokemon.url).then(response => response.data))
    )

  console.log(detailed)

  pokemons.value = detailed.map(pokemon => ({
    name: pokemon.name,
    image: pokemon.sprites.other.dream_world.front_default,
    type: pokemon.types[0].type.name
  }))

  console.log(pokemons)
}

const nextPokemons = () => {
  offset.value += limit
  fetchPokemons()
}

const beforePokemons = () => {
  if(offset.value >= limit) {
    offset.value -= limit
    fetchPokemons()
  }
}

onMounted(fetchPokemons)

</script>

<style>
</style>
