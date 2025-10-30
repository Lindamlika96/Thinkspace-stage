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
              sh '''
  cat "$ENV_FILE" > .env
  docker build \
    --build-arg OPENAI_API_KEY=$(grep OPENAI_API_KEY .env | cut -d '=' -f2) \
    --build-arg OPENROUTER_API_KEY=$(grep OPENROUTER_API_KEY .env | cut -d '=' -f2) \
    --build-arg NEXTAUTH_SECRET=$(grep NEXTAUTH_SECRET .env | cut -d '=' -f2) \
    --build-arg DATABASE_URL=$(grep DATABASE_URL .env | cut -d '=' -f2) \
    --build-arg NEO4J_URI=$(grep NEO4J_URI .env | cut -d '=' -f2) \
    --build-arg NEO4J_USERNAME=$(grep NEO4J_USERNAME .env | cut -d '=' -f2) \
    --build-arg NEO4J_PASSWORD=$(grep NEO4J_PASSWORD .env | cut -d '=' -f2) \
    -t thinkspace:latest .
'''

            }
        }
    }
}


    }

}
