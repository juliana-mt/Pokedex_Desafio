<template>
  <div class="flex flex-col items-center py-4">
    <input v-model="search" @input="handleSearch" placeholder="Buscar por nome ou ID..."
      class="border p-2 rounded mb-4 w-72 text-white" />

    <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl">
      <Card 
        v-for="p in paginatedPokemons" 
        :key="p.id" 
        :pokemon="p"
        @click="openModal(p)"
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
            :class="typeColor(selectedPokemon.type)">
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

    <div class="flex justify-center gap-4 p-6">
      <button @click="prevPage" :disabled="currentPage === 1"
        class="bg-cyan-800 text-white rounded hover:bg-sky-950 px-4 py-2 lg:px-12 hover:transition duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
        Voltar
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages"
        class="bg-cyan-800 text-white rounded hover:bg-sky-950 px-4 py-2 lg:px-12  hover:transition duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
        Próximo
      </button>
    </div>

    <span class="text-white mb-6">
      Página {{ currentPage }} / {{ totalPages }}
    </span>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Card from '../components/Cardboard.vue'

const allPokemons = ref([])
const search = ref("")
const currentPage = ref(1)
const itemsPerPage = 20
const selectedPokemon = ref(null)
const extraInfo = ref(null)
const FAVORITE_KEY = "favoritePokemons"
const favoriteList = ref([])

const fetchGen1Pokemons = async () => {
  const requests = []

  for (let id = 1; id <= 151; id++) {
    requests.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`))
  }

  const results = await Promise.all(requests)

  allPokemons.value = results.map(r => {
    const p = r.data
    return {
      id: p.id,
      name: p.name,
      image: p.sprites.other["official-artwork"].front_default,
      type: p.types[0].type.name
    }
  })
}

const filteredPokemons = computed(() => {
  const q = search.value.toLowerCase().trim()

  if (!q) return allPokemons.value

  if (!isNaN(Number(q))) {
    const found = allPokemons.value.find(p => p.id === Number(q))
    return found ? [found] : []
  }

  return allPokemons.value.filter(p =>
    p.name.toLowerCase().includes(q)
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredPokemons.value.length / itemsPerPage)
)

const paginatedPokemons = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredPokemons.value.slice(start, start + itemsPerPage)
})

const typeColor = (type) => {
  const colors = {
    fire: "bg-red-900",
    water: "bg-sky-900",
    grass: "bg-green-900",
    electric: "bg-amber-400",
    psychic: "bg-pink-800",
    ice: "bg-sky-300",
    dragon: "bg-purple-800",
    fairy: "bg-rose-500",
    normal: "bg-gray-700",
    fighting: "bg-orange-700",
    poison: "bg-fuchsia-400",
    ground: "bg-yellow-700",
    rock: "bg-amber-950",
    bug: "bg-lime-700",
    ghost: "bg-purple-950",
    steel: "bg-slate-400",
  };

  return colors[type] || "bg-neutral-400";
};


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

  let updated

  if (exists) {
    updated = saved.filter(id => id !== pokemon.id)
  } else {
    updated = [...saved, pokemon.id]
  }

  favoriteList.value = updated
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(updated))
}

const isFavorite = computed(() => {
  if (!selectedPokemon.value) return false
  return favoriteList.value.includes(selectedPokemon.value.id)
})


const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

onMounted(() => {
  favoriteList.value = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []
})
onMounted(fetchGen1Pokemons)
</script>