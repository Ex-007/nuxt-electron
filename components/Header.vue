<template>
  <div class="custom">
    <div class="headd">
        <h1>APP NAME</h1>
    </div>
    <div class="buttons">
        <button @click="minimize">_</button>
        <button @click="maximize">[]</button>
        <button @click="close" class="close">×</button>
    </div>
  </div>
</template>

<script setup>
const minimize = () => window.electronAPI?.minimize()
const maximize = () => window.electronAPI?.maximize()
const close = () => window.electronAPI?.close()
</script>

<style scoped>
.custom{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 10px;
    background-color: black;
    color: white;
    position: fixed;
    width: 100%;
}
.buttons{
    display: flex;
    gap: 10px;
}

.buttons>button{
    width: 20px;
    cursor: pointer;
    border: none;
    height: 20px;
}
.close{
    background: red;
    color: white;
}
.headd{
    display: flex;
    gap: 10px;
    width: 100%;
}
.headd>button{
    height: 30px;
    width: 100px;
    cursor: pointer;
    border: none;
}

.headd>h1{
    color: white;
}
.headd>button:hover{
    background-color: rgb(87, 123, 123);
    color: white;
}
</style>
