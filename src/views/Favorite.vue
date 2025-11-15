<template>
  <div class="px-8 py-4">
    <h1 class="text-3xl font-bold text-white mb-6">Seus Pokémons favoritos</h1>

    <div v-if="loading" class="text-white text-lg">Carregando favoritos...</div>

    <div v-else-if="pokemonList.length === 0" class="text-neutral-400 text-sm">
        <p>Nenhum Pokémon foi favoritado ainda.</p> 
        <p>Favorite seus pokemons na tela <router-link to="/" class="underline hover:text-white hover:transition duration-300">Home</router-link></p>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <Card
        v-for="pokemon in pokemonList"
        :key="pokemon.name"
        :pokemon="pokemon"
      />
    </div>
  </div>
  
</template>

<script setup>
import { ref, onMounted } from "vue"
import Card from "../components/Card.vue"

const FAVORITE_KEY = "favoritePokemons"
const pokemonList = ref([])
const loading = ref(true)

const fetchFavorites = async () => {
  loading.value = true

  const saved = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []

  if (saved.length === 0) {
    loading.value = false
    pokemonList.value = []
    return
  }

    const promises = saved.map(async (id) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const data = await res.json()

    return {
      name: data.name,
      type: data.types[0].type.name,
      image: data.sprites.other["official-artwork"].front_default
    }
  })

  pokemonList.value = await Promise.all(promises)
  loading.value = false
}

onMounted(fetchFavorites)
</script>
