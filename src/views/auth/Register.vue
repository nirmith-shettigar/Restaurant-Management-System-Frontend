<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "../../services/authService";
import { toast, Toaster } from "vue-sonner";

const router = useRouter();

const formData = ref({
    email: "",
    phone: "",
    password: "",
});

const isLoading = ref(false);

const handleRegister = async () => {
    isLoading.value = true;

    try {
        const response = await register(formData.value);

        toast.success("Registration successful! Redirecting...");
        setTimeout(() => {
            router.push("/login");
        }, 2000);
    } catch (error) {
        toast.error(error?.message || "Registration failed. Please try again.");
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-5">
        <Toaster position="top-center" />
        <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h1 class="text-2xl font-bold mb-6 text-center">
                User Registration
            </h1>

            <form @submit.prevent="handleRegister" class="space-y-5">
                <div>
                    <label class="label">Email</label>
                    <input type="email" v-model="formData.email" class="input" />
                </div>

                <div>
                    <label class="label">Phone</label>
                    <input type="tel" v-model="formData.phone" class="input" />
                </div>

                <div>
                    <label class="label">Password</label>
                    <input type="password" v-model="formData.password" class="input" />
                </div>

                <button class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition cursor-pointer"
                    :disabled="isLoading">
                    {{ isLoading ? "Registering..." : "Register" }}
                </button>
            </form>
        </div>
    </div>
</template>