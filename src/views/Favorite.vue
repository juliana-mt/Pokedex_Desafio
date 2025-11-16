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
        :key="pokemon.id"
        :pokemon="pokemon"
        @click="openModal(pokemon)"
      />
    </div>

    <div 
      v-if="selectedPokemon"
      class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
    <div class="bg-slate-900 text-white rounded-2xl p-6 w-full max-w-md shadow-xl">
      <div class="flex flex-col items-center">
        <img :src="selectedPokemon.image" class="w-24" />
        <h2 class="text-2xl font-bold capitalize">{{ selectedPokemon.name }}</h2>
        <p class="uppercase px-3 py-1 mt-2 rounded-full text-white"
          :class="selectedPokemon.type">
            {{ selectedPokemon.type }}
        </p>
        </div>

        <div v-if="!extraInfo" class="text-center mt-6 text-gray-300">
          Carregando...
        </div>

        <div v-else class="mt-6 space-y-4 text-sm">
          <div class="flex gap-16 justify-center">
            <div>
              <h3 class="font-bold">Informações</h3>
              <p><strong>Altura:</strong> {{ extraInfo.height / 10 }} m</p>
              <p><strong>Peso:</strong> {{ extraInfo.weight / 10 }} kg</p>
            </div>
            <div>
              <h3 class="font-bold">Habilidades</h3>
              <ul class="list-disc ml-4">
                <li v-for="a in extraInfo.abilities" :key="a.ability.name">
                  {{ a.ability.name }}
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 class="font-bold text-lg">Status</h3>
            <div v-for="s in extraInfo.stats" :key="s.stat.name" class="mb-2">
              <p class="capitalize">{{ s.stat.name }}: <strong>{{ s.base_stat }}</strong></p>
              <div class="h-2 bg-slate-700 rounded">
                <div
                  class="h-full bg-cyan-500 rounded"
                  :style="{ width: s.base_stat + '%' }"
                ></div>
              </div>
            </div>
            <button
              @click="toggleFavorite(selectedPokemon)"
              class="mt-4 w-full bg-cyan-300 hover:bg-cyan-800 text-black font-bold px-4 py-2 rounded transition cursor-pointer">
              {{ isFavorite ? "Remover dos favoritos" : "Favoritar" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import Card from "../components/Card.vue"
import axios from "axios"

const FAVORITE_KEY = "favoritePokemons"
const pokemonList = ref([])
const loading = ref(true)
const selectedPokemon = ref(null)
const extraInfo = ref(null)

async function openModal(pokemon) {
  selectedPokemon.value = pokemon
  extraInfo.value = null

  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`)
  extraInfo.value = res.data
}

function closeModal() {
  selectedPokemon.value = null
}


function toggleFavorite(pokemon) {
  const saved = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []
  const exists = saved.includes(pokemon.id)

  const updated = exists
    ? saved.filter(id => id !== pokemon.id)
    : [...saved, pokemon.id]

  localStorage.setItem(FAVORITE_KEY, JSON.stringify(updated))

  fetchFavorites()
}

const isFavorite = computed(() => {
  if (!selectedPokemon.value) return false
  const saved = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []
  return saved.includes(selectedPokemon.value.id)
})

const fetchFavorites = async () => {
  loading.value = true

  const saved = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []

  if (saved.length === 0) {
    loading.value = false
    pokemonList.value = []
    return
  }

  const promises = saved.map(async (id) => {
  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
  const data = res.data

    return {
      id: data.id,
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
