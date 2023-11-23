# -*- coding: utf-8 -*-
#
# TencentBlueKing is pleased to support the open source community by making
# 蓝鲸智云 - API 网关(BlueKing - APIGateway) available.
# Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.
# Licensed under the MIT License (the "License"); you may not use this file except
# in compliance with the License. You may obtain a copy of the License at
#
#     http://opensource.org/licenses/MIT
#
# Unless required by applicable law or agreed to in writing, software distributed under
# the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
# either express or implied. See the License for the specific language governing permissions and
# limitations under the License.
#
# We undertake not to change the open source license (MIT license) applicable
# to the current version of the project delivered to anyone in the future.
#
from ddf import G

from apigateway.apis.web.docs.gateway.gateway.views import GatewayListApi
from apigateway.core.constants import GatewayStatusEnum
from apigateway.core.models import Gateway, Release


class TestGatewayListApi:
    def test_list(self, request_view, fake_gateway):
        G(Release, gateway=fake_gateway)

        resp = request_view(
            method="GET",
            view_name="docs.gateway.list",
        )
        result = resp.json()

        assert resp.status_code == 200
        assert len(result["data"]["results"]) >= 1

    def test_filter_gateways(self, unique_gateway_name):
        view = GatewayListApi()

        # no release
        gateway = G(Gateway, name=unique_gateway_name, status=GatewayStatusEnum.ACTIVE.value, is_public=True)
        result = view._filter_gateways(unique_gateway_name)
        assert list(result.values_list("id", flat=True)) == []

        # ok
        G(Release, gateway=gateway)
        result = view._filter_gateways(unique_gateway_name)
        assert list(result.values_list("id", flat=True)) == [gateway.id]

        # inactive
        gateway.status = GatewayStatusEnum.INACTIVE.value
        gateway.is_public = True
        gateway.save()
        result = view._filter_gateways(unique_gateway_name)
        assert list(result.values_list("id", flat=True)) == []

        # not public
        gateway.status = GatewayStatusEnum.ACTIVE.value
        gateway.is_public = False
        gateway.save()
        result = view._filter_gateways(unique_gateway_name)
        assert list(result.values_list("id", flat=True)) == []


class TestGatewayRetrieveApi:
    def test_retrieve(self, request_view, fake_gateway):
        resp = request_view(
            method="GET",
            view_name="docs.gateway.retrieve",
            path_params={"gateway_name": fake_gateway.name},
            gateway=fake_gateway,
        )
        result = resp.json()

        assert resp.status_code == 200
        assert result["data"]["is_official"] is False

        fake_gateway.is_public = False
        fake_gateway.save()

        resp = request_view(
            method="GET",
            view_name="docs.gateway.retrieve",
            path_params={"gateway_name": fake_gateway.name},
            gateway=fake_gateway,
        )
        assert resp.status_code == 404
