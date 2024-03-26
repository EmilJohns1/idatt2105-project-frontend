<template>
    <div class="explore-container">
        <h1>Explore</h1>
        <p>Choose your desired subject to start.</p>
        <div class="category-grid">
            <CategoryCard
                image="/categoryimage/all.png"
                title="All"
                description="This contains all quizzes"
                />
            <CategoryCard
                image="/categoryimage/biology.png"
                title="Biology"
                description="This contains all Biology quizzes"
                />
            <CategoryCard
                image="/categoryimage/chemistry.png"
                title="Chemistry"
                description="This contains all chemistry quizzes"
                />
            <CategoryCard
                image="/categoryimage/english.png"
                title="English"
                description="This contains all english quizzes"
                />
            <CategoryCard
                image="/categoryimage/maths.png"
                title="Maths"
                description="This contains all math quizzes"
                />
            <CategoryCard
                image="/categoryimage/physics.png"
                title="Physics"
                description="This contains all physics quizzes"
                />
            <CategoryCard
                image="/categoryimage/science.png"
                title="science"
                description="This contains all science quizzes"
                />
        </div>
    </div>
</template>

<script setup>
import CategoryCard from '../components/CategoryCardItem.vue';
</script>

<style>
.explore-container {
    padding: 40px; 
    margin-top: 60px;
    margin-bottom: 60px; 
}

.category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); 
    gap: 40px; 
    justify-content: center; 
    align-items: start; 
}
</style>