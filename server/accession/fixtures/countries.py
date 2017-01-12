# -*- coding: utf-8 -*-

"""
Setup the value for the country descriptors.
"""
import json
import sys
import os.path

from descriptor.models import DescriptorType, DescriptorValue
from .descriptorstypes import DESCRIPTORS


def fixture():
    sys.stdout.write(" + Create descriptors values for countries...\n")

    # load JSON data
    handler = open(os.path.join('accession', 'fixtures', 'countries.json'), 'rU')
    data = json.loads(handler.read())
    handler.close()

    descriptor = DESCRIPTORS.get('country')

    if not descriptor or not descriptor.get('id'):
        raise Exception('Missing country descriptor')

    descriptor_object = DescriptorType.objects.get(id=descriptor['id'])

    # curate data
    for lang, subdata, in data.items():
        for code, country in subdata.items():
            value, created = DescriptorValue.objects.get_or_create(
                descriptor=descriptor_object,
                name="%s:%s" % (code, lang),
                language=lang,
                code=code,
                value0=country['name'],
                value1=country.get('iso_a2')
            )

            # keep for cities
            descriptor['lookup'][value.value1] = code

    # results = {}
    #
    # # curate data
    # for lang, subdata, in data.items():
    #     countries = {}
    #
    # for code, country in subdata.items():
    #     countries[code] = {
    #         'value0': country['name'],
    #         'value1': country.get('iso_a2')
    #     }
    #
    # results[lang] = countries
    #
    # if descriptor is not None and results is not None:
    #     DescriptorType.objects.filter(name=descriptor['name']).update(values=json.dumps(results))
