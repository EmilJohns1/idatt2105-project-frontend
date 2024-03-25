<template>
    <div class="login-container">
        <h1>Log in</h1>
        <h2>Enter your email and password to log in to this app</h2>
        <form @submit.prevent="logInForm">
            <TextInputComponent
                v-model="email"
                placeholder="Email"
                type="email"
            />
            <TextInputComponent
                v-model="password"
                placeholder="Password"
                type="password"
            />
            <ButtonComponent type="submit">Log in</ButtonComponent>
        </form>
    </div>
</template>

<script setup>
import TextInputComponent from '@/components/TextInputComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';

const email = ref('');
const password = ref('');

const loginForm = () => {
    //TODO: Implement login functionality
    console.log('Email:', email.value, 'Password:', password.value);
}
</script>

<style>

</style>
