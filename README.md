## Overview ##

An AWS-SAM CloudFormation boilerplate for a Lambda that is invoked by an SQS event.

### To run: ###
```
sam build 
npm run local
```

## Includes
Jenkinsfile for mutliple environments and production.
template.yml for creation of a Lambda, with an SQS as trigger, plus dead letter queue.
