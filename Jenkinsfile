#!/usr/bin/groovy

@Library('inspirare-jenkins-pipeline-library@master') _

pipeline {
    agent none
    environment {
        APP_TYPE = "AWSLambdaSQS"
        APP_VERSION = setVersion(true)
        AWS_REGION = "ap-southeast-2"
        S3_BUCKET = "s3-vpc01-lambda-deployment-inspirareadmin01"
    }
    options {
        buildDiscarder(
            logRotator(numToKeepStr: '100', daysToKeepStr: '30', artifactNumToKeepStr: '20', artifactDaysToKeepStr: '10')
        )
        timestamps()
    }
    stages {
        stage('Build and Test') {
            agent {
                label "node-14"
            }
            environment {
                NODE_ENV = "test"
            }
            steps {
                sh "npm config set registry https://example.io/repo/npm"
                sh "npm ci"
                sh "npm run test:coverage"
                withSonarQubeEnv("sonar.inspirare.io") {
                    sh "sonar-scanner -Dsonar.projectVersion=${APP_VERSION}"
                }
            }
        }
        stage('Sonar Quality Gate') {
            agent none
            when {
                not {
                    branch "PR-*"
                }
            }
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        stage('Build and Zip') {
            agent {
                label "node-14"
            }
            environment {
                NODE_ENV = "test"
            }
            when {
                beforeAgent true
                anyOf {
                    branch "master"
                    branch "develop"
                }
            }
            steps {
                sh "npm ci"
                sh "npm run clean"
                sh "npm run build"
                sh "npm ci --production"
                sh "zip -r ${APP_TYPE}-${APP_VERSION}.zip node_modules"
                dir("dist") {
                    sh "zip -ur ../${APP_TYPE}-${APP_VERSION}.zip ."
                }
                stash name: "package_zip", includes: "${APP_TYPE}-${APP_VERSION}.zip"
            }
        }
        stage('Upload zip to S3') {
            agent any
            environment {
                AWS_ACCOUNT_ID = "1234567890"
            }
            when {
                beforeAgent true
                anyOf {
                    branch "master"
                    branch "develop"
                }
            }
            steps {
                unstash "package_zip"
                withAWS(role: "assumed-jenkins", roleAccount:"${AWS_ACCOUNT_ID}", region:"${AWS_REGION}") {
                    s3Upload(file:"${APP_TYPE}-${APP_VERSION}.zip", bucket:"${S3_BUCKET}", path:"${APP_TYPE}/")
                }
            }
        }
        stage('Git tag') {
            agent any
            when {
                beforeAgent true
                branch "master"
            }
            steps {
                script {
                    if ("${BRANCH_NAME}" == "master") {
                        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'github-inspirare-admin', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                            sh("git tag -a ${APP_VERSION} -m 'Version ${APP_VERSION}'")
                            sh("git push https://${USERNAME}:${PASSWORD}@github.com/inspirare/${APP_TYPE}.git --tags")
                        }
                    }
                }
            }
        }
        stage('Deploy dev') {
            agent any 
            when {
                beforeAgent true
                branch "develop"
            }
            environment {
                AWS_ACCOUNT_ID = "1234567890"
                ENV = "dev"
            }
            steps {
                ansibleDeploy(
                    awsAccount: "${AWS_ACCOUNT_ID}",
                    env: "${ENV}",
                    appType: "${APP_TYPE}",
                    appVersion: "${APP_VERSION}",
                    protectedDeployment: false
                )
            }
        }
        stage('Deploy sit') {
            agent any 
            when {
                beforeAgent true
                beforeInput true
                branch "develop"
            }
            environment {
                AWS_ACCOUNT_ID = "1234567890"
                ENV = "sit"
            }
            input {
                message "Release to SIT?"
                ok "OK"
            }
            options {
                timeout(time: 7, unit: 'DAYS')
            }
            steps {
                ansibleDeploy(
                    awsAccount: "${AWS_ACCOUNT_ID}",
                    env: "${ENV}",
                    appType: "${APP_TYPE}",
                    appVersion: "${APP_VERSION}",
                    protectedDeployment: false
                )
            }
        }
        stage('Deploy stg') {
            agent any
            when {
                beforeAgent true
                branch "master"
            }
            environment {
                AWS_ACCOUNT_ID = "1234567890"
                ENV = "stg"
            }
            steps {
                ansibleDeploy(
                    awsAccount: "${AWS_ACCOUNT_ID}",
                    env: "${ENV}",
                    appType: "${APP_TYPE}",
                    appVersion: "${APP_VERSION}",
                    protectedDeployment: false
                )
            }
        }
        stage('Deploy prd') {
            agent any
            when {
                beforeAgent true
                beforeInput true
                branch "master"
            }
            environment {
                AWS_ACCOUNT_ID = "1234567890"
                ENV = "prd"
            }
            input {
                message "Release to PRD?"
                ok "OK"
            }
            options {
                timeout(time: 30, unit: 'DAYS')
            }
            steps {
                ansibleDeploy(
                    awsAccount: "${AWS_ACCOUNT_ID}",
                    env: "${ENV}",
                    appType: "${APP_TYPE}",
                    appVersion: "${APP_VERSION}",
                    protectedDeployment: true
                )
            }
        }
    }
}