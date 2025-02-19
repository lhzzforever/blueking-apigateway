/* eslint-disable max-len */

import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
} from 'vue-router';

import globalConfig from '@/constant/config';

const Home = () => import(/* webpackChunkName: "Home" */ '@/views/home.vue');
const ApigwDocs = () => import(/* webpackChunkName: "ApigwDocs" */ '@/views/apigwDocs/index.vue');
const ApigwAPIDetail = () => import(/* webpackChunkName: "apigw-doc" */ '@/views/apigwDocs/components/detail.vue');
const ApigwAPIDetailIntro = () => import(/* webpackChunkName: "apigw-doc" */ '@/views/apigwDocs/components/intro.vue');
const ApigwAPIDetailDoc = () => import(/* webpackChunkName: "apigw-doc" */ '@/views/apigwDocs/components/doc.vue');
const ApigwMain = () => import(/* webpackChunkName: 'apigw-main'*/'@/views/main.vue');
const ApigwResource = () => import(/* webpackChunkName: 'apigw-main'*/'@/views/resource/setting/index.vue');
const ApigwResourceEdit = () => import(/* webpackChunkName: 'apigw-doc'*/'@/views/resource/setting/edit.vue');
const apigwResourceVersion = () => import(/* webpackChunkName: 'apigw-main'*/'@/views/resource/version/index.vue');
const ApigwResourceImport = () => import(/* webpackChunkName: 'apigw-doc'*/'@/views/resource/setting/import.vue');
const ApigwResourceImportDoc = () => import(/* webpackChunkName: 'apigw-doc'*/'@/views/resource/setting/import-doc.vue');
const apigwStageOverview = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/stage/overview/index.vue');
const apigwStageDetail = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/stage/overview/detail-mode/index.vue');
const apigwReleaseHistory = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/stage/published/index.vue');
// const apigwStageResourceInfo = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/stage/overview/detail-mode/resource-info.vue');
// const apigwStagePluginManage = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/stage/overview/detail-mode/plugin-manage.vue');
const apigwOnlineTest = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/online-test/index.vue');
// const apigwStageVariableManage = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/stage/overview/detail-mode/variable-manage.vue');
const ApigwPermissionApplys = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/permission/apply/index.vue');
const ApigwPermissionApps = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/permission/app/index.vue');
const ApigwPermissionRecords = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/permission/record/index.vue');
const apigwAccessLog = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/operate-data/access-log/index.vue');
const apigwAccessLogDetail = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/operate-data/access-log/detail.vue');
const apigwReport = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/operate-data/report/index.vue');
const ApigwBackendService = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/backend-service/index.vue');
const ApiBasicInfo = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/basic-info/index.vue');
const ApigwOperateRecords  = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/operate-records/index.vue');
const ApigwMonitorAlarmStrategy = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/monitor/alarm-strategy/index.vue');
const ApigwMonitorAlarmHistory = () => import(/* webpackChunkName: 'apigw-env'*/'@/views/monitor/alarm-history/index.vue');
const ApigwSDK = () => import(/* webpackChunkName: 'apigw-doc'*/'@/views/sdk/gateway-sdk/index.vue');
const ApigwESBSDK = () => import(/* webpackChunkName: 'apigw-doc'*/'@/views/sdk/esb-sdk/index.vue');
const ComponentDoc = () => import(/* webpackChunkName: 'apigw-doc'*/'@/views/component-doc/index.vue');
const ComponentAPIDetail = () => import(/* webpackChunkName: 'apigw-doc'*/'@/views/component-doc/components/detail.vue');
const ComponentAPIDetailDoc = () => import(/* webpackChunkName: 'apigw-doc'*/'@/views/component-doc/components/doc.vue');
const ComponentAPIDetailIntro = () => import(/* webpackChunkName: 'apigw-doc'*/'@/views/component-doc/components/intro.vue');
const ComponentsMain = () => import(/* webpackChunkName: 'components-main'*/'@/views/components-access/index.vue');
const ComponentsIntro = () => import(/* webpackChunkName: 'components-main'*/'@/views/components-access/intro/index.vue');
const ComponentsSystem = () => import(/* webpackChunkName: 'components-main'*/'@/views/components-access/system/index.vue');
const ComponentsManage = () => import(/* webpackChunkName: 'components-main'*/'@/views/components-access/manage/index.vue');
const SyncApigwAccess = () => import(/* webpackChunkName: 'components-main'*/'@/views/components-access/manage/components/sync-access.vue');
const SyncHistory = () => import(/* webpackChunkName: 'components-main'*/'@/views/components-access/manage/components/sync-history.vue');
const SyncVersion = () => import(/* webpackChunkName: 'components-main'*/'@/views/components-access/manage/components/sync-version.vue');
const ComponentsCategory = () => import(/* webpackChunkName: 'components-main'*/'@/views/components-access/category/index.vue');
const ComponentsAudit = () => import(/* webpackChunkName: 'components-main'*/'@/views/components-access/permission/audit/index.vue');
const ComponentsPower = () => import(/* webpackChunkName: 'components-main'*/'@/views/components-access/permission/power/index.vue');
const ComponentsHistory = () => import(/* webpackChunkName: 'components-main'*/'@/views/components-access/permission/history/index.vue');
const ComponentsRuntimeData = () => import(/* webpackChunkName: 'components-main'*/'@/views/components-access/runtime-data/index.vue');


// 文档一级路由出口
const docsComponent = {
  name: 'DocMain',
  template: '<router-view></router-view>',
};

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      isMenu: false,   // 是否作为侧边栏菜单
    },
  },
  {
    path: '/',
    name: 'apigwMain',
    component: ApigwMain,
    meta: {
      title: '资源管理',
      matchRoute: 'apigwMain',
      topMenu: 'home',
    },
    children: [
      {
        path: ':id/stage',
        name: 'apigwStageOverview',
        component: apigwStageOverview,
        meta: {
          title: '环境管理',
          matchRoute: 'apigwStageOverview',
          topMenu: 'home',
        },
      },
      {
        path: ':id/stage-detail',
        name: 'apigwStageDetail',
        component: apigwStageDetail,
        meta: {
          title: '环境概览',
          matchRoute: 'apigwStageOverview',
          topMenu: 'home',
        },
      },
      {
        path: '/:id/published',
        name: 'apigwReleaseHistory',
        component: apigwReleaseHistory,
        meta: {
          title: '发布记录',
          matchRoute: 'apigwReleaseHistory',
          topMenu: 'home',
        },
      },
      {
        path: '/:id/resource',
        name: 'apigwResource',
        component: ApigwResource,
        meta: {
          title: '资源配置',
          matchRoute: 'apigwResource',
          topMenu: 'home',
        },
      },
      {
        path: '/:id/resource/create',
        name: 'apigwResourceCreate',
        component: ApigwResourceEdit,
        meta: {
          title: '新建资源',
          matchRoute: 'apigwResource',
          topMenu: 'home',
          showBackIcon: true,
        },
      },
      {
        path: '/:id/resource/:resourceId/edit',
        name: 'apigwResourceEdit',
        component: ApigwResourceEdit,
        meta: {
          title: '编辑资源',
          matchRoute: 'apigwResource',
          topMenu: 'home',
          showBackIcon: true,
        },
      },
      {
        path: '/:id/resource/:resourceId/clone',
        name: 'apigwResourceClone',
        component: ApigwResourceEdit,
        meta: {
          title: '克隆资源',
          matchRoute: 'apigwResource',
          topMenu: 'home',
          showBackIcon: true,
        },
      },
      {
        path: '/:id/version',
        name: 'apigwResourceVersion',
        component: apigwResourceVersion,
        meta: {
          title: '资源版本',
          matchRoute: 'apigwResourceVersion',
          topMenu: 'home',
          isCustomTopbar: 'resourceVersionOverview',
        },
      },
      {
        path: '/:id/debugging',
        name: 'apigwOnlineTest',
        component: apigwOnlineTest,
        meta: {
          title: '在线调试',
          matchRoute: 'apigwOnlineTest',
          topMenu: 'home',
        },
      },
      {
        path: '/:id/resource/import',
        name: 'apigwResourceImport',
        component: ApigwResourceImport,
        meta: {
          title: '导入资源配置',
          matchRoute: 'apigwResource',
          topMenu: 'home',
          showBackIcon: true,
        },
      },
      {
        path: '/:id/backend',
        name: 'apigwBackendService',
        component: ApigwBackendService,
        meta: {
          title: '后端服务',
          matchRoute: 'apigwBackendService',
          topMenu: 'home',
        },
      },
      {
        path: '/:id/permission/apply',
        name: 'apigwPermissionApplys',
        component: ApigwPermissionApplys,
        meta: {
          title: '权限审批',
          matchRoute: 'apigwPermissionApplys',
          topMenu: 'home',
        },
      },
      {
        path: '/:id/permission/app',
        name: 'apigwPermissionApps',
        component: ApigwPermissionApps,
        meta: {
          title: '应用权限',
          matchRoute: 'apigwPermissionApps',
          topMenu: 'home',
        },
      },
      {
        path: '/:id/permission/record',
        name: 'apigwPermissionRecords',
        component: ApigwPermissionRecords,
        meta: {
          title: '审批历史',
          matchRoute: 'apigwPermissionRecords',
          topMenu: 'home',
        },
      },
      {
        path: '/:id/log',
        name: 'apigwAccessLog',
        component: apigwAccessLog,
        meta: {
          title: '流水日志',
          matchRoute: 'apigwAccessLog',
          topMenu: 'home',
        },
      },
      {
        path: '/:id/access-log/:requestId',
        name: 'apigwAccessLogDetail',
        component: apigwAccessLogDetail,
        meta: {
          title: '流水日志',
          matchRoute: 'apigwAccessLogDetail',
          topMenu: 'home',
          isMenu: false,
        },
      },
      {
        path: '/:id/report',
        name: 'apigwReport',
        component: apigwReport,
        meta: {
          title: '统计报表',
          matchRoute: 'apigwReport',
          topMenu: 'home',
        },
      },
      {
        path: '/:id/monitor/alarm-strategy',
        name: 'apigwMonitorAlarmStrategy',
        component: ApigwMonitorAlarmStrategy,
        meta: {
          title: '告警策略',
          matchRoute: 'apigwMonitorAlarmStrategy',
          topMenu: 'home',
        },
      },
      {
        path: '/:id/monitor/alarm-history',
        name: 'apigwMonitorAlarmHistory',
        component: ApigwMonitorAlarmHistory,
        meta: {
          title: '告警历史',
          matchRoute: 'apigwMonitorAlarmHistory',
          topMenu: 'home',
        },
      },
      {
        path: '/:id/resource/import-doc',
        name: 'apigwResourceImportDoc',
        component: ApigwResourceImportDoc,
        meta: {
          title: '导入资源文档',
          matchRoute: 'apigwResource',
          topMenu: 'home',
          showBackIcon: true,
        },
      },
      {
        path: '/:id/basic',
        name: 'apigwBasicInfo',
        component: ApiBasicInfo,
        meta: {
          title: '基本信息',
          matchRoute: 'apigwBasicInfo',
          topMenu: 'home',
        },
      },
      {
        path: '/:id/audit',
        name: 'apigwOperateRecords',
        component: ApigwOperateRecords,
        meta: {
          title: '操作记录',
          matchRoute: 'apigwOperateRecords',
        },
      },
    ],
  },
  // 文档路由映射
  {
    path: `${globalConfig.PREV_URL}`,
    redirect: `${globalConfig.PREV_URL}/apigw-api/`,
    name: 'docsMain',
    component: docsComponent,
    children: [
      {
        path: 'apigw-api',
        name: 'apigwDoc',
        component: ApigwDocs,
        meta: {
          matchRoute: 'apigwDoc',
          topMenu: 'apigwDoc',
          notAppHeader: true,
          isDocRouter: true,
          isMenu: false,   // 是否作为侧边栏菜单
        },
      },
      {
        path: 'component-api',
        name: 'componentDoc',
        component: ComponentDoc,
        meta: {
          matchRoute: 'componentDoc',
          topMenu: 'componentDoc',
          notAppHeader: true,
          isDocRouter: true,
        },
      },
      {
        path: 'sdk/apigw',
        name: 'apigwSDK',
        component: ApigwSDK,
        meta: {
          matchRoute: 'apigwSDK',
          topMenu: 'apigwSDK',
          type: 'apigateway',
          isDocRouter: true,
        },
      },
      {
        path: 'sdk/esb',
        name: 'esbSDK',
        component: ApigwESBSDK,
        meta: {
          matchRoute: 'esbSDK',
          topMenu: 'esbSDK',
          type: 'esb',
          isDocRouter: true,
        },
      },
      {
        path: 'apigw-api/:apigwId/',
        name: 'apigwAPIDetail',
        component: ApigwAPIDetail,
        meta: {
          matchRoute: 'apigwAPIDetail',
          topMenu: 'apigwDoc',
          isDocRouter: true,
        },
        children: [
          {
            path: 'intro',
            alias: '',
            name: 'apigwAPIDetailIntro',
            component: ApigwAPIDetailIntro,
            meta: {
              matchRoute: 'apigwAPIDetailIntro',
              topMenu: 'apigwDoc',
              isDocRouter: true,
            },
          },
          {
            path: ':resourceId/doc',
            alias: '',
            name: 'apigwAPIDetailDoc',
            component: ApigwAPIDetailDoc,
            meta: {
              matchRoute: 'apigwAPIDetailDoc',
              topMenu: 'apigwDoc',
              isDocRouter: true,
            },
          },
        ],
      },
      {
        path: 'component-api/:version/:id',
        name: 'componentAPIDetail',
        component: ComponentAPIDetail,
        meta: {
          matchRoute: 'componentDoc',
          topMenu: 'componentDoc',
          isDocRouter: true,
        },
        children: [
          {
            path: 'intro',
            alias: '',
            name: 'ComponentAPIDetailIntro',
            component: ComponentAPIDetailIntro,
            meta: {
              matchRoute: 'componentDoc',
              topMenu: 'componentDoc',
              isDocRouter: true,
            },
          },
          {
            path: ':componentId/doc',
            alias: '',
            name: 'componentAPIDetailDoc',
            component: ComponentAPIDetailDoc,
            meta: {
              matchRoute: 'componentDoc',
              topMenu: 'componentDoc',
              isDocRouter: true,
            },
          },
        ],
      },
    ],
  },

  // 组件管理
  {
    path: '/components',
    name: 'componentsMain',
    component: ComponentsMain,
    redirect: '/components/access',
    meta: {
      title: '组件管理',
      matchRoute: 'componentsMain',
      topMenu: 'componentsMain',
    },
    children: [
      {
        path: 'intro',
        name: 'componentsIntro',
        component: ComponentsIntro,
        meta: {
          title: '简介',
          matchRoute: 'componentsIntro',
          topMenu: 'componentsMain',
        },
      },
      {
        path: 'system',
        name: 'componentsSystem',
        component: ComponentsSystem,
        meta: {
          title: '系统管理',
          matchRoute: 'componentsSystem',
          topMenu: 'componentsMain',
        },
      },
      {
        path: 'access',
        name: 'componentsManage',
        component: ComponentsManage,
        meta: {
          title: '组件管理',
          matchRoute: 'componentsManage',
          topMenu: 'componentsMain',
        },
      },
      {
        path: 'sync',
        name: 'syncApigwAccess',
        component: SyncApigwAccess,
        meta: {
          title: '同步组件配置到 API 网关',
          matchRoute: 'syncApigwAccess',
          topMenu: 'componentsMain',
          showBackIcon: true,
        },
      },
      {
        path: 'history',
        name: 'syncHistory',
        component: SyncHistory,
        meta: {
          title: '组件同步历史',
          matchRoute: 'syncHistory',
          topMenu: 'componentsMain',
          showBackIcon: true,
        },
      },
      {
        path: 'version',
        name: 'syncVersion',
        component: SyncVersion,
        meta: {
          title: '组件同步版本',
          matchRoute: 'syncVersion',
          topMenu: 'componentsMain',
          showBackIcon: true,
        },
      },
      {
        path: 'category',
        name: 'componentsCategory',
        component: ComponentsCategory,
        meta: {
          title: '文档分类',
          matchRoute: 'componentsCategory',
          topMenu: 'componentsMain',
        },
      },
      {
        path: 'permission',
        name: 'componentsPermission',
        component: docsComponent,
        meta: {
          title: '权限管理',
          matchRoute: 'componentsPermission',
          topMenu: 'componentsMain',
        },
        children: [
          {
            path: 'apply',
            name: 'permissionApply',
            component: ComponentsAudit,
            meta: {
              title: '权限审批',
              matchRoute: 'permissionApply',
              topMenu: 'componentsMain',
            },
          },
          {
            path: 'power',
            name: 'permissionPower',
            component: ComponentsPower,
            meta: {
              title: '应用权限',
              matchRoute: 'permissionPower',
              topMenu: 'componentsMain',
            },
          },
          {
            path: 'record',
            name: 'permissionRecord',
            component: ComponentsHistory,
            meta: {
              title: '审批历史',
              matchRoute: 'permissionRecord',
              topMenu: 'componentsMain',
            },
          },
        ],
      },
      {
        path: 'runtime-data',
        name: 'componentsRuntimeData',
        component: ComponentsRuntimeData,
        meta: {
          title: '实时运行数据',
          matchRoute: 'componentsRuntimeData',
          topMenu: 'componentsMain',
        },
      },
    ],
  },
];
export default createRouter({
  history: createWebHistory(window.SITE_URL),
  routes,
});
