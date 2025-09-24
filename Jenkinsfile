pipeline {
    agent any

    environment {
        OPENROUTER_API_KEY = credentials('openrouter-api-key') // Jenkins credentials
        PORT = "3000"
        ANGULAR_DIST_PATH = "/var/www/html/APIWatchdog"
    }

    stages {

stage('Build Angular Client') {
    steps {
        script {
            dir('client') {
                sh 'npm install'
                sh 'npx ng analytics disable || true'
                sh 'npm cache clean --force || true'
                sh 'node --max-old-space-size=896 ./node_modules/@angular/cli/bin/ng build --configuration production'

                // Deploy Angular build (no sudo)
                sh """
                    rm -rf $ANGULAR_DIST_PATH/*
                    cp -r dist/client/* $ANGULAR_DIST_PATH/
                """
            }
        }
    }
}


        stage('Build Express Server') {
            steps {
                script {
                    dir('server') {
                        // 🔑 Generate .env file dynamically
                        sh """
                            echo "OPENROUTER_API_KEY=$OPENROUTER_API_KEY" > .env
                            echo "PORT=$PORT" >> .env
                        """

                        sh 'npm cache clean --force'
                        sh 'npm install'
                        sh 'npm run build'  // compile TypeScript into dist/

                        // Stop old PM2 process if running
                        sh 'pm2 delete APIWatchdog || true'

                        // Start server with PM2
                        sh 'pm2 start dist/www.js --name APIWatchdog --update-env'
                        
                        // Save PM2 process list for auto-restart on reboot
                        sh 'pm2 save'
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful!"
        }
        failure {
            echo "Deployment failed. Check logs."
        }
    }
}
