<!--
/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: https://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
-->

<template>
  <container-wrapper :designer="designer" :widget="widget" :parent-widget="parentWidget" :parent-list="parentList"
                     :index-of-parent-list="indexOfParentList">
    <div :key="widget.id" class="table-container"
         :class="[selected ? 'selected' : '', customClass]" @click.stop="selectWidget(widget)">
      <table class="table-layout">
        <tbody>
        <tr v-for="(row, rowIdx) in widget.rows" :key="row.id" tabindex="1"  @keydown.ctrl.stop="keydownCtrl">
          <template v-for="(colWidget, colIdx) in row.cols">
            <table-cell-widget v-if="!colWidget.merged" :widget="colWidget" :designer="designer"
                               :key="colWidget.id" :id="colWidget.id" :parent-list="widget.cols"
                               :row-index="rowIdx" :row-length="widget.rows.length"
                               :col-index="colIdx" :col-length="row.cols.length"
                               :col-array="row.cols" :row-array="widget.rows"
                               :parent-widget="widget" @copyOrStick="copyOrStick"></table-cell-widget>
          </template>
        </tr>
        </tbody>
      </table>
    </div>

  </container-wrapper>
</template>

<script>
  import i18n from "@/utils/i18n"
  import containerMixin from "@/components/form-designer/form-widget/container-widget/containerMixin"
  import ContainerWrapper from "@/components/form-designer/form-widget/container-widget/container-wrapper"
  import TableCellWidget from "@/components/form-designer/form-widget/container-widget/table-cell-widget"
  
  
  export default {
    name: "table-widget",
    componentName: 'ContainerWidget',
    mixins: [i18n, containerMixin],
    components: {
      ContainerWrapper,
      TableCellWidget,
    },
    props: {
      widget: Object,
      parentWidget: Object,
      parentList: Array,
      indexOfParentList: Number,
      designer: Object,
    },
    
    data() {
        return {
            rowData: {}
        }
    },
    computed: {
      selected() {
        return this.widget.id === this.designer.selectedId
      },

      customClass() {
        return this.widget.options.customClass || ''
      },

    },
    watch: {
      //
    },
    mounted() {
    },
    methods: {
        keydownCtrl(e) {
            if(e.key === 'c') {
                this.copyData = JSON.parse(JSON.stringify((this.rowData)))
            } else if (e.key === 'v') {
                this.stickData = JSON.parse(JSON.stringify((this.rowData)))
                this.widget.rows.forEach(item => {
                    item.cols.forEach(subItem =>{
                        if(subItem.id === this.stickData.id) {
                            subItem.widgetList = this.copyData.widgetList
                        }
                    })
                })
            }
        },
        copyOrStick(val) {
            this.rowData = val
        }
    }
  }
</script>

<style lang="scss" scoped>
  div.table-container {
    padding: 5px;
    border: 1px dashed #336699;
    box-sizing: border-box;

    table.table-layout {
      width: 100%;
      text-align: center;
      //border: 1px solid #c8ebfb;
      border-collapse: collapse;
      table-layout: fixed;

      :deep(td) {
        height: 48px;
        border: 1px dashed #336699;
        padding: 3px;
        display: table-cell;
      }

      .form-widget-list {
        border: 1px dashed #336699;
        min-height: 36px;
      }
    }
  }

  .table-container.selected {
    outline: 2px solid $--color-primary !important;
  }

</style>
