export const containers = [{
        type: 'grid',
        textName: '栅格',
        category: 'container',
        icon: 'grid',
        cols: [],
        formItemFlag: true,
        options: {
            name: '',
            colHeight: null, //栅格列统一高度属性，用于解决栅格列设置响应式布局浮动后被挂住的问题！！
        }
    },
    {
        type: 'table',
        textName: '表格',
        category: 'container',
        icon: 'table',
        rows: [],
        formItemFlag: true,
        options: {
            name: '',
        }
    },
    {
        type: 'grid-col',
        category: 'container',
        icon: 'grid-col',
        internal: true,
        widgetList: [],
        options: {
            name: '',
            span: 12,
            offset: 0,
            push: 0,
            pull: 0,
            md: 12,
            sm: 12,
            xs: 12,
            borderType: 0,
        }
    },

    {
        type: 'table-cell',
        category: 'container',
        icon: 'table-cell',
        internal: true,
        widgetList: [],
        merged: false,
        options: {
            name: '',
            cellWidth: '',
            cellHeight: '',
            colspan: 1,
            rowspan: 1,
            backgroundColor: '',
        }
    }
]

export const basicFields = [{
        type: 'input',
        textName: '单行输入',
        icon: 'text-field',
        formItemFlag: true,
        options: {
            name: '',
            label: '',
            type: 'text',
            labelName: '单行输入',
            defaultValue: '',
            placeholder: '',
            labelWidth: 80,
            labelHidden: false,
            showPassword: false, 
        },
    },

    {
        type: 'textarea',
        textName: '多行输入',
        icon: 'textarea-field',
        formItemFlag: true,
        options: {
            name: '',
            label: '',
            rows: 3,
            labelName: '多行输入',
            defaultValue: '',
            placeholder: '',
            labelWidth: 80,
            labelHidden: false,
        },
    },

    {
        type: 'number',
        textName: '数字输入',
        icon: 'number-field',
        formItemFlag: true,
        options: {
            name: '',
            label: '',
            labelName: '数字输入',
            defaultValue: 0,
            labelWidth: 80,
            labelHidden: false,
        },
    },

    {
        type: 'static-text',
        textName: '静态文字',
        icon: 'static-text',
        formItemFlag: false,
        options: {
            name: '',
            textContent: '静态文字',
            labelAlign: '',
            labelWeight: '',
        },
    },

    {
        type: 'radio',
        textName: '单选项',
        icon: 'radio-field',
        formItemFlag: true,
        options: {
            name: '',
            label: '',
            labelWidth: 80,
            labelHidden: false,
            labelName: '单选项',

            optionItems: [
                { label: 'radio 1', value: 1 },
                { label: 'radio 2', value: 2 },
                { label: 'radio 3', value: 3 },
            ],
        },
    },

    {
        type: 'checkbox',
        textName: '多选项',
        icon: 'checkbox-field',
        formItemFlag: true,
        options: {
            name: '',
            label: '',
            labelName: '多选项',
            defaultValue: [],
            labelWidth: 80,
            labelHidden: false,

            optionItems: [
                { label: 'check 1', value: 1 },
                { label: 'check 2', value: 2 },
                { label: 'check 3', value: 3 },
            ],
        },
    },

    {
        type: 'select',
        textName: '单选下拉',
        icon: 'select-field',
        formItemFlag: true,
        options: {
            name: '',
            label: '',
            labelName: '单选下拉',
            defaultValue: '',
            placeholder: '',
            labelWidth: 80,
            labelHidden: false,

            multiple: false,
            multipleLimit: 0,
            optionItems: [
                { label: 'select 1', value: 1 },
                { label: 'select 2', value: 2 },
                { label: 'select 3', value: 3 },
            ],
        },
    },
    
    {
        type: 'select',
        textName: '多选下拉',
        icon: 'select-field',
        formItemFlag: true,
        options: {
            name: '',
            label: '',
            labelName: '多选下拉',
            defaultValue: '',
            placeholder: '',
            labelWidth: 80,
            labelHidden: false,
    
            multiple: true,
            multipleLimit: 0,
            optionItems: [
                { label: 'select 1', value: 1 },
                { label: 'select 2', value: 2 },
                { label: 'select 3', value: 3 },
            ],
        },
    },
    
    {
        type: 'date',
        textName: '日期',
        icon: 'date-field',
        formItemFlag: true,
        options: {
            name: '',
            label: '',
            type: 'date',
            labelName: '日期',
            defaultValue: null,
            placeholder: '',
            autoFullWidth: true,
            labelWidth: 80,
            labelHidden: false,
            format: 'YYYY-MM-DD', //日期显示格式
        }
    },
    {
        type: 'date-range',
        textName: '日期范围',
        icon: 'date-range-field',
        formItemFlag: true,
        options: {
            name: '',
            label: '',
            type: 'daterange',
            labelName: '日期范围',
            defaultValue: null,
            startPlaceholder: '',
            endPlaceholder: '',
            labelWidth: 80,
            labelHidden: false,
            format: 'YYYY-MM-DD', //日期显示格式
        }
    },

    {
        type: 'switch',
        textName: '开关',
        icon: 'switch-field',
        formItemFlag: true,
        options: {
            name: '',
            label: '',
            labelName: '开关',
            defaultValue: null,
            labelWidth: 80,
            labelHidden: false,
        },
    },

    {
        type: 'divider',
        textName: '分隔线',
        icon: 'divider',
        formItemFlag: false,
        options: {
            name: '',
            label: '',
            labelName: '分隔线',
            direction: 'horizontal',
            contentPosition: 'center',

            //-------------------
        },
    },

    //

]

export const advancedFields = [
    {
        type: 'rich-editor',
        textName: '富文本',
        icon: 'rich-editor-field',
        formItemFlag: true,
        options: {
            name: '',
            label: '',
            labelName: '富文本',
            placeholder: '',
            labelWidth: 80,
            labelHidden: false,
            contentHeight: '200px',
        },
    }
]

export const customFields = [

]

export function addContainerWidgetSchema(containerSchema) {
    containers.push(containerSchema)
}

export function addBasicFieldSchema(fieldSchema) {
    basicFields.push(fieldSchema)
}

export function addAdvancedFieldSchema(fieldSchema) {
    advancedFields.push(fieldSchema)
}

export function addCustomWidgetSchema(widgetSchema) {
    customFields.push(widgetSchema)
}