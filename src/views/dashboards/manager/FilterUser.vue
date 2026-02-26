<template>
  <div>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
    >
      <option value="">All Roles</option>
      <option value="chef">Chef</option>
      <option value="waiter">Waiter</option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: String 
  }
};
</script>