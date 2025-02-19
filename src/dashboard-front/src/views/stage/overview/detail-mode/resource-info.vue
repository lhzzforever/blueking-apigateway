<template>
  <div class="resource-info">
    <bk-input
      v-model="searchValue"
      style="width: 520px"
      clearable
      type="search"
      :placeholder="t('请输入后端服务名称、资源名称、请求路径或选择条件搜索')"
    />
    <bk-loading :loading="isLoading">
      <bk-table
        class="table-layout mt15"
        :data="curPageData"
        :pagination="pagination"
        :empty-text="emptyText"
        show-overflow-tooltip
        row-hover="auto"
        border="outer"
        :settings="settings"
        @page-limit-change="handlePageSizeChange"
        @page-value-change="handlePageChange"
      >
        <bk-table-column prop="backend" :label="t('后端服务')">
          <template #default="{ row }">
            {{ row?.proxy?.backend?.name }}
          </template>
        </bk-table-column>
        <bk-table-column
          :label="t('资源名称')"
          prop="name"
          sort
        ></bk-table-column>
        <bk-table-column
          :label="t('前端请求方法')"
          prop="method"
        >
          <template #default="{ row }">
            <span class="ag-tag" :class="row.method?.toLowerCase()">{{row.method}}</span>
          </template>
        </bk-table-column>
        <bk-table-column
          :label="t('前端请求路径')"
          prop="path"
          sort
        ></bk-table-column>
        <bk-table-column prop="gateway_label_ids" :label="t('标签')">
          <template #default="{ row }">
            <template v-if="row?.gateway_label_ids?.length">
              <bk-tag
                v-for="tag in labels?.filter((label) => {
                  if (row.gateway_label_ids?.includes(label.id))
                    return true;
                })"
                :key="tag.id"
              >{{ tag.name }}</bk-tag
              >
            </template>
            <template v-else>--</template>
          </template>
        </bk-table-column>
        <bk-table-column prop="plugins" :label="t('生效的插件')">
          <template #default="{ row }">
            <template v-if="row?.plugins?.length">
              <span v-for="p in row.plugins" :key="p?.id">
                <bk-tag theme="success" v-if="p?.binding_type === 'stage'">环</bk-tag>
                <bk-tag theme="info" v-if="p?.binding_type === 'resource'">资</bk-tag>
                {{ p?.name }}
              </span>
            </template>
            <span v-else>--</span>
          </template>
        </bk-table-column>
        <bk-table-column :label="t('是否公开')" prop="is_public">
          <template #default="{ row }">
            <span :style="{ color: row.is_public ? '#FE9C00' : '#63656e' }">
              {{ row.is_public ? t('是') : t('否') }}
            </span>
          </template>
        </bk-table-column>
        <bk-table-column
          :label="t('操作')"
          prop="act"
          width="200"
        >
          <template #default="{ row }">
            <bk-button
              text
              theme="primary"
              class="mr10"
              @click="showDetails(row)"
            >
              {{ t('查看资源详情') }}
            </bk-button>
            <bk-button
              text
              theme="primary"
              @click="copyPath(row)"
            >
              {{ t('复制资源地址') }}
            </bk-button>
          </template>

        </bk-table-column>
        <template #empty>
          <TableEmpty
            :keyword="tableEmptyConf.keyword"
            :abnormal="tableEmptyConf.isAbnormal"
            @clear-filter="handleClearFilterKey"
          />
        </template>
      </bk-table>
    </bk-loading>

    <!-- 资源详情 -->
    <resource-details ref="resourceDetailsRef" :info="info" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getResourceVersionsInfo, getGatewayLabels, getStageList } from '@/http';
import { useCommon, useStage } from '@/store';
import resourceDetails from './resource-details.vue';
import TableEmpty from '@/components/table-empty.vue';
import { copy } from '@/common/util';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();
const common = useCommon();
const stageStore = useStage();

const props = defineProps({
  stageAddress: String,
});

const searchValue = ref<string>('');
const info = ref<any>({});
const resourceDetailsRef = ref();
const isReload = ref(false);
const emptyText = ref<string>('暂无数据');

// 网关标签
const labels = ref<any[]>([]);

// 网关id
const apigwId = computed(() => common.apigwId);
const isLoading = ref(false);

const pagination = ref({
  current: 1,
  limit: 10,
  count: 0,
});

const tableEmptyConf = ref<{keyword: string, isAbnormal: boolean}>({
  keyword: '',
  isAbnormal: false,
});

const getLabels = async () => {
  try {
    const res = await getGatewayLabels(apigwId.value);
    labels.value = res;
  } catch (e) {
    console.error(e);
  }
};

const showDetails = (row: any) => {
  info.value = row;
  resourceDetailsRef.value?.showSideslider();
};

const copyPath = (row: any) => {
  copy(props.stageAddress.replace(/\/$/, '') + row?.path);
};

// 资源信息
const resourceVersionList = ref([]);

// 获取资源信息数据
const getResourceVersionsData = async (curStageData: any) => {
  isLoading.value = true;
  const curVersionId = curStageData?.resource_version?.id;
  resourceVersionList.value = [];
  if (curVersionId === undefined) {
    isReload.value = true;
    isLoading.value = false;
    return;
  }
  // 没有版本无需请求
  if (curVersionId === 0) {
    isLoading.value = false;
    emptyText.value = '环境没有发布，数据为空';
    return;
  }
  try {
    const res = await getResourceVersionsInfo(apigwId.value, curVersionId, { stage_id: curStageData?.id });
    pagination.value.count = res.resources.length;
    resourceVersionList.value = res.resources || [];
  } catch (e) {
    // 接口404处理
    resourceVersionList.value = [];
    console.error(e);
  } finally {
    isLoading.value = false;
    isReload.value = false;
    emptyText.value = '暂无数据';
  }
};

const getPageData = () => {
  let curAllData = resourceVersionList.value;
  if (searchValue.value) {
    curAllData = curAllData?.filter((row: any) => {
      if (
        row?.proxy?.backend?.name?.toLowerCase()?.includes(searchValue.value)
      || row?.name?.toLowerCase()?.includes(searchValue.value)
      || row?.path?.toLowerCase()?.includes(searchValue.value)
      )  {
        return true;
      }
      return false;
    });
    updateTableEmptyConfig();
  }

  // 当前页数
  const page = pagination.value.current;
  // limit 页容量
  let startIndex = (page - 1) * pagination.value.limit;
  let endIndex = page * pagination.value.limit;
  if (startIndex < 0) {
    startIndex = 0;
  }
  if (endIndex > curAllData.length) {
    endIndex = curAllData.length;
  }
  pagination.value.count = curAllData.length;
  return curAllData;
};

// 当前页数据
const curPageData = computed(() => {
  return getPageData();
});

// 页码变化发生的事件
const handlePageChange = (current: number) => {
  isLoading.value = true;
  pagination.value.current = current;
  setTimeout(() => {
    isLoading.value = false;
  }, 200);
};

// 条数变化发生的事件
const handlePageSizeChange = (limit: number) => {
  isLoading.value = true;
  pagination.value.limit = limit;
  setTimeout(() => {
    isLoading.value = false;
  }, 200);
};

const updateTableEmptyConfig = () => {
  tableEmptyConf.value.isAbnormal = pagination.value.abnormal;
  if (searchValue.value || !curPageData.value.length) {
    tableEmptyConf.value.keyword = 'placeholder';
    return;
  }
  if (searchValue.value) {
    tableEmptyConf.value.keyword = '$CONSTANT';
    return;
  }
  tableEmptyConf.value.keyword = '';
};

const handleClearFilterKey = () => {
  searchValue.value = '';
  pagination.value = Object.assign(pagination.value, {
    current: 1,
    limit: 10,
    count: resourceVersionList.value.length,
  });
  getPageData();
};

const settings = {
  trigger: 'click',
  fields: [
    {
      name: t('后端服务'),
      field: 'backend',
      disabled: true,
    },
    {
      name: t('资源名称'),
      field: 'name',
    },
    {
      name: t('前端请求方法'),
      field: 'method',
    },
    {
      name: t('前端请求路径'),
      field: 'path',
    },
    {
      name: t('标签'),
      field: 'gateway_label_ids',
    },
    {
      name: t('生效的插件'),
      field: 'plugins',
    },
    {
      name: t('是否公开'),
      field: 'is_public',
    },
  ],
  checked: ['backend', 'name', 'method', 'path', 'gateway_label_ids', 'plugins', 'is_public'],
};

const init = async () => {
  const data = await getStageList(apigwId.value);
  const paramsStage = route.query.stage || 'prod';

  const curStageData = data.find((item: { name: string; }) => item.name === paramsStage)
  || stageStore.stageList[0];
  getResourceVersionsData(curStageData);
  getLabels();
};

// 切换环境重新获取资源信息
watch(() => stageStore.curStageId, () => {
  init();
});

// 切换环境重新执行
onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
.table-layout {
  :deep(.bk-table-head) {
    scrollbar-gutter: auto;
  }
}
</style>
