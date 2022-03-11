<script lang="ts" setup>
const emits = defineEmits(['close', 'open', 'confirm', 'update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

const close = () => {
  emits('close')
  emits('update:modelValue', false)
}

</script>
<template>
  <div
    v-show="props.modelValue"
    class="fixed justify-center items-center h-modal md:h-full md:inset-0 flex"
    z="50"
    right="0"
    left="0"
    top="4"
    bg="gray-400 opacity-80 dark:gray-600 dark:opacity-80"
    overflow="y-auto x-hidden"
  >
    <div class="relative px-4 w-full max-w-md h-full md:h-auto">
      <div
        class="relative rounded-lg shadow"
        bg="white dark:gray-700"
      >
        <div
          class="flex justify-between items-center rounded-t"
          p="y-4 x-6"
          border="b gray-200 dark:gray-600"
        >
          <h3 class="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
            {{ title }}
          </h3>
          <button
            type="button"
            class="rounded-lg p-1.5 ml-auto inline-flex items-center  "
            text="sm gray-400 hover:gray-900 dark:hover:white"
            data-modal-toggle="walletModal"
            bg="transparent hover:gray-200 dark:hover:gray-600"
            @click="close"
          >
            <div i-ic:baseline-close />
          </button>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>
