<template>
  <el-form-item :label="i18nt('designer.setting.format')">
    <el-select v-model="optionModel.format"  @change="formatChange">
      <el-option label="年-月-日" value="YYYY-MM-DD"></el-option>
      <el-option label="年-月" value="YYYY-MM"></el-option>
      <el-option label="年-月-日 时:分" value="YYYY-MM-DD HH:mm"></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "date-range-format-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    methods:{
        formatChange(val){
          switch (val) {
            case 'YYYY-MM-DD':
            this.optionModel.type = 'daterange'
            break;

            // case 'YYYY':
            // this.optionModel.type = 'year'
            // break;

            case 'YYYY-MM':
            this.optionModel.type = 'monthrange'
            break;

            case 'YYYY-MM-DD HH:mm':
            this.optionModel.type = 'datetimerange'
            break;

            default:
              this.optionModel.type = 'daterange'
              break;
          }
        }
    }
  }
</script>

<style scoped>

</style>
