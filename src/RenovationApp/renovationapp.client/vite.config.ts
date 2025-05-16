import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { homedir } from 'os';

const env = loadEnv(
    'all',
    process.cwd()
);

//console.log(homedir());

//console.log('env:', env); 

/* not working on other machine
const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;
*/
const baseFolder = path.join(homedir(), '.aspnet', 'https');
const certificateName = "renovationapp-client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

//for debugging certificate builds
console.log('certFilePath:', certFilePath);
console.log('exists:', fs.existsSync(certFilePath));
console.log('keyFileExists: ', fs.existsSync(keyFilePath));


if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
}

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        console.log("Certificate generation failed. Please run the following command to generate a certificate: dotnet dev-certs https --trust");
        throw new Error("Could not create certificate.");
    }
}

const target = env.VITE_BACKEND_URI ? env.VITE_BACKEND_URI : 'https://localhost/';

console.log('Target URI: ', target)

//const 

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@popperjs/core': path.resolve(__dirname, 'node_modules/@popperjs/core')
        }
    },
    optimizeDeps: {
        include: ['@popperjs/core']
    },
    server: {
        proxy: {
            '^/api/weatherforecast': {
                target,
                secure: false
            }
        },
        port: parseInt(env.DEV_SERVER_PORT || '63027'),
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
