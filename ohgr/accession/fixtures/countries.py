# -*- coding: utf-8 -*-

"""
Setup the value for the country descriptors.
"""
import json
import sys
import os.path

from ..models import DescriptorType
from .descriptorstypes import DESCRIPTORS


def fixture():
    sys.stdout.write(" + Create descriptors values for countries...\n")

    # load JSON data
    handler = open(os.path.join('accession', 'fixtures', 'countries.json'), 'rU')
    data = json.loads(handler.read())
    handler.close()

    descriptor = DESCRIPTORS.get('country')
    results = {}

    # curate data
    for code, country in data.items():
        results[code] = {
            'name': country['name'],
            'iso': ''
        }

    if descriptor is not None and results is not None:
        DescriptorType.objects.filter(name=descriptor['name']).update(values=json.dumps(results))
