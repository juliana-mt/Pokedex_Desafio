<template>
  <div @click="$emit('click')" class="p-2 group">
    <div
      class="rounded-xl p-6 text-white shadow-md bg-slate-950 cursor-pointer hover:bg-slate-800 hover:shadow-xl transition duration-200"
      @click="toggleExpand"
    >
      <img
        :src="pokemon.image"
        :alt="pokemon.name"
        class="mx-auto mb-2 size-40 transition"
        :class="{ 'scale-110': isExpanded }">
      <h2 class="text-center capitalize font-bold">{{ pokemon.name }}</h2>

      <p class="text-center text-sm uppercase py-1 px-2 mt-1 rounded-full font-bold"
      :class="typeColor(pokemon.type)">
        {{ pokemon.type }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  pokemon: Object
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


const isExpanded = ref(false)
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const FAVORITE_KEY = "favoritePokemons"

const isFavorite = ref(false)

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []
  isFavorite.value = saved.includes(props.pokemon.name)
})

</script>
