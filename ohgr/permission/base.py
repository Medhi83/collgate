# -*- coding: utf-8; -*-
#
# Copyright (c) 2016 INRA UMR1095 GDEC

"""
ohgr permission rest handler
"""
from django.contrib.auth.models import Permission, User, Group
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import SuspiciousOperation
from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext_lazy as _

from guardian.models import UserObjectPermission

from igdectk.rest.handler import *
from igdectk.rest.response import HttpResponseRest


class RestPermission(RestHandler):
    regex = r'^permission/$'
    name = 'permission'


class RestPermissionType(RestPermission):
    regex = r'^type/$'
    suffix = 'type'


class RestPermissionUser(RestPermission):
    regex = r'^user/$'
    suffix = 'user'


class RestPermissionUserName(RestPermissionUser):
    regex = r'^(?P<username>[a-zA-Z0-9\.\-_]+)/$'
    suffix = 'username'


class RestPermissionGroup(RestPermission):
    regex = r'^group/$'
    suffix = 'group'


class RestPermissionGroupName(RestPermissionGroup):
    regex = r'^(?P<groupname>[a-zA-Z0-9\.\-_]+)/$'
    suffix = 'groupname'


@RestPermissionType.def_request(Method.GET, Format.JSON)
def get_permissions_types(request):
    """
    Get the list of permissions type in JSON
    """

    types = []
    for perm in Permission.objects.all().select_related('content_type'):
        types.append({'id': "%s.%s.%s" % (perm.content_type.app_label, perm.content_type.model, perm.codename) , 'value': perm.name})

    return HttpResponseRest(request, types)


@RestPermissionUser.def_admin_request(Method.GET, Format.JSON)
def get_users_list(request):
    query = User.objects.all()

    users = []

    response = {
        'users': users,
        'result': 'success'
    }

    for user in query:
        users.append({
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'is_active': user.is_active,
            'is_staff': user.is_staff
        })

    return HttpResponseRest(request, response)


@RestPermissionGroup.def_admin_request(Method.GET, Format.JSON)
def get_groups_list(request):
    groups = Group.objects.all()

    response = {
        'groups': [],
        'result': 'success'
    }

    for group in groups:
        response['groups'].add({
            'name': group.name,
            'num_users': group.user_set.all().count()
        })

    return HttpResponseRest(request, response)


@RestPermissionUserName.def_admin_request(Method.GET, Format.JSON)
def get_user_permissions(request, username):
    user = get_object_or_404(User, username=username)

    permissions = []

    response = {
        'username': user.username,
        'permissions': permissions,
        'result': 'success'
    }

    # from taxonomy.models import Taxon
    # content_type = ContentType.objects.get_by_natural_key('taxonomy', 'Taxon')
    # obj = get_object_or_404(Taxon, id=1)
    # UserObjectPermission.objects.assign_perm('change_taxon', user=User.objects.get(username='fscherma'), obj=obj)

    checkout = Permission.objects.filter(user=user).select_related('content_type')
    lookup = {}

    for perm in checkout:
        if perm.content_type.model in lookup:
            perms = lookup[perm.content_type.model]
        else:
            perms = []
            lookup[perm.content_type.model] = perms

        perms.append({
            'id': perm.codename,
            'name': perm.name,
            'app_label': perm.content_type.app_label,
        })

    for k, v in lookup.items():
        permissions.append({
            'permissions': v,
            'model': k,
            'object': None,
            'object_name': None,
        })

    checkout = UserObjectPermission.objects.filter(user=user).select_related('permission', 'content_type')
    lookup = {}

    for perm in checkout:
        obj_name = perm.content_type.get_object_for_this_type(id=perm.object_pk).name

        if (perm.object_pk, perm.content_type.model, obj_name) in lookup:
            perms = lookup[(perm.object_pk, perm.content_type.model, obj_name)]
        else:
            perms = []
            lookup[(perm.object_pk, perm.content_type.model, obj_name)] = perms

        perms.append({
            'id': perm.permission.codename,
            'name': perm.permission.name,
            'app_label': perm.content_type.app_label,
        })

    for k, v in lookup.items():
        permissions.append({
            'permissions': v,
            'model': k[1],
            'object': k[0],
            'object_name': k[2]
        })

    return HttpResponseRest(request, response)


@RestPermissionUserName.def_admin_request(Method.PATCH, Format.JSON, content={
    "type": "object",
    "properties": {
        "is_active": {"type": "boolean", "required": False}
    },
})
def patch_user_permission(request, username):
    user = get_object_or_404(User, username=username)
    update = False

    if 'is_active' in request.data:
        update = True
        user.is_active = request.data['is_active']

    if 'is_staff' in request.data:
        update = True
        user.is_staff = request.data['is_staff']

    if update:
        user.save()

    response = {'result': 'success'}

    return HttpResponseRest(request, response)


@RestPermissionUserName.def_admin_request(Method.POST, Format.JSON, content={
    "type": "object",
    "properties": {
        "permission": {
            "type": "object",
            "properties": {
                "permission": {"type": "string", 'minLength': 3, 'maxLength': 32},
                "content_type": {"type": "string", 'minLength': 3, 'maxLength': 64},
                "object": {"type": "string", 'maxLength': 255, 'optional': True},
            },
        },
    },
})
def add_user_permission(request, username):
    permission = request.data['permission']
    content_type = request.data['content_type']
    object_id = request.data['object']

    user = get_object_or_404(User, username=username)

    app_label, model = content_type.split('.')
    # content_type = get_object_or_404(ContentType, app_label=app_label, model=model)
    content_type = ContentType.objects.get_by_natural_key(app_label, model)

    if not object_id:
        perm = get_object_or_404(Permission, codename=permission, content_type=content_type)
        user.user_permissions.add(perm)
        response = {'result': 'success'}
    else:
        obj = get_object_or_404(content_type.model, id=object)
        UserObjectPermission.objects.assign_perm(permission, user=user, obj=obj)
        response = {'result': 'success'}

    return HttpResponseRest(request, response)


@RestPermissionUserName.def_admin_request(Method.DELETE, Format.JSON, content={
    "type": "object",
    "properties": {
        "permission": {
            "type": "object",
            "properties": {
                "permission": {"type": "string", 'minLength': 3, 'maxLength': 32},
                "content_type": {"type": "string", 'minLength': 3, 'maxLength': 64},
                "object": {"type": "string", 'maxLength': 255, 'optional': True},
            },
        },
    },
})
def delete_user_permission(request, username):
    permission = request.data['permission']
    content_type = request.data['content_type']
    object_id = request.data['object']

    user = get_object_or_404(User, username=username)

    app_label, model = content_type.split('.')
    # content_type = get_object_or_404(ContentType, app_label=app_label, model=model)
    content_type = ContentType.objects.get_by_natural_key(app_label, model)

    if not object_id:
        perm = get_object_or_404(Permission, codename=permission, content_type=content_type)
        user.user_permissions.remove(perm)
        response = {'result': 'success'}
    else:
        obj = get_object_or_404(content_type.model, id=object)
        UserObjectPermission.objects.remove_perm(permission, user=user, obj=obj)
        response = {'result': 'success'}

    return HttpResponseRest(request, response)


# TODO list, add, delete, permissions to group
# TODO add, delete, user from group
# TODO add, delete, group
