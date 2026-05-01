<template>
  <section class="help-center">
    <div class="help-container">
      
      <div class="help-grid">
        <div class="help-info">
          <span class="help-tag">Inscrições abertas</span>
          <h2 class="help-title">Garanta sua participação</h2>
          <p class="help-text">
            O Salão do Livro de Pedro II é gratuito. Inscreva-se para garantir seu certificado e acesso às oficinas.
          </p>
          
          <div class="help-meta">
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>07 a 09 de Maio</span>
            </div>
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>Pedro II, Piauí</span>
            </div>
          </div>
        </div>

        <div class="help-actions">
          <a href="/addUser" class="btn-main">
            Quero me inscrever
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
          
          <div class="support-box">
            <p>Ficou com alguma dúvida?</p>
            <a href="https://wa.link/sg68qw" target="_blank" class="btn-support">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              Suporte via WhatsApp
            </a>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.help-center {
  --primary: #0D1B5E;
  --accent: #00C2A8;
  --text: #334155;
  --bg-light: #f8fafc;
  
  padding: 4rem 1.5rem;
  background-color: white;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  font-family: 'Inter', sans-serif;
}

.help-container {
  max-width: 1000px;
  margin: 0 auto;
}

.help-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 3rem;
  align-items: center;
}

/* Info Side */
.help-tag {
  color: var(--accent);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
  display: block;
}

.help-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary);
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.help-text {
  font-size: 1.1rem;
  color: var(--text);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.help-meta {
  display: flex;
  gap: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Action Side */
.help-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.btn-main {
  background: var(--primary);
  color: white;
  padding: 1.25rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(13, 27, 94, 0.15);
}

.btn-main:hover {
  background: #162a8c;
  transform: translateY(-2px);
}

.support-box {
  background: var(--bg-light);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 1px dashed #cbd5e1;
}

.support-box p {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary);
}

.btn-support {
  color: var(--accent);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.2s;
}

.btn-support:hover {
  text-decoration: underline;
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 850px) {
  .help-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    text-align: center;
  }
  
  .help-meta {
    justify-content: center;
  }
  
  .help-title {
    font-size: 1.75rem;
  }
}
</style>