const axios = require('axios');

async function testClone() {
    try {
        // 1. Login to get token
        console.log("Logging in...");
        let loginData;
        try {
            const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
                email: 'test@example.com',
                password: 'password123'
            });
            loginData = loginRes.data;
        } catch (e) {
            console.log("Login failed, attempting register...");
            const regRes = await axios.post('http://localhost:5000/api/v1/auth/register', {
                name: "Test User",
                email: "test@example.com",
                password: "password123",
                tenantName: `TestTenant_${Date.now()}`
            });
            loginData = regRes.data;
        }

        const token = loginData.accessToken;
        console.log("Got token!", token.substring(0, 15) + "...");

        // 2. Fetch public tools to find one to clone
        const toolsRes = await axios.get('http://localhost:5000/api/v1/marketplace');
        const tools = toolsRes.data.data;
        if (tools.length === 0) {
            console.log("No public tools to clone.");
            return;
        }
        const targetTool = tools[0]._id;
        console.log(`Attempting to clone Tool: ${targetTool}`);

        // 3. Attempt Clone
        const cloneRes = await axios.post(
            `http://localhost:5000/api/v1/marketplace/clone/${targetTool}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Clone Success:", cloneRes.data);

    } catch (error) {
        console.log("Error occurred:");
        console.dir(error.response ? error.response.data : error.message, { depth: null });
    }
}

testClone();
