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
        script {
            echo "🧱 Building Docker image for ThinkSpace..."

            // Optional: Check for .env file
            sh '''
                if [ ! -f .env ]; then
                    echo "⚠️ No .env file found — continuing without environment variables"
                else
                    echo "✅ .env file found:"
                    cat .env
                fi
            '''

            // Build the Docker image from Dockerfile
            sh 'docker build -t thinkspace:latest .'
        }
    }
}

    }

}
