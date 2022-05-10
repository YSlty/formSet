<template>
  <el-form-item label="边框类型">
    <el-radio-group v-model="optionModel.borderType">
      <el-radio :label="1">实线</el-radio>
      <el-radio :label="2">虚线</el-radio>
      <el-radio :label="0">无</el-radio>
    </el-radio-group>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "border-type-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
  }
</script>

<style scoped>

</style>
