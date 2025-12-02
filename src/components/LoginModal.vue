<template>
<div class="modal fade" id="loginModal" tabindex="-1" aria-hidden="true">
<div class="modal-dialog modal-dialog-centered">
<div class="modal-content">
<div class="modal-header">
<h5 class="modal-title">會員登入</h5>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body">
<form @submit.prevent="onSubmit">
<div class="mb-3">
<label class="form-label">Email</label>
<input v-model="email" type="email" class="form-control" required />
</div>
<div class="mb-3">
<label class="form-label">密碼</label>
<input v-model="password" type="password" class="form-control" required />
</div>
<div v-if="errorMessage" class="alert alert-danger" role="alert">
  {{ errorMessage }}
</div>
<button class="btn btn-primary w-100" type="submit" :disabled="isLoading">
  {{ isLoading ? '驗證中...' : '登入' }}
</button>
</form>
</div>
</div>
</div>
</div>
</template>


<script setup>
import { computed, onMounted, ref } from 'vue'
import auth from '../stores/authStore'

const email = ref('')
const password = ref('')
const isLoading = computed(() => auth.state.loading)
const errorMessage = computed(() => auth.state.error)
let modalInstance = null

onMounted(() => {
  const modalEl = document.getElementById('loginModal')
  if (modalEl && window.bootstrap?.Modal) {
    modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalEl)
  }
})

async function onSubmit() {
  try {
    await auth.login(email.value, password.value)
    password.value = ''
    modalInstance?.hide()
  } catch (err) {
    // error handled by store
  }
}
</script>
