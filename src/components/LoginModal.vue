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
<button class="btn btn-primary w-100" type="submit">登入</button>
</form>
</div>
</div>
</div>
</div>
</template>


<script setup>
import { ref } from 'vue'


const email = ref('')
const password = ref('')


function onSubmit() {
// 先行示意：實務上改由 API 與後端串接
alert(`登入成功：${email.value}`)
}
</script>
