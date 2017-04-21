# -*- coding: utf-8; -*-
#
# @file accessionsynonym.py
# @brief 
# @author Frédéric SCHERMA (INRA UMR1095)
# @date 2016-09-01
# @copyright Copyright (c) 2016 INRA/CIRAD
# @license MIT (see LICENSE file)
# @details 

"""
Views related to the accession synonym model.
"""

from django.core.exceptions import SuspiciousOperation
from django.db import IntegrityError
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.views.decorators.cache import cache_page
from django.utils.translation import ugettext_lazy as _

from accession.models import AccessionSynonym, Accession
from descriptor.models import DescriptorType
from igdectk.rest.handler import *
from igdectk.rest.response import HttpResponseRest

from .base import RestAccession
from .accession import RestAccessionAccession, RestAccessionId


class RestAccessionSynonymType(RestAccession):
    regex = r'^accession-synonym-type/$'
    name = 'accession-synonym-type'


class RestAccessionSynonym(RestAccessionAccession):
    regex = r'^synonym/$'
    suffix = 'synonym'


class RestAccessionSynonymSearch(RestAccessionSynonym):
    regex = r'^search/$'
    suffix = 'search'


class RestAccessionIdSynonym(RestAccessionId):
    regex = r'^synonym/$'
    suffix = 'synonym'


class RestAccessionIdSynonymId(RestAccessionIdSynonym):
    regex = r'^(?P<syn_id>[0-9]+)/$'
    suffix = 'id'


@cache_page(60*60*24)
@RestAccessionSynonymType.def_request(Method.GET, Format.JSON)
def synonym_type(request):
    """
    Get the list of type of synonym in JSON
    @todo how to refresh the cache and clients if values of descriptors changed ?
    """
    synonym_types = []

    # stored in a type of descriptor
    descriptor_type = get_object_or_404(DescriptorType, code=AccessionSynonym.DESCRIPTOR_TYPE_CODE)

    cursor_prev, cursor_next, values = descriptor_type.get_values(sort_by='id')

    for st in values:
        synonym_types.append({
            'id': st['id'],
            'value': st['id'],
            'label': st['value0']
        })

    return HttpResponseRest(request, synonym_types)


@RestAccessionSynonymSearch.def_auth_request(Method.GET, Format.JSON, ('filters',))
def search_accession_synonyms(request):
    """
    Quick search for an accession synonym with a exact or partial name.

    filters :
        - method : name filter method : 'ieq', 'icontains'
        - fields : requested field : 'name', 'type'
        - name : value for name field
    """
    filters = json.loads(request.GET['filters'])

    results_per_page = int_arg(request.GET.get('more', 30))
    cursor = request.GET.get('cursor')
    limit = results_per_page

    if cursor:
        cursor_name, cursor_id = cursor.rsplit('/', 1)

        qs = AccessionSynonym.objects.filter(Q(name__gt=cursor_name) | (
            Q(name=cursor_name) & Q(id__gt=cursor_id)))
    else:
        qs = AccessionSynonym.objects.all()

    if 'name' in filters['fields']:
        name_method = filters.get('method', 'ieq')

        if name_method == 'ieq':
            qs = qs.filter(name__iexact=filters['name'])
        elif name_method == 'icontains':
            qs = qs.filter(name__icontains=filters['name'])

    qs = qs.order_by('name', 'id')[:limit]

    items_list = []

    for synonym in qs:
        s = {
            'id': synonym.id,
            'value': synonym.id,
            'label': synonym.name,
            'type': synonym.type,
            'accession': synonym.accession_id
        }

        items_list.append(s)

    if len(items_list) > 0:
        # prev cursor (asc order)
        obj = items_list[0]
        prev_cursor = "%s/%i" % (obj['label'], obj['id'])

        # next cursor (asc order)
        obj = items_list[-1]
        next_cursor = "%s/%i" % (obj['label'], obj['id'])
    else:
        prev_cursor = None
        next_cursor = None

    results = {
        'perms': [],
        'items': items_list,
        'prev': prev_cursor,
        'cursor': cursor,
        'next': next_cursor,
    }

    return HttpResponseRest(request, results)


@RestAccessionIdSynonym.def_auth_request(
    Method.POST, Format.JSON, content={
        "type": "object",
        "properties": {
            "type": AccessionSynonym.TYPE_VALIDATOR,
            "language": AccessionSynonym.LANGUAGE_VALIDATOR,
            "name": AccessionSynonym.NAME_VALIDATOR
        },
    },
    perms={
        'accession.change_accession': _("You are not allowed to modify an accession"),
        'accession.add_accessionsynonym': _("You are not allowed to add a synonym of accession"),
    }
)
def accession_add_synonym(request, acc_id):
    accession = get_object_or_404(Accession, id=int(acc_id))

    result = {
        'type': request.data['type'],
        'name': request.data['name'],
        'language': request.data['language']
    }

    # check that type is in the values of descriptor
    if not AccessionSynonym.is_synonym_type(result['type']):
        raise SuspiciousOperation(_("Unsupported type of synonym"))

    if result['type'] == AccessionSynonym.TYPE_GRC_CODE:
        raise SuspiciousOperation(_("An accession cannot have more than one GRC code"))

    if result['type'] == AccessionSynonym.TYPE_PRIMARY:
        raise SuspiciousOperation(_("An accession cannot have more than one primary name"))

    # check if a similar synonyms exists into the accession or as primary name for another accession
    synonyms = AccessionSynonym.objects.filter(name__iexact=result['name'])

    for synonym in synonyms:
        # at least one usage, not compatible with primary synonym
        if result['type'] == AccessionSynonym.TYPE_GRC_CODE and synonym.accession_id != int(acc_id):
            raise SuspiciousOperation(_("The GRC code name of the accession could not be used as synonym"))

        # already used by another accession as a grc code name
        if synonym.is_grc_code():
            raise SuspiciousOperation(_("Synonym already used as a primary name"))

        # already used by this accession
        if synonym.accession_id == int(acc_id):
            raise SuspiciousOperation(_("Synonym already used into this accession"))

    accession_synonym = AccessionSynonym(
        accession=accession,
        name=result['name'],
        language=result['language'],
        type=result['type'])

    accession_synonym.save()

    accession.synonyms.add(accession_synonym)

    result['id'] = accession_synonym.id

    return HttpResponseRest(request, result)


@RestAccessionIdSynonymId.def_auth_request(
    Method.PUT, Format.JSON, content={
        "type": "object",
        "properties": {
            "name": AccessionSynonym.NAME_VALIDATOR
        },
    },
    perms={
        'accession.change_accession': _("You are not allowed to modify an accession"),
        'accession.change_accessionsynonym': _("You are not allowed to modify a synonym of accession"),
    }
)
def accession_change_synonym(request, acc_id, syn_id):
    accession = get_object_or_404(Accession, id=int(acc_id))
    accession_synonym = accession.synonyms.get(id=int(syn_id))

    name = request.data['name']

    # no changes
    if name == accession_synonym.name:
        return HttpResponseRest(request, {})

    # check if a similar synonyms exists into the accession or as primary name for another accession
    synonyms = AccessionSynonym.objects.filter(name__iexact=name).exclude(id=int(syn_id))

    for synonym in synonyms:
        # at least one usage, not compatible with GRC code
        if accession_synonym.type == AccessionSynonym.TYPE_GRC_CODE:
            raise SuspiciousOperation(_("The GRC code of accession could not be used by another synonym of accession"))

        # already used by another taxon as GRC code
        if synonym.is_grc_code():
            raise SuspiciousOperation(_("Synonym already used as a GRC code of accession"))

        # already used by this accession
        if synonym.accession_id == acc_id:
            raise SuspiciousOperation(_("Synonym already used into this accession"))

    try:
        with transaction.atomic():
            # rename the accession if the synonym is the GRC code name
            if accession_synonym.is_grc_code():
                accession.code = name
                accession.update_field('code')
                accession.save()
            # or if is the primary name
            elif accession_synonym.is_primary():
                accession.name = name
                accession.update_field('name')
                accession.save()

            accession_synonym.name = name
            accession_synonym.save()

            result = {
                'id': accession_synonym.id,
                'name': accession_synonym.name
            }
    except IntegrityError as e:
        logger.log(repr(e))
        raise SuspiciousOperation(_("Unable to rename a synonym of an accession"))

    return HttpResponseRest(request, result)


@RestAccessionIdSynonymId.def_auth_request(
    Method.DELETE, Format.JSON,
    perms={
        'accession.change_accession': _("You are not allowed to modify an accession"),
        'accession.delete_accessionsynonym': _("You are not allowed to delete a synonym of accession"),
    }
)
def accession_remove_synonym(request, acc_id, syn_id):
    accession = get_object_or_404(Accession, id=int(acc_id))
    synonym = accession.synonyms.get(id=int(syn_id))

    if synonym.is_grc_code():
        raise SuspiciousOperation(_("It is not possible to remove a GRC code name"))

    if synonym.is_primary():
        raise SuspiciousOperation(_("It is not possible to remove a primary name"))

    synonym.delete()

    return HttpResponseRest(request, {})

