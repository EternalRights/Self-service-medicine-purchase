<template>
  <div class="auth-layout">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>

<style scoped>
.auth-layout {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background-color: #F5F7FA;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
}
</style>