# -*- coding: utf-8; -*-
#
# Copyright (c) 2016 INRA UMR1095 GDEC

"""
ohgr permission utilities
"""
from django.contrib.auth.models import Group
from guardian.core import ObjectPermissionChecker


def get_permissions_for(user_or_group, app_label, model, obj=None):
    if isinstance(user_or_group, Group):
        perms = user_or_group.permissions.all()
    else:
        perms = user_or_group.get_all_permissions()

    results = []

    for perm in perms:
        p = perm.split('_')
        if perm.startswith(app_label) and (len(p) > 0) and (p[1] == model):
            results.append(perm)

    if obj:
        if isinstance(user_or_group, Group):
            perms = ObjectPermissionChecker(user_or_group).get_perms(obj=obj)
        else:
            perms = user_or_group.get_all_permissions(obj=obj)

        for perm in perms:
            p = perm.split('_')
            if perm.startswith(app_label) and (len(p) > 0) and (p[1] == model):
                if (len(p) == 2) and p[2] == 'true':
                    results.append(perm)
                else:
                    results.append(perm)

    return results
