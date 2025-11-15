<template>
    <div class="bg-slate-950 text-left text-white px-12 py-8 flex justify-between items-center">
        <div class="flex font-bold text-3xl md:">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png" alt="logo" class="h-10 w-auto ">
            <h1>Pokédex</h1>
        </div>
        <div class="flex gap-6">
            <h1><router-link to="/" class=" text-neutral-400 hover:underline hover:text-white hover:transition duration-300">Home</router-link></h1>
            <h1><router-link to="/Favorite" class=" text-neutral-400 hover:underline hover:text-white hover:transition duration-300">Favoritos</router-link></h1>
        </div>
    </div>
    <div class="relative p-2 flex items-center gap-2 ">
        <img 
          src="../assets/search.png"
          class="w-auto h-6 pl-2 absolute left-3 top-1/2 -translate-y-1/2"
        />

        <input
          v-model="search"
          @keyup.enter="emitSearch"
          placeholder="Buscar por nome ou ID..."
          class="pl-12 pr-3 py-2 text-gray-400 border rounded-lg border-gray-700 focus:border-white focus:outline-none transition focus:text-white"
        />
    </div>
</template>

<script setup>

</script>