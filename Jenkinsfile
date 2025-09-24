pipeline {
    agent any

    environment {
        OPENROUTER_API_KEY = credentials('openrouter-api-key') // stored in Jenkins credentials
        PORT = "3000"
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
            }
        }
    }
}



        stage('Build Express Server') {
            steps {
                script {
                    dir('server') {
                        // 🔑 Generate .env file dynamically
                        sh '''
                            echo "OPENROUTER_API_KEY=$OPENROUTER_API_KEY" > .env
                            echo "PORT=$PORT" >> .env
                        '''
                        
                        sh 'npm cache clean --force'
                        sh 'npm install'
                        sh 'npm run build' // compile TypeScript into dist/
                        
                        // Don’t use `npm start` here in CI/CD (it blocks the pipeline).
                        // Instead, you can run with PM2 or systemd after deployment.
                        sh 'pm2 restart dist/www.js || pm2 start dist/www.js --name APIWatchdog'
                    }
                }
            }
        }
    }
}
