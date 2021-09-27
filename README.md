## Talk explaining this extension

https://www.youtube.com/watch?v=i9b5Yij_HV4

## Questions? Feedback? Join our slack

https://join.slack.com/t/trufflehog-community/shared_invite/zt-nzznzf8w-y1Lg4PnnLupzlYuwq_AUHA

## Install instructions

The extension is available for install here https://chrome.google.com/webstore/detail/trufflehog/bafhdnhjnlcdbjcdcnafhdcphhnfnhjc

Here's what to do if you find these keys:

## AWS keys
AWS has a rich API and sadely you may have to test a bunch of commands. List buckets might be a good start https://docs.aws.amazon.com/cli/latest/reference/s3api/list-buckets.html

## Slack webhook keys
These are a problem almost always, see https://cybersecurity.att.com/blogs/labs-research/slack-phishing-attacks-using-webhooks

## Algelia
These keys have access controls, a typical public key should not have access to the usage API, otherwise it could be an issue:
```
curl -X GET \
  -H "X-Algolia-API-Key: ${API_KEY}" \
  -H "X-Algolia-Application-Id: ${APPLICATION_ID}" \
  --compressed \
  "https://usage.algolia.com/1/usage/records?startDate=2020-07-15T00:00:00Z&endDate=2020-07-16T00:00:00Z&granularity=daily"
{"status":401,"message":"The provided API key is missing the \"usage\" ACL"}%
```

## Amplitude
You should not be able to export all data out of amplitude with a typical public key
```
curl -u API_Key:${KEY} 'https://amplitude.com/api/2/export?start=20150201T5&end=20150203T20'
<html><title>403: Forbidden</title><body>403: Forbidden</body></html>%
```

## Bugsnag API
You should not be able to pull the orginization name
```
curl --get 'https://api.bugsnag.com/user/organizations' \
       --header 'Authorization: token ${TOKEN}' \
       --header 'X-Version: 2'
{"errors":["Bad Credentials"]}%
```

## Google maps
This is untested, I found this repo for google map keys https://github.com/ozguralp/gmapsapiscanner

These keys also follow the same format for many other API's such as gmail/drive/cloud/etc... so this tool likely doesn't give full coverage

## Json web tokens
JWT's are interesting not just because they go to API's, but also because you can crack their secret in hashcat if they're alg `hs`
you can decode them here to figure out their algorithm https://jwt.io/
and you can crack them here https://hashcat.net/wiki/doku.php?id=example_hashes with flag `-m 16500`
