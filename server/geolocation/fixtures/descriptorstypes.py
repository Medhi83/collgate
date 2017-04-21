# -*- coding: utf-8; -*-
#
# @file descriptorstypes.py
# @brief 
# @author Medhi BOULNEMOUR (INRA UMR1095)
# @date 2017-01-03
# @copyright Copyright (c) 2017 INRA/CIRAD
# @license MIT (see LICENSE file)
# @details 

"""
Setup the types of descriptors.
"""

import json
import sys

from descriptor.models import DescriptorType
from .descriptorsgroups import GROUPS

DESCRIPTORS = {
    'geolocation': {
        'id': None,
        'name': 'geolocation',
        'code': 'GE_001',
        'group': 'common',
        'can_delete': False,
        'can_modify': False,
        'description': 'Defines a default geolocation.',
        'format': {
            'type': 'geolocation'
        }
    },
    'country': {
        'id': None,
        'name': 'country',
        'code': 'GE_002',
        'group': 'common',
        'can_delete': False,
        'can_modify': False,
        'description': 'Defines a country location.',
        'format': {
            'type': 'country'
        }
    },
    'city': {
        'id': None,
        'name': 'city',
        'code': 'GE_003',
        'group': 'common',
        'can_delete': False,
        'can_modify': False,
        'description': 'Defines a city location.',
        'format': {
            'type': 'city'
        }
    }
}


def fixture(fixture_manager):
    fixture_manager.create_or_update_types(DESCRIPTORS)

