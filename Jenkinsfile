stage('Checkout') {
    steps {
        // Clone your public GitHub repository
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
