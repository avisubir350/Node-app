pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        SONAR_TOKEN = credentials('sonarqube-token')
        GIT_CREDENTIALS = credentials('github-credentials')
        DOCKER_IMAGE_NAME = 'avisubir/node-app'
        DOCKER_IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-credentials',
                    url: 'git@github.com:avisubir350/Node-app.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh "./mvnw sonar:sonar \
                        -Dsonar.projectKey=Node-app \
                        -Dsonar.host.url=https://sonarqube.example.com \
                        -Dsonar.login=${env.SONAR_TOKEN}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${env.DOCKER_IMAGE_NAME}:${env.DOCKER_IMAGE_TAG}")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        def customImage = docker.build("${env.DOCKER_IMAGE_NAME}:${env.DOCKER_IMAGE_TAG}")
                        customImage.push()
                        customImage.push('latest')
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
