# -*- coding: utf-8; -*-
#
# @file grc.py
# @brief coll-gate organisation REST API
# @author Frédéric SCHERMA (INRA UMR1095)
# @date 2017-01-03
# @copyright Copyright (c) 2017 INRA/CIRAD
# @license MIT (see LICENSE file)
# @details 

from django.utils.translation import ugettext_lazy as _

from igdectk.rest.handler import *
from igdectk.rest.response import HttpResponseRest
from organisation.models import GRC
from .base import RestOrganisationModule


class RestGRC(RestOrganisationModule):
    regex = r'^grc/$'
    name = 'grc'


class RestGRCOrganisation(RestGRC):
    regex = r'^organisation/$'
    name = 'organisation'


@RestGRC.def_auth_request(Method.GET, Format.JSON)
def get_grc_details(request):
    """
    Get details of the unique GRC model instance.
    """

    # take the unique GRC instance
    grc = GRC.objects.all()[0]

    response = {
        'id': grc.id,
        'name': grc.name,
        'identifier': grc.identifier,
        'description': grc.description
    }

    return HttpResponseRest(request, response)


@RestGRC.def_auth_request(Method.PUT, Format.JSON, content={
    "type": "object",
    "properties": {
        "name": GRC.NAME_VALIDATOR,
        "identifier": GRC.IDENTIFIER_VALIDATOR,
        "description": {"type": "string", 'minLength': 0, 'maxLength': 4096},
    },
}, perms={'organisation.change_grc': _('You are not allowed to modify the GRC')}
)
def update_grc(request):
    """
    Update the unique GRC model instance.
    """

    # take the unique GRC instance
    grc = GRC.objects.all()[0]

    grc.name = request.data.get('name')
    grc.identifier = request.data.get('identifier')
    grc.description = request.data.get('description')

    grc.save()

    response = {
        'id': grc.id,
        'name': grc.name,
        'identifier': grc.identifier,
        'description': grc.description
    }

    return HttpResponseRest(request, response)
