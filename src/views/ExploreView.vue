<script setup>
import ExploreItem from '../components/ExploreItem.vue';
</script>

<template>
    <main>
  
        <ExploreItem />
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