<template>
  <div class="pagination-controls">
    <button @click="emitChangePage(currentPage - 1)" :disabled="currentPage <= 1">
      &lt; Previous
    </button>
    <button @click="emitChangePage(1)" :disabled="currentPage === 1">1</button>

    <span v-if="currentPage > 3" class="pagination-ellipsis">...</span>
    <button v-if="currentPage > 2" @click="emitChangePage(currentPage - 1)">
      {{ currentPage - 1 }}
    </button>
    <button
      v-if="currentPage > 1 && currentPage < totalPages"
      class="current-page"
      :disabled="true"
    >
      {{ currentPage }}
    </button>
    <button v-if="currentPage < totalPages - 1" @click="emitChangePage(currentPage + 1)">
      {{ currentPage + 1 }}
    </button>
    <span v-if="currentPage < totalPages - 2" class="pagination-ellipsis">...</span>

    <button
      v-if="totalPages > 1"
      @click="emitChangePage(totalPages)"
      :disabled="currentPage === totalPages"
    >
      {{ totalPages }}
    </button>
    <button @click="emitChangePage(Number(currentPage) + 1)" :disabled="currentPage >= totalPages">
      Next &gt;
    </button>
  </div>
</template>

<script setup>
const emits = defineEmits(['changePage'])

const props = defineProps({
  currentPage: Number,
  totalPages: Number
})

function emitChangePage(newPage) {
  emits('changePage', newPage)
}
</script>

<style scoped>
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.pagination-controls button {
  border: 1px solid #cccccc;
  border-radius: 5px;
  background-color: white;
  padding: 8px 16px;
  margin: 0 5px;
  cursor: pointer;
  user-select: none;
}

.pagination-controls button:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.pagination-controls button.current-page,
.pagination-controls button:disabled {
  background-color: black;
  color: white;
  pointer-events: none;
}

.pagination-controls span {
  user-select: none;
}

.pagination-controls .pagination-ellipsis {
  text-align: center;
  padding: 8px 16px;
  margin: 0 5px;
  display: inline-block;
  min-width: 36px;
}

.pagination-controls .pagination-ellipsis {
  cursor: default;
}
</style>
