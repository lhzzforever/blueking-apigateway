<template>
  <div class="resources-doc-container">
    <section class="content p20" :style="{ height: height }">
      <div class="ag-markdown-view" :class="isEdited ? '' : 'text-c'">
        <h3 v-if="isEdited"> {{ $t('文档类型') }} </h3>
        <bk-button-group>
          <bk-button
            v-for="item in languagesData"
            :selected="language === item.value"
            :key="item.value"
            :disabled="isEdited && language !== item.value"
            @click="handleSelectLanguage(item.value)"
          >
            <div
              v-bk-tooltips="
                { content: t('请选择待续期的权限'),
                  placement: 'top',disabled: !isEdited || (isEdited && language === item.value) }">
              {{ item.label }}
            </div>
          </bk-button>
        </bk-button-group>
      </div>
      <div v-show="isEmpty">
        <div class="text-c mt50">
          <bk-exception
            class="exception-wrap-item exception-part"
            type="empty"
            scene="part"
            :description="language === 'zh' ? t('您尚未创建中文文档') : t('您尚未创建英文文档')"
          />
          <bk-button
            class="mt20" theme="primary" style="width: 120px;"
            @click="handleEditMarkdown('create')"> {{ t('立即创建') }} </bk-button>
        </div>
      </div>
      <div v-show="!isEmpty">
        <div class="ag-markdown-view">
          <h3> {{ $t('请求方法/请求路径') }} </h3>
          <p class="pb15">
            <span class="ag-tag" :class="curResource.method.toLowerCase()">{{curResource.method}}</span>
            {{curResource.path}}
          </p>
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <div class="ag-markdown-view" v-html="markdownHtml" v-show="!isEdited"></div>
        <div class="ag-markdown-editor">
          <mavon-editor
            ref="markdownRef"
            v-model="markdownDoc"
            v-show="isEdited"
            :language="language"
            :box-shadow="false"
            :subfield="false"
            :ishljs="true"
            :code-style="'monokai'"
            :toolbars="toolbars"
            :tab-size="4"
          />
        </div>
      </div>
    </section>
    <div class="doc-btn-wrapper" v-if="!isEmpty">
      <template v-if="isEdited">
        <bk-button
          class="mr5" theme="primary" style="width: 100px;"
          @click="handleSaveMarkdown"
          :loading="isSaving">{{isUpdate ? $t('更新') : $t('提交')}}</bk-button>
        <bk-button
          style="width: 100px;"
          @click="handleCancelMarkdown"> {{ $t('取消') }} </bk-button>
      </template>
      <template v-else>
        <bk-button class="mr5" theme="primary" style="width: 100px;" @click="handleEditMarkdown('edit')">
          {{ $t('修改') }}
        </bk-button>
        <bk-pop-confirm
          :title="t('确认要删除该文档？')"
          content="将删除相关配置，不可恢复，请确认是否删除"
          width="288"
          trigger="click"
          @confirm="handleDeleteMarkdown"
        >
          <bk-button>
            {{ t('删除') }}
          </bk-button>
        </bk-pop-confirm>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs, onMounted } from 'vue';
import { getResourceDocs, updateResourceDocs, saveResourceDocs, deleteResourceDocs } from '@/http';
import { useCommon } from '@/store';
import { cloneDeep } from 'lodash';
import { useI18n } from 'vue-i18n';
import { Message } from 'bkui-vue';

const { t } = useI18n();
const common = useCommon();
const { apigwId } = common; // 网关id
const props = defineProps({
  curResource: { type: Object, default: {} },   // 当前点击的资源
  height: { type: String, default: 'calc(100vh - 104px)' },
});

const { curResource, height } = toRefs(props);

const languagesData = ref([{ label: t('中文文档'), value: 'zh' }, { label: t('英文文档'), value: 'en' }]);
const isEmpty = ref<boolean>(false);
const isUpdate = ref<boolean>(false);
const markdownDoc = ref<string>('');
const markdownHtml = ref<string>('');
const docData = ref<any[]>([]);
const isEdited = ref<boolean>(false);   // 是否是编辑
const language = ref<string>('zh');
const isSaving = ref<boolean>(false);
const docId = ref<any>('');
// const hasResourceDoc = ref<boolean>(false); // 是否有文档内容
const markdownRef = ref(null);
const toolbars = ref<any>({
  bold: true,
  italic: true,
  header: true,
  underline: true,
  strikethrough: false,
  mark: true,
  superscript: false,
  subscript: false,
  quote: true,
  ol: true,
  ul: true,
  link: true,
  imagelink: false,
  code: true,
  table: true,
  fullscreen: true,
  readmodel: true,
  htmlcode: false,
  help: false,
  /* 1.3.5 */
  undo: false,
  redo: false,
  trash: false,
  save: false,
  /* 1.4.2 */
  navigation: false,
  /* 2.1.8 */
  alignleft: true,
  aligncenter: true,
  alignright: true,
  /* 2.2.1 */
  subfield: true,
  preview: true,
});

const emit = defineEmits(['fetch', 'on-update']);

// 编辑markdown
const handleEditMarkdown = (type: string) => {
  isEmpty.value = false;
  isEdited.value = true;
  console.log('isEdited.value', isEdited.value);
  isUpdate.value = type === 'edit';    // 是否是更新
  emit('on-update', 'update', isUpdate.value);
  const docDataItem = cloneDeep(docData.value).find((e: any) => e.language === language.value);
  markdownDoc.value = docDataItem.content;
};

// 获取文档信息
const initData = async () => {
  try {
    docData.value = await getResourceDocs(apigwId, curResource.value.id);
    // 根据语言找到是否有文档内容
    handleDocDataWithLanguage();
  } catch (error) {
    console.log('error', error);
  }
};

// 保存markdown
const handleSaveMarkdown = async () => {
  if (!markdownDoc.value) {
    Message({
      theme: 'error',
      message: t('请输入文档内容'),
    });
    return false;
  }
  try {
    const data = {
      language: language.value,
      content: markdownDoc.value,
    };
    isSaving.value = true;
    if (docId.value) {
      // 更新
      await updateResourceDocs(apigwId, curResource.value.id, data, docId.value);
    } else {
      // 新增
      await saveResourceDocs(apigwId, curResource.value.id, data);
    }
    isEdited.value = false;
    Message({
      theme: 'success',
      message: t('保存成功！'),
    });
    initData();
    // 执行列表的方法
    emit('fetch');
  } catch (error) {

  } finally {
    isSaving.value = false;
  }
};

const handleCancelMarkdown = () => {
  isEdited.value = false;
  emit('on-update', 'cancel');
};

// 删除文档
const handleDeleteMarkdown = async () => {
  try {
    await deleteResourceDocs(apigwId, curResource.value.id, docId.value);
    Message({
      message: t('删除成功'),
      theme: 'success',
    });
    initData();
    // 执行列表的方法
    emit('fetch');
  } catch (error) {
    console.log('error', error);
  }
};

const handleSelectLanguage = (payload: string) => {
  // 如果相同 则return
  if (payload === language.value) return;
  language.value = payload;
  handleDocDataWithLanguage();
};

// 根据语言找到是否有文档内容
const handleDocDataWithLanguage = () => {
  const docDataItem =  cloneDeep(docData.value).find((e: any) => e.language === language.value);
  docId.value = docDataItem.id;
  isEmpty.value = !docDataItem.id;
  markdownDoc.value = docDataItem.content;
  markdownHtml.value = markdownRef.value.markdownIt.render(docDataItem.content);
};

onMounted(() => {
  initData();
});
</script>
<style scoped lang="scss">
.resources-doc-container{
  .content{
    overflow: auto;
    max-height: calc(100vh - 104px);
  }
}
  .doc-btn-wrapper {
    padding-top: 10px;
    background: #fff;
    padding-left: 20px;
    height: 52px;
  }
</style>
