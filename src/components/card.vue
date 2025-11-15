<template>
  <div class="p-2">
    <div class="rounded-lg p-4 text-white shadow-md bg-slate-950 cursor-pointer hover:bg-gray-950 hover:shadow-lg duration-300 hover:scale-110">
      <img :src="pokemon.image" :alt="pokemon.name" class="mx-auto mb-2 h-20">
      <h2 class="text-center capitalize font-bold">{{ pokemon.name }}</h2>
      <p class="text-center text-sm uppercase">{{ pokemon.type }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  pokemon: Object
})
</script>

