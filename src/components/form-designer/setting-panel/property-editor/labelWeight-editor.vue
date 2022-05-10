<template>
  <el-form-item :label="'加粗'" v-if="!noLabelSetting && (selectedWidget.type !== 'button')">
    <el-switch v-model="optionModel.labelWeight" />
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "labelWeight-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    computed: {
      noLabelSetting() {
        return (this.selectedWidget.type === 'html-text')
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
