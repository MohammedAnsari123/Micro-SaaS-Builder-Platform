const axios = require('axios');
const mongoose = require('mongoose');

async function testCloneEngine() {
    try {
        console.log("1. Authenticating as admin/owner tenant...");
        const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
            email: 'admin@saasforge.com',
            password: 'password123'
        });

        const token = loginRes.data.token;
        console.log("✅ Authenticated. Token received.");

        console.log("2. Fetching list of public templates...");
        const templatesRes = await axios.get('http://localhost:5000/api/v1/templates');
        const templates = templatesRes.data.data;
        const crmTemplate = templates.find(t => t.slug === 'crm');
        console.log(`✅ Found CRM Template ID: ${crmTemplate._id}`);

        console.log("3. Triggering Clone Engine on CRM Template...");
        const cloneRes = await axios.post(`http://localhost:5000/api/v1/templates/${crmTemplate._id}/clone`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("✅ Clone Engine Success!");
        console.log(JSON.stringify(cloneRes.data.data, null, 2));

    } catch (err) {
        console.error("❌ Test Failed:", err.response ? err.response.data : err.message);
    }
}

testCloneEngine();
