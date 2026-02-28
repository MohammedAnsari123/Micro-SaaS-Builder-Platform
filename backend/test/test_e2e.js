const axios = require('axios');

async function testE2E() {
    try {
        console.log('--- E2E Test Started ---');

        const randomSuffix = Math.floor(Math.random() * 100000);
        const email = `testuser${randomSuffix}@example.com`;
        const tenantName = `TestTenant${randomSuffix}`;
        const password = 'password123';

        console.log(`1. Registering new user: ${email} for tenant: ${tenantName}...`);
        const regRes = await axios.post('http://localhost:5000/api/v1/auth/register', {
            name: 'Test User',
            email,
            password,
            tenantName
        });

        const token = regRes.data.accessToken;
        console.log('   Registration successful. Got Access Token.');

        console.log('2. Requesting AI generation of a new Tool (Task Manager)...');
        console.log('   Waiting for AI response (this may take up to 2-3 minutes depending on model load)...');

        const genRes = await axios.post(
            'http://localhost:5000/api/v1/tools/generate',
            {
                name: 'Task Manager E2E Tool',
                prompt: 'Create a simple Task Manager. It needs a Tasks collection with title, description, and status fields.'
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                timeout: 300000 // 5 minute timeout for LLM
            }
        );

        console.log('\n--- AI Generation Success ---');
        console.log(JSON.stringify(genRes.data, null, 2));

    } catch (err) {
        if (err.response) {
            console.error('Error response from server:', err.response.data);
        } else {
            console.error('Error:', err.message);
        }
    }
}

testE2E();
