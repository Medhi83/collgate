# -*- coding: utf-8; -*-
#
# @file descriptormetamodeltype.py
# @brief coll-gate descriptor meta-model format type class
# @author Frédéric SCHERMA (INRA UMR1095)
# @date 2017-09-13
# @copyright Copyright (c) 2017 INRA/CIRAD
# @license MIT (see LICENSE file)
# @details

import validictory
from django.utils.translation import ugettext_lazy as _

from classification.models import Classification, ClassificationEntry
from descriptor.descriptormetamodeltype import DescriptorMetaModelType


class DescriptorMetaModelTypeClassificationEntry(DescriptorMetaModelType):
    """
    Specialisation for an accession entity.
    """

    def __init__(self):
        super().__init__()

        self.model = ClassificationEntry
        self.verbose_name = _("Classification entry")
        self.format_fields = ["classification"]

    def check(self, data):
        schema = {
            "type": "object",
            "properties": {
                "classification": {"type": "number"}
            }
        }

        try:
            validictory.validate(data, schema)
        except validictory.MultipleValidationError as e:
            return str(e)

        # check if the classification exists
        try:
            Classification.objects.get(id=int(data['classification']))
        except Classification.DoesNotExist:
            return _("The classification must refers to an existing object")

        return None
