<template>
  <div class="flex flex-col items-center py-4">
    <input v-model="search" @input="handleSearch" placeholder="Buscar por nome ou ID..."
      class="border p-2 rounded mb-4 w-72 text-white" />

    <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl">
      <Card v-for="p in paginatedPokemons" :key="p.id" :pokemon="p" />
    </div>

    <div class="flex justify-center gap-4 p-6">
      <button @click="prevPage" :disabled="currentPage === 1"
        class="bg-cyan-800 text-white rounded hover:bg-sky-950 px-4 py-2 lg:px-12 cursor-pointer hover:transition duration-300 disabled:opacity-40">
        Voltar
      </button>

      <button @click="nextPage" :disabled="currentPage === totalPages"
        class="bg-cyan-800 text-white rounded hover:bg-sky-950 px-4 py-2 lg:px-12 cursor-pointer hover:transition duration-300 disabled:opacity-40">
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
import Card from '../components/card.vue'

const allPokemons = ref([])
const search = ref("")
const currentPage = ref(1)
const itemsPerPage = 20

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
      image: p.sprites.other.dream_world.front_default,
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

onMounted(fetchGen1Pokemons)

</script>
