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


def get_profile(subscription_key, profile_id):
    """Get a speaker's profile with given profile ID

    Arguments:
    subscription_key -- the subscription key string
    profile_id -- the profile ID of the profile to resets
    """
    helper = IdentificationServiceHttpClientHelper.IdentificationServiceHttpClientHelper(
        subscription_key)

    profile = helper.get_profile(profile_id)

    print('Profile ID = {0}\nLocale = {1}\nEnrollments Speech Time = {2}\nRemaining Enrollment Time = {3}\nCreated = {4}\nLast Action = {5}\nEnrollment Status = {6}\n'.format(
        profile._profile_id,
        profile._locale,
        profile._enrollment_speech_time,
        profile._remaining_enrollment_time,
        profile._created_date_time,
        profile._last_action_date_time,
        profile._enrollment_status))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print('Usage: python DeleteProfile.py <profile_id> ')
        print('\t<profile_id> the ID for a profile to delete from the sevice')
        sys.exit('Error: Incorrect usage.')

    subscription_key = GetSubscriptionKey.get_subscription_key()

    get_profile(subscription_key, sys.argv[1])

