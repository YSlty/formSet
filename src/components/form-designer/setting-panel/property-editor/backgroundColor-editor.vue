<template>
  <el-form-item :label="'背景颜色'">
    <el-color-picker v-model="optionModel.backgroundColor" />
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "backgroundColor-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    computed: {
      noLabelSetting() {
        return true
        //|| (this.selectedWidget.type === 'divider')
      },

    }
  }
</script>

<style lang="scss" scoped>
  .radio-group-custom {
    :deep(.el-radio-button__inner) {
      padding-left: 12px;
      padding-right: 12px;
    }
  }
</style>
