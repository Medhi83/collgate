# -*- coding: utf-8; -*-
#
# @file descriptorsgroups.py
# @brief 
# @author Frédéric SCHERMA (INRA UMR1095)
# @date 2017-01-03
# @copyright Copyright (c) 2017 INRA/CIRAD
# @license MIT (see LICENSE file)
# @details 

"""
Setup the groups of descriptors.
"""

GROUPS = {
    'common': {
        'id': None,
        'name': 'common',
        'can_delete': False,
        'can_modify': False
    },
}


def fixture(fixture_manager):
    fixture_manager.create_or_update_groups(GROUPS)

