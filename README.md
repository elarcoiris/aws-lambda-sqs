# Overview #

An AWS-SAM CloudFormation boilerplate for a Lambda that is invoked by an SQS event. It includes Jenkins pipeline, SonarQube, and enables deployment to AWS development and production environments.

## Install AWS-SAM-CLI ##

For the easiest installation, use Homebrew for Mac:

```bash
brew tap aws/tap
brew install aws-sam-cli
```

For other users:
<https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html>

## To run ##

```bash
sam build 
npm run local
```

### Includes ###

Jenkinsfile for mutliple environments and production.

template.yml for creation of a Lambda, with an SQS as trigger, plus dead letter queue.
