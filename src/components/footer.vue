<template>
  <footer class="footer">
    <div class="footer-content">
      <p>© {{ new Date().getFullYear() }} SALIP2 - Salão do Livro de Pedro II</p>
      <p>Desenvolvido por Equipe SALIP2</p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  width: 100%;
  background-color: #f9f9f9;
  border-top: 1px solid #e0e0e0;
  padding: 1rem 1.5rem;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #555;
}

.footer-content {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

@media (max-width: 600px) {
  .footer {
    font-size: 0.8rem;
  }
}
</style>
