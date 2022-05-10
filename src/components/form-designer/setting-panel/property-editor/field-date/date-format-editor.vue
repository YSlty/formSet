<template>
  <el-form-item :label="i18nt('designer.setting.format')">
    <el-select v-model="optionModel.format" @change="formatChange">
      <el-option label="年-月-日" value="YYYY-MM-DD"></el-option>
      <el-option label="年" value="YYYY"></el-option>
      <el-option label="年-月" value="YYYY-MM"></el-option>
      <el-option label="年-月-日 时:分" value="YYYY-MM-DD HH:mm"></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "date-format-editor",
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
            this.optionModel.type = 'date'
            break;

            case 'YYYY':
            this.optionModel.type = 'year'
            break;

            case 'YYYY-MM':
            this.optionModel.type = 'month'
            break;

            case 'YYYY-MM-DD HH:mm':
            this.optionModel.type = 'datetime'
            break;

            default:
              this.optionModel.type = 'date'
              break;
          }
        }
    }
  }
</script>

<style scoped>

</style>
