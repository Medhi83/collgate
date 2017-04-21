# -*- coding: utf-8; -*-
#
# @file descriptorstypes.py
# @brief 
# @author Frédéric SCHERMA (INRA UMR1095)
# @date 2017-01-03
# @copyright Copyright (c) 2017 INRA/CIRAD
# @license MIT (see LICENSE file)
# @details 

"""
Setup the types of descriptors.
"""

DESCRIPTORS = {
    'organisations_types': {
        'id': None,
        'name': 'organisations_types',
        'code': 'ORG_TYPE',
        'group': 'organisation',
        'can_delete': False,
        'can_modify': True,
        'description': 'List of types of organisations for an organisation',
        'format': {
            'type': 'enum_single',
            'trans': True,
            'fields': ('type',),
            'list_type': 'dropdown',
            'display_fields': 'value0',
            'sortby_field': 'value0'
        }
    }
}


def fixture(fixture_manager):
    fixture_manager.create_or_update_types(DESCRIPTORS)

