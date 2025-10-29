pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "thinkspace-app"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo "Building Docker image..."
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Run Tests') {
            steps {
                echo "Running tests..."
                sh 'npm install'
                sh 'npm run test'
            }
        }

        stage('Push Image') {
            steps {
                echo "Tagging and pushing image to Docker Hub (placeholder)"
                // For now, we only tag locally; we’ll add ECR push later
                sh 'docker tag $DOCKER_IMAGE latest'
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying container locally (test stage)"
                sh 'docker run -d -p 3000:3000 $DOCKER_IMAGE'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
    }
}
