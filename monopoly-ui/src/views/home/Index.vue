<template>
    <div class="home">
        <h1>Welcome to Monopoly Game!</h1>
        <p>
        This is the home page of the Monopoly Game. Please click the button below to start playing.
        </p>
        <button @click="$router.push('/game')">Start Game</button>
    </div>
</template>
<script>
export default {
  name: 'HomeIndex',
  props: {
  }
}
</script>