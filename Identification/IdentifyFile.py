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

def identify_file(subscription_key, map_file, file_path, force_short_audio, profile_ids):
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

    print('Identified Speaker = {0}'.format(map_file.get(identification_response.get_identified_profile_id(),"Unknown")))
    print('Confidence = {0}'.format(identification_response.get_confidence()))

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print('Usage: python IdentifyFile.py <identification_file_path>'
              ' <profile_ids>...')
        print('\t<identification_file_path> is the audio file path for identification')
        print('\t<force_short_audio> True/False waives the recommended minimum audio limit needed '
              'for enrollment')
        # print('\t<profile_ids> the profile IDs for the profiles to identify the audio from.')
        sys.exit('Error: Incorrect Usage.')

    subscription_key = GetSubscriptionKey.get_subscription_key()

    # TODO: Fixed the absolute path to use os.path
    with open('./Identification/mapping.json') as f:
        data = json.load(f)

        group_ids = list(data.keys())

    identify_file(subscription_key, data, sys.argv[1], sys.argv[2], group_ids)#sys.argv[3:])
