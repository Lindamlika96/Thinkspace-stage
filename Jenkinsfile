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
                // 🧩 Clone your public repo
                git branch: 'main', url: 'https://github.com/Lindamlika96/Thinkspace-stage.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([file(credentialsId: 'thinkspace-env', variable: 'ENV_FILE')]) {
                    script {
                        echo "🧱 Building Docker image for ThinkSpace with env vars..."

                        sh '''
                            echo "📂 Copying env file with sudo permissions..."
                            sudo cat "$ENV_FILE" > .env
                            sudo chmod 644 .env
                            echo "✅ Environment variables file injected:"
                            sudo cat .env

                            echo "🐳 Building Docker image..."
                            sudo docker build -t $IMAGE_NAME .
                        '''
                    }
                }
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    echo "🚀 Deploying ThinkSpace container..."

                    sh '''
                        echo "🧹 Checking existing containers..."
                        if [ "$(sudo docker ps -q -f name=$CONTAINER_NAME)" ]; then
                            echo "🛑 Stopping existing container..."
                            sudo docker stop $CONTAINER_NAME || true
                        fi

                        if [ "$(sudo docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
                            echo "🗑 Removing old container..."
                            sudo docker rm $CONTAINER_NAME || true
                        fi

                        echo "🚀 Running new container..."
                        sudo docker run -d \
                            --name $CONTAINER_NAME \
                            --env-file .env \
                            -p $PORT:3000 \
                            $IMAGE_NAME

                    '''
                }
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                    echo "🧹 Cleaning up Docker cache and old layers..."
                    sudo docker system prune -af --volumes || true
                '''
            }
        }
    }
}
