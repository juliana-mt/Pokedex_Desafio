<template>
  <div class="p-2 group">
    <div class="rounded-xl p-6 text-white shadow-md bg-slate-950 cursor-pointer hover:bg-slate-800 hover:shadow-xl transition duration-200">
      <img :src="pokemon.image" :alt="pokemon.name" class="mx-auto mb-2 size-40 group-hover:scale-105 transition">
      <h2 class="text-center capitalize font-bold">{{ pokemon.name }}</h2>
      <p class="text-center text-sm uppercase bg-slate-500 py-1 px-2 mt-1 rounded-full font-bold">{{ pokemon.type }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  pokemon: Object
})
</script>

