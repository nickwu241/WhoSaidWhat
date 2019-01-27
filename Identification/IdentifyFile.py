#!/usr/bin/env python3
""" Copyright (c) Microsoft. All rights reserved.
Licensed under the MIT license.

Microsoft Cognitive Services (formerly Project Oxford): https://www.microsoft.com/cognitive-services

Microsoft Cognitive Services (formerly Project Oxford) GitHub:
https://github.com/Microsoft/ProjectOxford-ClientSDK

Copyright (c) Microsoft Corporation
All rights reserved.

MIT License:
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
"""

import IdentificationServiceHttpClientHelper
import GetSubscriptionKey
import sys
import json

def identify_file(subscription_key, file_path, force_short_audio, profile_ids):
    """Identify an audio file on the server.

    Arguments:
    subscription_key -- the subscription key string
    file_path -- the audio file path for identification
    profile_ids -- an array of test profile IDs strings
    force_short_audio -- waive the recommended minimum audio limit needed for enrollment
    """
    helper = IdentificationServiceHttpClientHelper.IdentificationServiceHttpClientHelper(
        subscription_key)

    identification_response = helper.identify_file(
        file_path, profile_ids,
        force_short_audio.lower() == "true")

    mapping = {
        "03f5cadf-309f-4228-8390-05007eb83ece": "Jimmy",
        "cd74bc8f-71c5-46cf-82d6-9f3f30dadc30": "Nick",
        "5d545b81-a3d9-4ea7-be55-aba94c7c1a05": "Sorina",
        "157e954b-6fe7-4d96-a9ac-f1135521e9fa": "Mickey Mouse"
    }

    print('Identified Speaker = {0}'.format(mapping.get(identification_response.get_identified_profile_id(),"Unknown")))
    print('Confidence = {0}'.format(identification_response.get_confidence()))

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print('Usage: python IdentifyFile.py <identification_file_path>'
              ' <profile_ids>...')
        print('\t<identification_file_path> is the audio file path for identification')
        print('\t<force_short_audio> True/False waives the recommended minimum audio limit needed '
              'for enrollment')
        print('\t<profile_ids> the profile IDs for the profiles to identify the audio from.')
        sys.exit('Error: Incorrect Usage.')

    subscription_key = GetSubscriptionKey.get_subscription_key()


    identify_file(subscription_key, sys.argv[1], sys.argv[2], sys.argv[3:])
