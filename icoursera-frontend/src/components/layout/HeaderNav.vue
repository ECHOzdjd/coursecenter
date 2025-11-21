<template>
  <nav class="navbar">
    <div class="nav-content">
      <div class="logo">
        <i class="fas fa-graduation-cap"></i>
        iCoursera
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-link">课程中心</router-link>
        <a href="#" class="nav-link">学习社区</a>
      </div>
      <div class="user-actions">
        <div class="avatar">张</div>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 20px;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #1a73e8;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-link {
  text-decoration: none;
  color: #202124;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.nav-link.router-link-active,
.nav-link:hover {
  background: #e8f0fe;
  color: #1a73e8;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1a73e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>