<template>
  <div>
    <div class="header-wrapper">
      <Header />
    </div>

    <!-- Main content -->
    <div class="slot">
      <slot />
    </div>
  </div>
</template>

<style scoped>

/* Adjust layout spacing */
.header-wrapper {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}

/* Content offset to avoid overlap */
.slot {
  margin-top: 50px;
  position: relative;
  padding: 16px;
}
</style>
