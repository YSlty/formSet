<template>
  <!-- <el-form-item :label="i18nt('designer.setting.multiple')">
    <el-switch v-model="optionModel.multiple" @change="onMultipleSelected"></el-switch>
  </el-form-item> -->
</template>

<script>
  import i18n from "@/utils/i18n"
  // import propertyMixin from "@/components/form-designer/setting-panel/property-editor/propertyMixin"

  export default {
    name: "multiple-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    methods: {
        onMultipleSelected(val) {
          if (val) {
            this.optionModel.defaultValue = ''  //清空原默认值!!
          } else {
            if (!!this.optionModel.defaultValue && (this.optionModel.defaultValue.length > 0)) {
              this.optionModel.defaultValue = this.optionModel.defaultValue[0]
            } else {
              this.optionModel.defaultValue = ''
            }
          }
        },
    }
  }
</script>

<style scoped>

</style>
