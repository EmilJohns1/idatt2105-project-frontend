<script setup>
import Explore from '../components/Explore.vue';
import NavBar from '../components/NavBar.vue';
</script>

<template>
    <main>
  
        <Explore />
    </main>
</template>

<style>
.main {
    display: flex;
    flex-direction: column;
}

.nav-bar {
    width: 100%;
}

.explore {
    flex-grow: 1;

}
</style>