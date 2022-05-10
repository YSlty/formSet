<template>
    <el-config-provider :locale="elLocale">
        <div id="app">
            <VFormDesigner :rowFormData="userData" @saveEditFormData="saveEditFormData" />
            {{userData}}
        </div>
    </el-config-provider>
</template>

<script>
import VFormDesigner from './components/form-designer/index.vue'
import VFormRender from './components/form-render/index.vue'

import zhCNLang from 'element-plus/lib/locale/lang/zh-cn'
import enUSLang from 'element-plus/lib/locale/lang/en'

export default {
    name: 'App',
    components: {
        VFormDesigner,
        VFormRender
    },
    data() {
        return {
            optionData: {},
            formData: {},
            userData: {
                id: 1001,
                name: '测试',
                formJson: {
                    'widgetList': [
                        {
						    'key': 47990,
						    'type': 'date',
						    'textName': '日期',
						    'icon': 'date-field',
						    'formItemFlag': true,
						    'options': {
						        'name': 'date69624',
						        'label': 'date',
						        'type': 'date',
						        'labelName': '日期',
						        'defaultValue': null,
						        'placeholder': '',
						        'autoFullWidth': true,
						        'labelWidth': 80,
						        'labelHidden': false,
						        'format': 'YYYY-MM-DD'
						    },
						    'id': 'date69624'
                        }, {
						    'key': 89345,
						    'type': 'switch',
						    'textName': '开关',
						    'icon': 'switch-field',
						    'formItemFlag': true,
						    'options': {
						        'name': 'switch17531',
						        'label': 'switch',
						        'labelName': '开关',
						        'defaultValue': false,
						        'labelWidth': 80,
						        'labelHidden': false
						    },
						    'id': 'switch17531'
                        }
                    ],
                    'formConfig': { 'modelName': 'formData', 'refName': 'vForm', 'rulesName': 'rules', 'labelWidth': 80, 'labelPosition': 'left', 'size': '', 'labelAlign': 'label-left-align', 'cssCode': '', 'customClass': '', 'functions': '', 'layoutType': 'PC', 'jsonVersion': 3, 'onFormCreated': '', 'onFormMounted': '', 'onFormDataChange': '', 'onFormValidate': '' }
                }
            },

            elLocaleMap: {
                'zh-CN': zhCNLang,
                'en-US': enUSLang
            }
        }
    },
    computed: {
        elLocale() {
            const curLocale = localStorage.getItem('v_form_locale') || 'zh-CN'
            return this.elLocaleMap[curLocale]
        }

    },
    methods: {
        submitForm() {
            this.$refs.vFormRef.getFormData().then(formData => {
                // Form Validation OK
                alert(JSON.stringify(formData))
            }).catch(error => {
                // Form Validation failed
                this.$message.error(error)
            })
        },
        saveEditFormData(data) {
            this.userData = data
        }
    }
}
</script>

<style lang="scss">
#app {
    width: 100%;
    height: 100%;
}
</style>
