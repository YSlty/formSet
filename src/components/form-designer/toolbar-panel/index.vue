<template>
    <div class="toolbar-container">
        <div class="left-toolbar">
            <!-- <el-button type="text" :disabled="undoDisabled" @click="undoHistory">
                <svg-icon icon-class="undo" />
            </el-button>
            <el-button type="text" :disabled="redoDisabled" @click="redoHistory">
                <svg-icon icon-class="redo" />
            </el-button> -->
            <!-- <el-button-group style="margin-left: 20px">
                <el-button :type="layoutType === 'PC' ? 'info': ''" @click="changeLayoutType('PC')">
                    {{i18nt('designer.toolbar.pcLayout')}}
                </el-button>
                <el-button :type="layoutType === 'Pad' ? 'info': ''" @click="changeLayoutType('Pad')">
                    {{i18nt('designer.toolbar.padLayout')}}
                </el-button>
                <el-button :type="layoutType === 'H5' ? 'info': ''" @click="changeLayoutType('H5')">
                    {{i18nt('designer.toolbar.mobileLayout')}}
                </el-button>
            </el-button-group>
            <el-button style="margin-left: 20px" :title="i18nt('designer.toolbar.nodeTreeHint')" @click="showNodeTreeDrawer">
            <svg-icon icon-class="node-tree" /></el-button> -->
        </div>

        <el-drawer
            :title="i18nt('designer.toolbar.nodeTreeTitle')"
            direction="ltr"
            v-model="showNodeTreeDrawerFlag"
            :modal="true"
            :size="280"
            :destroy-on-close="true"
            custom-class="node-tree-drawer">
            <el-tree
                ref="nodeTree"
                :data="nodeTreeData"
                node-key="id"
                default-expand-all
                highlight-current
                class="node-tree"
                icon-class="el-icon-arrow-right"
                @node-click="onNodeTreeClick"></el-tree>
        </el-drawer>
        <div class="right-toolbar">
            <!-- <el-button v-if="showToolButton('clearDesignerButton')" type="text" @click="clearFormWidget">
            <svg-icon icon-class="el-delete" />清空</el-button> -->
            <el-button type="text" @click="previewForm"><svg-icon icon-class="el-view" />预览</el-button>
            <el-button type="text" @click="exportJson"><svg-icon icon-class="save" />保存</el-button>
        </div>

        <div v-if="showPreviewDialogFlag" class="" v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']">
            <el-dialog
                :title="editFormData.name"
                v-model="showPreviewDialogFlag"
                :show-close="true"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                center
                :destroy-on-close="true"
                custom-class="drag-dialog small-padding-dialog"
                width="50%">
                <div>
                    <div class="form-render-wrapper">
                        <VFormRender
                            ref="preForm"
                            :form-json="formJson"
                            :form-data="testFormData"
                            :preview-state="true"
                            :option-data="testOptionData"
                            @appendButtonClick="testOnAppendButtonClick"
                            @buttonClick="testOnButtonClick"
                            @formChange="handleFormChange">
                        </VFormRender>
                    </div>
                </div>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="showPreviewDialogFlag = false">关闭</el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import VFormRender from '@/components/form-render/index'
import CodeEditor from '@/components/code-editor/index'
import Clipboard from 'clipboard'
import {
    deepClone,
    copyToClipboard,
    generateId,
    getQueryParam,
    traverseAllWidgets
} from '@/utils/util'
import i18n from '@/utils/i18n'
import { generateCode } from '@/utils/code-generator'
import { genSFC } from '@/utils/sfc-generator'
import loadBeautifier from '@/utils/beautifierLoader'
import { saveAs } from 'file-saver'
import axios from 'axios'

export default {
    name: 'ToolbarPanel',
    mixins: [i18n],
    components: {
        VFormRender,
        CodeEditor,
        Clipboard
    },
    props: {
        designer: Object,

        // 外部传入数据
        editFormData: {
            type: Object,
            default: null
        }
    },
    inject: ['getDesignerConfig'],
    data() {
        return {
            designerConfig: this.getDesignerConfig(),

            showPreviewDialogFlag: false,
            showImportJsonDialogFlag: false,
            showExportJsonDialogFlag: false,
            showExportCodeDialogFlag: false,
            showFormDataDialogFlag: false,
            showExportSFCDialogFlag: false,
            showNodeTreeDrawerFlag: false,

            nodeTreeData: [],

            importTemplate: '',
            jsonContent: '',
            jsonRawContent: '',

            formDataJson: '',
            formDataRawJson: '',

            vueCode: '',
            htmlCode: '',

            sfcCode: '',
            sfcCodeV3: '',

            activeCodeTab: 'vue',
            activeSFCTab: 'vue2',

            testFormData: {
                // 'userName': '666888',
                // 'productItems': [
                //   {'pName': 'iPhone12', 'pNum': 10},
                //   {'pName': 'P50', 'pNum': 16},
                // ]

                'select62173': 2
            },
            testOptionData: {
                'select62173': [
                    { label: '01', value: 1 },
                    { label: '22', value: 2 },
                    { label: '333', value: 3 }
                ]
            }

        }
    },
    computed: {
        formJson() {
            return {
                widgetList: this.designer.widgetList,
                formConfig: this.designer.formConfig
            }
        },

        undoDisabled() {
            return !this.designer.undoEnabled()
        },

        redoDisabled() {
            return !this.designer.redoEnabled()
        },

        layoutType() {
            return this.designer.getLayoutType()
        }

    },
    watch: {
        'designer.widgetList': {
            deep: true,
            handler(val) {
                // console.log('test-----', val)
                // this.refreshNodeTree()
            }
        }

    },
    methods: {
        showToolButton(configName) {
            if (this.designerConfig[configName] === undefined) {
                return true
            }

            return !!this.designerConfig[configName]
        },

        buildTreeNodeOfWidget(widget, treeNode) {
            const curNode = {
                id: widget.id,
                label: widget.options.label || widget.type
                // selectable: true,
            }
            treeNode.push(curNode)

            if (widget.category === undefined) {
                return
            }

            curNode.children = []
            if (widget.type === 'grid') {
                widget.cols.map(col => {
                    const colNode = {
                        id: col.id,
                        label: col.options.name || widget.type,
                        children: []
                    }
                    curNode.children.push(colNode)
                    col.widgetList.map(wChild => {
                        this.buildTreeNodeOfWidget(wChild, colNode.children)
                    })
                })
            } else if (widget.type === 'table') {
                // TODO: 需要考虑合并单元格！！
                widget.rows.map(row => {
                    const rowNode = {
                        id: row.id,
                        label: 'table-row',
                        selectable: false,
                        children: []
                    }
                    curNode.children.push(rowNode)

                    row.cols.map(cell => {
                        if (cell.merged) { // 跳过合并单元格！！
                            return
                        }

                        const rowChildren = rowNode.children
                        const cellNode = {
                            id: cell.id,
                            label: 'table-cell',
                            children: []
                        }
                        rowChildren.push(cellNode)

                        cell.widgetList.map(wChild => {
                            this.buildTreeNodeOfWidget(wChild, cellNode.children)
                        })
                    })
                })
            } else if (widget.type === 'tab') {
                widget.tabs.map(tab => {
                    const tabNode = {
                        id: tab.id,
                        label: tab.options.name || widget.type,
                        selectable: false,
                        children: []
                    }
                    curNode.children.push(tabNode)
                    tab.widgetList.map(wChild => {
                        this.buildTreeNodeOfWidget(wChild, tabNode.children)
                    })
                })
            } else if (widget.type === 'sub-form') {
                widget.widgetList.map(wChild => {
                    this.buildTreeNodeOfWidget(wChild, curNode.children)
                })
            } else if (widget.category === 'container') { // 自定义容器
                widget.widgetList.map(wChild => {
                    this.buildTreeNodeOfWidget(wChild, curNode.children)
                })
            }
        },

        refreshNodeTree() {
            this.nodeTreeData.length = 0
            this.designer.widgetList.forEach(wItem => {
                this.buildTreeNodeOfWidget(wItem, this.nodeTreeData)
            })
        },

        showNodeTreeDrawer() {
            this.refreshNodeTree()
            this.showNodeTreeDrawerFlag = true
            this.$nextTick(() => {
                if (this.designer.selectedId) { // 同步当前选中组件到节点树！！！
                    this.$refs.nodeTree.setCurrentKey(this.designer.selectedId)
                }
            })
        },

        undoHistory() {
            this.designer.undoHistoryStep()
        },

        redoHistory() {
            this.designer.redoHistoryStep()
        },

        changeLayoutType(newType) {
            this.designer.changeLayoutType(newType)
        },

        clearFormWidget() {
            this.designer.clearDesigner()
        },

        previewForm() {
            this.showPreviewDialogFlag = true
        },

        saveAsFile(fileContent, defaultFileName) {
            this.$prompt(this.i18nt('designer.hint.fileNameForSave'), this.i18nt('designer.hint.saveFileTitle'), {
                inputValue: defaultFileName,
                closeOnClickModal: false,
                inputPlaceholder: this.i18nt('designer.hint.fileNameInputPlaceholder')
            }).then(({ value }) => {
                if (!value) {
                    value = defaultFileName
                }

                if (getQueryParam('vscode') == 1) {
                    this.vsSaveFile(value, fileContent)
                    return
                }

                const fileBlob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' })
                saveAs(fileBlob, value)
            }).catch(() => {
                //
            })
        },

        vsSaveFile(fileName, fileContent) {
            const msgObj = {
                cmd: 'writeFile',
                data: {
                    fileName,
                    code: fileContent
                }
            }
            window.parent.postMessage(msgObj, '*')
        },

        doJsonImport() {
            try {
                const importObj = JSON.parse(this.importTemplate)
                // console.log('test import', this.importTemplate)
                if (!importObj || !importObj.formConfig) {
                    throw new Error(this.i18nt('designer.hint.invalidJsonFormat'))
                }

                const fJsonVer = importObj.formConfig.jsonVersion
                if (!fJsonVer || (fJsonVer !== 3)) {
                    throw new Error(this.i18nt('designer.hint.jsonVersionMismatch'))
                }

                this.designer.loadFormJson(importObj)

                this.showImportJsonDialogFlag = false
                this.$message.success(this.i18nt('designer.hint.importJsonSuccess'))

                this.designer.emitHistoryChange()

                // this.designer.emitEvent('form-json-imported', [])
            } catch (ex) {
                this.$message.error(ex + '')
            }
        },

        exportJson() {
            const widgetList = deepClone(this.designer.widgetList)
            const formConfig = deepClone(this.designer.formConfig)
            this.editFormData.formJson.widgetList = widgetList
            this.$emit('saveEditFormData', this.editFormData)
        },

        copyFormJson(e) {
            copyToClipboard(this.jsonRawContent, e,
                this.$message,
                this.i18nt('designer.hint.copyJsonSuccess'),
                this.i18nt('designer.hint.copyJsonFail')
            )
        },

        saveFormJson() {
            this.saveAsFile(this.jsonContent, `vform${generateId()}.json`)
        },

        exportCode() {
            this.vueCode = generateCode(this.formJson)
            this.htmlCode = generateCode(this.formJson, 'html')
            this.showExportCodeDialogFlag = true
        },

        copyVueCode(e) {
            copyToClipboard(this.vueCode, e,
                this.$message,
                this.i18nt('designer.hint.copyVueCodeSuccess'),
                this.i18nt('designer.hint.copyVueCodeFail')
            )
        },

        copyHtmlCode(e) {
            copyToClipboard(this.htmlCode, e,
                this.$message,
                this.i18nt('designer.hint.copyHtmlCodeSuccess'),
                this.i18nt('designer.hint.copyHtmlCodeFail')
            )
        },

        saveVueCode() {
            this.saveAsFile(this.vueCode, `vform${generateId()}.vue`)
        },

        saveHtmlCode() {
            this.saveAsFile(this.htmlCode, `vform${generateId()}.html`)
        },

        generateSFC() {
            loadBeautifier(beautifier => {
                this.sfcCode = genSFC(this.designer.formConfig, this.designer.widgetList, beautifier)
                this.sfcCodeV3 = genSFC(this.designer.formConfig, this.designer.widgetList, beautifier, true)
                this.showExportSFCDialogFlag = true
            })
        },

        copyV2SFC(e) {
            copyToClipboard(this.sfcCode, e,
                this.$message,
                this.i18nt('designer.hint.copySFCSuccess'),
                this.i18nt('designer.hint.copySFCFail')
            )
        },

        copyV3SFC(e) {
            copyToClipboard(this.sfcCodeV3, e,
                this.$message,
                this.i18nt('designer.hint.copySFCSuccess'),
                this.i18nt('designer.hint.copySFCFail')
            )
        },

        saveV2SFC() {
            this.saveAsFile(this.sfcCode, `vformV2-${generateId()}.vue`)
        },

        saveV3SFC() {
            this.saveAsFile(this.sfcCodeV3, `vformV3-${generateId()}.vue`)
        },

        getFormData() {
            this.$refs['preForm'].getFormData().then(formData => {
                this.formDataJson = JSON.stringify(formData, null, '  ')
                this.formDataRawJson = JSON.stringify(formData)

                this.showFormDataDialogFlag = true
            }).catch(error => {
                this.$message.error(error)
            })
        },

        copyFormDataJson(e) {
            copyToClipboard(this.formDataRawJson, e,
                this.$message,
                this.i18nt('designer.hint.copyJsonSuccess'),
                this.i18nt('designer.hint.copyJsonFail')
            )
        },

        saveFormData() {
            this.saveAsFile(this.htmlCode, `formData${generateId()}.json`)
        },

        abc() {
            // this.$refs['preForm'].resetForm()
             this.$refs['preForm'].setFormData(this.designer.widgetList,
                {
                    date69624: new Date(),
                    switch17531: true,
                    input28924: "12313212"
                },
            )
        },
        
        getData() {
            this.$refs['preForm'].getFormData().then((data) => {
                console.log(data)
            })
        },

        setFormDisabled() {
            this.$refs['preForm'].disableForm()
        },

        setFormEnabled() {
            this.$refs['preForm'].enableForm()
        },

        handleFormChange(fieldName, newValue, oldValue, formModel) {
        /*
        console.log('---formChange start---')
        console.log('fieldName', fieldName)
        console.log('newValue', newValue)
        console.log('oldValue', oldValue)
        console.log('formModel', formModel)
        console.log('---formChange end---')
        */
        },

        testOnAppendButtonClick(clickedWidget) {
            console.log('test', clickedWidget)
        },

        testOnButtonClick(button) {
            console.log('test', button)
        },

        findWidgetById(wId) {
            let foundW = null
            traverseAllWidgets(this.designer.widgetList, (w) => {
                if (w.id === wId) {
                    foundW = w
                }
            })

            return foundW
        },

        onNodeTreeClick(nodeData, node, nodeEl) {
        // console.log('test', JSON.stringify(nodeData))

            if ((nodeData.selectable !== undefined) && !nodeData.selectable) {
                this.$message.info(this.i18nt('designer.hint.currentNodeCannotBeSelected'))
            } else {
                const selectedId = nodeData.id
                const foundW = this.findWidgetById(selectedId)
                if (foundW) {
                    this.designer.setSelected(foundW)
                }
            }
        }

    }
}
</script>

<style lang="scss" scoped>
  div.toolbar-container {
    min-width: 728px;  /* 解决工具按钮栏换行的问题！！ */
  }

  .left-toolbar {
    display: flex;
    margin-top: 4px;
    float: left;
    font-size: 16px;
  }

  .right-toolbar {
    display: flex;
    margin-top: 5px;
    float: right;

    :deep(.el-button--text) {
      font-size: 14px !important;
    }
  }

  .el-button i {
    margin-right: 3px;
  }

  :deep(.small-padding-dialog) {
    .el-dialog__header {
      //padding-top: 3px;
      //padding-bottom: 3px;
	  margin-right: unset;
      background: #f1f2f3;
    }

    .el-dialog__body {
      padding: 12px 15px 12px 15px;
      height: 500px;
      overflow-y: auto;
        color: #333;
      .el-alert.alert-padding {
        padding: 0 10px;
      }
    }

    .ace-container {
      border: 1px solid #DCDFE6;
    }
  }

  .dialog-title-light-bg {
    :deep(.el-dialog__header) {
      background: #f1f2f3;
    }
  }

  .no-box-shadow {
    box-shadow: none;
  }

  .no-padding.el-tabs--border-card {
    :deep(.el-tabs__content) {
      padding: 0;
    }
  }

  .form-render-wrapper {
    //height: calc(100vh - 142px);
    //all: revert !important; /* 防止表单继承el-dialog等外部样式，未生效，原因不明？？ */
  }

  .form-render-wrapper.h5-layout {
    margin: 0 auto;
    width: 420px;
    border-radius: 15px;
    //border-width: 10px;
    box-shadow: 0 0 1px 10px #495060;
    height: calc(100vh - 175px);
  }

  .form-render-wrapper.pad-layout {
    margin: 0 auto;
    width: 960px;
    border-radius: 15px;
    //border-width: 10px;
    box-shadow: 0 0 1px 10px #495060;
    height: calc(100vh - 175px);
  }

  .node-tree-drawer {
    :deep(.el-drawer) {
      padding: 10px;
      overflow: auto;
    }

    :deep(.el-drawer__header) {
      margin-bottom: 12px;
      padding: 5px 5px 0;
    }

    :deep(.el-drawer__body) {
      padding-left: 5px;
    }
  }

  /*.node-tree-scroll-bar {*/
  /*  height: 100%;*/
  /*  overflow: auto;*/
  /*}*/

  :deep(.node-tree) {
    .el-tree > .el-tree-node:after {
      border-top: none;
    }
    .el-tree-node {
      position: relative;
      padding-left: 12px;
    }

    .el-tree-node__content {
      padding-left: 0 !important;
    }

    .el-tree-node__expand-icon.is-leaf{
      display: none;
    }

    .el-tree-node__children {
      padding-left: 12px;
      overflow: visible !important; /* 加入此行让el-tree宽度自动撑开，超出宽度el-draw自动出现水平滚动条！ */
    }

    .el-tree-node :last-child:before {
      height: 38px;
    }

    .el-tree > .el-tree-node:before {
      border-left: none;
    }

    .el-tree > .el-tree-node:after {
      border-top: none;
    }

    .el-tree-node:before {
      content: "";
      left: -4px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }

    .el-tree-node:after {
      content: "";
      left: -4px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }

    .el-tree-node:before {
      border-left: 1px dashed #4386c6;
      bottom: 0px;
      height: 100%;
      top: -10px;
      width: 1px;
    }

    .el-tree-node:after {
      border-top: 1px dashed #4386c6;
      height: 20px;
      top: 12px;
      width: 16px;
    }

    .el-tree-node.is-current > .el-tree-node__content {
      background: #c2d6ea !important;
    }

    .el-tree-node__expand-icon {
      margin-left: -3px;
      padding: 6px 6px 6px 0px;
      font-size: 16px;
    }

  }
</style>
