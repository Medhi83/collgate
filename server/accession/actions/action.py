# -*- coding: utf-8; -*-
#
# @file action
# @brief collgate 
# @author Frédéric SCHERMA (INRA UMR1095)
# @date 2018-01-05
# @copyright Copyright (c) 2018 INRA/CIRAD
# @license MIT (see LICENSE file)
# @details

import json

from django.core.exceptions import SuspiciousOperation
from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext_lazy as _

from accession.actions.actioncontroller import ActionController
from accession.actions.actionstepformat import ActionStepFormatManager
from accession.base import RestAccession
from accession.batch import RestBatchId
from accession.models import Action, Accession, ActionType, Batch

from igdectk.common.helpers import int_arg
from igdectk.rest import Method, Format
from igdectk.rest.response import HttpResponseRest


class RestAction(RestAccession):
    regex = r'^action/$'
    name = 'action'


class RestActionId(RestAccession):
    regex = r'^(?P<bat_id>[0-9]+)/$'
    suffix = 'id'


class RestBatchIdAction(RestBatchId):
    regex = r'^action/$'
    suffix = 'action'


class RestBatchIdActionCount(RestBatchIdAction):
    regex = r'^count/$'
    suffix = 'count'


# @todo how to precise which collection when boolean ? temporary panel ?
@RestAction.def_auth_request(
    Method.POST, Format.JSON, content={
        "type": "object",
        "properties": {
            "name": Action.NAME_VALIDATOR,
            "type": {"type": "number"}
        },
    }, perms={
        'accession.add_action': _("You are not allowed to create an action")
    })
def create_action(request):
    action_type_id = int_arg(request.data.get('type'))
    name = request.data.get('name')
    user = request.user

    action_type = get_object_or_404(Action, pk=action_type_id)

    action_controller = ActionController(action_type, user)
    action = action_controller.create(name)

    results = {
        'id': action.id,
        'name': action.name,
        'description': action.description,
        'completed': action.completed,
        'user': user.username,
        'action_type': action.action_type_id,
        'data': action.data
    }

    return HttpResponseRest(request, results)


# @todo how to precise which collection when boolean ? temporary panel ?
@RestActionId.def_auth_request(
    Method.PATCH, Format.JSON, content={
        "type": "object",
        "properties": {
            "inputs": {
                "type": [{
                    "type": "object",
                    "properties": {
                        "op": {"type": "string", "enum": ['in', 'notin']},
                        "term": {"type": "string"},
                        "value": {"type": "array", "minItems": 0, "maxItems": 32768, "additionalItems": {"type": "number"}, "items": []}
                    },
                }, {
                    "type": "boolean"
                }]
            }
        },
    }, perms={
        'accession.change_action': _("You are not allowed to modify an action")
    })
def update_action(request, act_id):
    inputs = request.data.get('inputs')
    user = request.user

    action = get_object_or_404(Action, pk=int(act_id))
    action_type = action.type

    inputs_entities = []

    if inputs is not None and type(inputs) is bool:
        # @todo from which collection ?
        pass
    else:
        if inputs["op"] == "in":
            pass
    #         input_batches = Batch.objects.filter(id__in=inputs["value"])
        elif inputs["op"] == "notin":
            pass
    #         input_batches = Batch.objects.all().exclude(id__in=inputs["value"])

    step_index = len(action.data.get('steps', []))
    format_steps = action_type.format.get('steps', [])

    if step_index >= len(format_steps):
        raise SuspiciousOperation("Trying to process more steps than allowed")

    action_controller = ActionController(action)
    action_controller.process_step(step_index, inputs_entities)

    result = {
        'id': action.id,
        'user': action.user,
        'data': action.data,
        'type': action.type_id
    }

    return HttpResponseRest(request, result)


# @todo how to list action for accession or a batch ? (input, outputs...)

# @RestBatchIdAction.def_auth_request(Method.GET, Format.JSON, perms={
#     'accession.get_action': _("You are not allowed to get an action"),
#     'accession.list_action': _("You are not allowed to list actions")
# })
# def get_batch_id_action_list(request, bat_id):
#     results_per_page = int_arg(request.GET.get('more', 30))
#     cursor = json.loads(request.GET.get('cursor', 'null'))
#     limit = results_per_page
#     sort_by = json.loads(request.GET.get('sort_by', '[]'))
#
#     # @todo how to manage permission to list only auth actions
#
#     if not len(sort_by) or sort_by[-1] not in ('id', '+id', '-id'):
#         order_by = sort_by + ['id']
#     else:
#         order_by = sort_by
#
#     from main.cursor import CursorQuery
#     cq = CursorQuery(Action)
#
#     # @todo filter for action relating this batch as input...
#     cq.join('input_batches')
#     # cq.filter(input_batches__in=int(bat_id))
#
#     if request.GET.get('search'):
#         search = json.loads(request.GET['search'])
#         cq.filter(search)
#
#     if request.GET.get('filters'):
#         filters = json.loads(request.GET['filters'])
#         cq.filter(filters)
#
#     cq.cursor(cursor, order_by)
#     cq.order_by(order_by).limit(limit)
#     # print(cq.sql())
#     batch_action_list = []
#
#     for action in cq:
#         a = {
#             'id': action.id,
#             'accession': action.accession_id,
#             'type': action.type_id,
#             'data': action.data,
#             'created_date': action.created_date.strftime("%Y-%m-%d %H:%M:%S")
#         }
#
#         batch_action_list.append(a)
#
#     results = {
#         'perms': [],
#         'items': batch_action_list,
#         'prev': cq.prev_cursor,
#         'cursor': cursor,
#         'next': cq.next_cursor,
#     }
#
#     return HttpResponseRest(request, results)
#
#
# @RestBatchIdActionCount.def_auth_request(Method.GET, Format.JSON, perms={
#     'accession.list_action': _("You are not allowed to list the actions")
# })
# def get_batch_id_action_list_count(request, bat_id):
#     from main.cursor import CursorQuery
#     cq = CursorQuery(Action)
#
#     if request.GET.get('search'):
#         search = json.loads(request.GET['search'])
#         cq.filter(search)
#
#     if request.GET.get('filters'):
#         filters = json.loads(request.GET['filters'])
#         cq.filter(filters)
#
#     # @todo filter for action relating this batch as input...
#     cq.join('input_batches')
#
#     count = cq.count()
#     # cq.filter(input_batches__in=int(bat_id))
#
#     results = {
#         'count': count
#     }
#
#     return HttpResponseRest(request, results)
