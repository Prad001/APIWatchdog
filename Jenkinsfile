pipeline {
    agent any

    environment {
        OPENROUTER_API_KEY = credentials('openrouter-api-key') // stored in Jenkins credentials
        PORT = "3000"
        ANGULAR_DEPLOY_DIR = "/var/lib/jenkins/html/APIWatchdog" // Jenkins-owned directory
    }

    stages {

        stage('Build Angular Client') {
            steps {
                script {
                    dir('client') {
                        // Install dependencies
                        sh 'npm install'

                        // Disable Angular analytics
                        sh 'npx ng analytics disable || true'

                        // Clear npm cache
                        sh 'npm cache clean --force || true'

                        // Build Angular with increased memory limit
                        sh 'node --max-old-space-size=896 ./node_modules/@angular/cli/bin/ng build --configuration production'

                        // Deploy Angular build to Jenkins-owned folder
                        sh "mkdir -p ${ANGULAR_DEPLOY_DIR}"
                        sh "rm -rf ${ANGULAR_DEPLOY_DIR}/*"
                        sh "cp -r ./dist/* ${ANGULAR_DEPLOY_DIR}/"
                    }
                }
            }
        }

        stage('Build Express Server') {
            steps {
                script {
                    dir('server') {
                        // Generate .env file dynamically
                        sh """
                            echo "OPENROUTER_API_KEY=${OPENROUTER_API_KEY}" > .env
                            echo "PORT=${PORT}" >> .env
                        """

                        // Clear npm cache and install dependencies
                        sh 'npm cache clean --force'
                        sh 'npm install'

                        // Build server TypeScript
                        sh 'npm run build'

                        // Start or restart Express server using PM2
                        sh 'pm2 restart dist/www.js --name APIWatchdog || pm2 start dist/www.js --name APIWatchdog'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Build and deployment completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
