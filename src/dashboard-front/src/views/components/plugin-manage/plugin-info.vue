<template>
  <div class="plugin-info">
    <div class="info-alert mb20" v-if="!isAdd && isStage">
      <bk-alert theme="warning" :title="t(editAlert)"></bk-alert>
    </div>
    <div class="info-header">
      <span class="cur-icon">{{ pluginCodeFirst(curPluginInfo.code) }}</span>
      <div class="cur-text">
        <p class="cur-name">{{ curPluginInfo.name }}</p>
        <ul class="cur-binding-info">
          <li>
            {{ t('当前版本：') }}
            <span class="cur-version">{{ t('1.0.0') }}</span>
          </li>
          <li>
            {{ t('已绑定的资源：') }}
            <span :class="[curPluginInfo.related_scope_count.resource === 0 ? 'empty' : 'bound',]">
              {{ curPluginInfo.related_scope_count.resource }}
            </span>
          </li>
          <li>
            {{ t('已绑定的环境：') }}
            <span :class="[curPluginInfo.related_scope_count.stage === 0 ? 'empty' : 'bound',]">
              {{ curPluginInfo.related_scope_count.stage }}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="info-form-container mt20">
      <!-- <bk-form ref="formRef" class="info-form" :model="configFormData" :rules="rules" form-type="vertical">
        <bk-form-item :label="t('名称')" property="name" required>
          <bk-input v-model="configFormData.name" :placeholder="t('请输入')" />
        </bk-form-item>
        <bk-loading :loading="isPluginFormLoading">
          <bk-form-item class="mt20" v-if="infoNotes">
            <bk-alert theme="info" :title="t(infoNotes)"></bk-alert>
          </bk-form-item>
        </bk-loading>
      </bk-form> -->
      <BkSchemaForm
        class="mt20 plugin-form"
        v-model="schemaFormData"
        :schema="formConfig.schema"
        :layout="formConfig.layout"
        :rules="formConfig.rules"
        ref="formRef">
      </BkSchemaForm>
    </div>
    <div class="info-btn mt20">
      <div class="last-step">
        <bk-button theme="primary" @click="handleAdd">{{ t('确定') }}</bk-button>
        <bk-button @click="handlePre" class="ml5" v-if="isAdd">{{ t('上一步') }}</bk-button>
        <bk-button @click="handleCancel" class="ml5">{{ t('取消') }}</bk-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineEmits, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { getPluginForm, creatPlugin, updatePluginConfig } from '@/http';
import { Message } from 'bkui-vue';
// @ts-ignore
import createForm from '@blueking/bkui-form';
import { json2yaml, yaml2json } from '@/common/util';
const BkSchemaForm = createForm();

const { t } = useI18n();
const emit = defineEmits(['on-change']);

const schemaFormData = ref({});
const formConfig = ref({
  schema: {},
  layout: {},
  rules: {},
});

const props = defineProps({
  curPlugin: {
    type: Object,
  },
  scopeInfo: {
    type: Object,
  },
  editPlugin: {
    type: Object,
  },
  type: {
    type: String,
  },
});

const { curPlugin } = toRefs(props);
const formRef = ref(null);
const curPluginInfo = ref<any>(curPlugin);
const isPluginFormLoading = ref(false);
const infoNotes = ref('');
const isAdd = ref(false);
const isStage = ref(false);
const editAlert = ref(t('修改插件配置将会直接影响线上环境，请谨慎操作'));
const pluginCodeFirst = computed(() => {
  return function (code: string) {
    return code.charAt(3).toUpperCase();
  };
});
const typeId = ref<number>();

// 上一页
const handlePre = () => {
  emit('on-change', 'pre');
};
// 确认
const handleAdd = async () => {
  const { scopeInfo: { scopeType, scopeId, apigwId } } = props;
  const { curPlugin: { code } } = props;
  // await formRef.value?.validate();
  try {
    const data: any = { ...schemaFormData.value };
    data.yaml = json2yaml(JSON.stringify(schemaFormData.value)).data;
    if (isAdd.value) {
      data.name = props.curPlugin?.name;
      data.type_id = typeId.value;
      await creatPlugin(apigwId, scopeType, scopeId, code, data);
      emit('on-change', 'addSuccess');
    } else {
      data.name = props.editPlugin?.name;
      data.type_id = props.editPlugin?.type_id;
      // data.yaml = props.editPlugin?.yaml;
      await updatePluginConfig(apigwId, scopeType, scopeId, code, props.editPlugin.id, data);
      emit('on-change', 'editSuccess');
    }
    Message({
      message: isAdd.value ? t('添加成功') : t('修改成功'),
      theme: 'success',
    });
  } catch (error) {
    console.log('error', error);
  }
};
// 取消
const handleCancel = () => {
  if (isAdd.value) {
    emit('on-change', 'addCancel');
  }
  emit('on-change', 'editCancel');
};
const init = async () => {
  isStage.value = props.scopeInfo.scopeType === 'stage';
  isAdd.value = props.type === 'add';
  curPluginInfo.value = props.curPlugin;
  const { scopeInfo: { apigwId } } = props;
  const { curPlugin: { code } } = props;
  try {
    isPluginFormLoading.value = true;
    const res = await getPluginForm(apigwId, code);
    // const res = {
    //   id: 7,
    //   language: '',
    //   notes: '默认频率限制，表示单个应用的默认频率限制；特殊应用频率限制，对指定应用设置单独的频率限制。频率控制插件，绑定环境时，表示应用对环境下所有资源的总频率限制；绑定资源时，表示应用对单个资源的频率限制',
    //   style: 'dynamic',
    //   default_value: '',
    //   config: {
    //     schema: {
    //       title: '频率控制',
    //       type: 'object',
    //       properties: {
    //         rates: {
    //           type: 'object',
    //           properties: {
    //             default: {
    //               type: 'object',
    //               title: '默认频率限制',
    //               'ui:group': {
    //                 type: 'card',
    //                 showTitle: true,
    //                 style: {
    //                   background: '#F5F7FA',
    //                   padding: '10px 20px 10px 30px',
    //                 },
    //               },
    //               required: [
    //                 'tokens',
    //                 'period',
    //               ],
    //               properties: {
    //                 tokens: {
    //                   type: 'integer',
    //                   title: '次数',
    //                   default: 100,
    //                   'ui:rules': [
    //                     'required',
    //                   ],
    //                   'ui:component': {
    //                     name: 'bfInput',
    //                     min: 1,
    //                   },
    //                   'ui:props': {
    //                     labelWidth: 100,
    //                   },
    //                 },
    //                 period: {
    //                   type: 'integer',
    //                   title: '时间范围',
    //                   default: 1,
    //                   'ui:rules': [
    //                     'required',
    //                   ],
    //                   'ui:component': {
    //                     name: 'select',
    //                     datasource: [
    //                       {
    //                         label: '秒',
    //                         value: 1,
    //                       },
    //                       {
    //                         label: '分',
    //                         value: 60,
    //                       },
    //                       {
    //                         label: '时',
    //                         value: 3600,
    //                       },
    //                       {
    //                         label: '天',
    //                         value: 86400,
    //                       },
    //                     ],
    //                     clearable: false,
    //                   },
    //                   'ui:props': {
    //                     labelWidth: 100,
    //                   },
    //                 },
    //               },
    //             },
    //             specials: {
    //               type: 'array',
    //               title: '特殊应用频率限制',
    //               'ui:group': {
    //                 type: 'card',
    //                 showTitle: true,
    //                 style: {
    //                   background: '#F5F7FA',
    //                   padding: '10px 20px 20px 20px',
    //                 },
    //               },
    //               items: {
    //                 type: 'object',
    //                 required: [
    //                   'tokens',
    //                   'period',
    //                   'bk_app_code',
    //                 ],
    //                 'ui:group': {
    //                   style: {
    //                     background: '#FFF',
    //                     padding: '10px 10px 10px 10px',
    //                   },
    //                 },
    //                 properties: {
    //                   tokens: {
    //                     type: 'integer',
    //                     title: '次数',
    //                     default: 1,
    //                     'ui:rules': [
    //                       'required',
    //                     ],
    //                     'ui:component': {
    //                       name: 'bfInput',
    //                       min: 1,
    //                     },
    //                     'ui:props': {
    //                       labelWidth: 100,
    //                     },
    //                   },
    //                   period: {
    //                     type: 'integer',
    //                     title: '时间范围',
    //                     default: 1,
    //                     'ui:rules': [
    //                       'required',
    //                     ],
    //                     'ui:component': {
    //                       name: 'select',
    //                       datasource: [
    //                         {
    //                           label: '秒',
    //                           value: 1,
    //                         },
    //                         {
    //                           label: '分',
    //                           value: 60,
    //                         },
    //                         {
    //                           label: '时',
    //                           value: 3600,
    //                         },
    //                         {
    //                           label: '天',
    //                           value: 86400,
    //                         },
    //                       ],
    //                       clearable: false,
    //                     },
    //                     'ui:props': {
    //                       labelWidth: 100,
    //                     },
    //                   },
    //                   bk_app_code: {
    //                     type: 'string',
    //                     title: '蓝鲸应用ID',
    //                     pattern: '^[a-z0-9][a-z0-9_-]{0,31}$',
    //                     'ui:rules': [
    //                       'required',
    //                     ],
    //                   },
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //     layout: [
    //       [
    //         {
    //           prop: 'rates',
    //           group: [
    //             [
    //               {
    //                 prop: 'default',
    //                 container: {
    //                   'grid-template-columns': '250px 200px',
    //                 },
    //                 group: [
    //                   [
    //                     'tokens',
    //                     'period',
    //                   ],
    //                 ],
    //               },
    //             ],
    //             [
    //               {
    //                 prop: 'specials',
    //                 container: {
    //                   'grid-template-columns': '250px 200px 250px',
    //                 },
    //                 group: [
    //                   [
    //                     'tokens',
    //                     'period',
    //                     'bk_app_code',
    //                   ],
    //                 ],
    //               },
    //             ],
    //           ],
    //         },
    //       ],
    //     ],
    //     formData: {},
    //     rules: {},
    //   },
    //   type_id: 4,
    //   type_code: 'bk-rate-limit',
    //   type_name: '频率控制',
    // };

    isPluginFormLoading.value = false;
    infoNotes.value = res.notes;
    formConfig.value = res.config;
    typeId.value = res.type_id;

    if (!isAdd.value) {
      const yamlData = yaml2json(props.editPlugin.yaml).data;
      schemaFormData.value = { ...(yamlData as {}) };
    }
  } catch (error) {
    console.log('error', error);
  }
};
init();
</script>

<style lang="scss" scoped>
.info-header {
  background-color: #f5f7fb;
  padding: 15px 20px;
  display: flex;

  .cur-icon {
    display: inline-block;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #eff1f5;
    color: #3a84f6;
    text-align: center;
    line-height: 60px;
    font-weight: 700;
    font-size: 30px;
    margin-right: 18px;
  }

  .cur-name {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 5px;
    margin-top: 10px;
  }

  .cur-binding-info {
    display: flex;
    width: 370px;
    justify-content: space-between;
    color: #b9bac1;

    .cur-version {
      color: #333539;
      font-weight: 700;
    }

    .empty {
      color: #646569;
      font-weight: 700;
    }

    .bound {
      color: #4b8ceb;
      font-weight: 700;
    }
  }
}
</style>
