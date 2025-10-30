pipeline {
    agent any

    environment {
        IMAGE_NAME = "thinkspace:latest"
        CONTAINER_NAME = "thinkspace"
        PORT = "3000"
    }

    stages {
        stage('Checkout') {
            steps {
                // Clones your public repo from GitHub
                git branch: 'main', url: 'https://github.com/Lindamlika96/Thinkspace-stage.git'
            }
        }

       stage('Build Docker Image') {
    steps {
        withCredentials([file(credentialsId: 'thinkspace-env', variable: 'ENV_FILE')]) {
            script {
                echo "🧱 Building Docker image for ThinkSpace with env vars..."

                // Copy the env file inside workspace
              // Copy the env file inside workspace
                sh '''
                    cp "$ENV_FILE" .env
                    echo "✅ Environment variables file injected:"
                    cat .env
                    docker build -t thinkspace:latest .
                '''

            }
        }
    }
}


    }

}
