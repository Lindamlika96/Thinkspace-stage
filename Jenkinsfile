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
                // 🧩 Clone public repo
                git branch: 'main', url: 'https://github.com/Lindamlika96/Thinkspace-stage.git'
            }
        }

       stage('Build Docker Image') {
    steps {
        withCredentials([file(credentialsId: 'thinkspace-env', variable: 'ENV_FILE')]) {
            script {
                echo "🧱 Building Docker image for ThinkSpace with env vars..."
                sh '''
                    echo "📂 Copying env file safely..."
                    cat "$ENV_FILE" > .env
                    chmod 644 .env
                    echo "✅ Environment variables file injected:"
                    cat .env
                    docker build -t $IMAGE_NAME .
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
                        # Stop old container if exists
                        if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
                            echo "🧹 Stopping existing container..."
                            docker stop $CONTAINER_NAME || true
                        fi

                        # Remove old container if exists
                        if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
                            echo "🗑 Removing old container..."
                            docker rm $CONTAINER_NAME || true
                        fi

                        # Run the new container
                        echo "🚀 Starting new ThinkSpace container..."
                        docker run -d \
                            --name $CONTAINER_NAME \
                            --env-file .env \
                            -p $PORT:3000 \
                            $IMAGE_NAME

                        echo "✅ Deployment successful. Access app at: http://<your-ec2-public-ip>:3000"
                    '''
                }
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                    echo "🧹 Cleaning up Docker cache and old images..."
                    docker system prune -af --volumes || true
                '''
            }
        }
    }
}
