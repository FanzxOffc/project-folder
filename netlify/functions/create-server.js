const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    const { name, ram, panel } = JSON.parse(event.body);

    // DATABASE PANEL
    const panelConfigs = {
        panel1: {
            url: "https://alluffy.wibusoft.my.id",
            ptla: "ptla_QwOpRAQUDyAbTBq2DfMd6eWLHwgtA6qVeWAmj9o2ldS"
        },
        panel2: {
            url: "https://gadzzpablo.alluffystore.my.id",
            ptla: "ptla_krxXGcYAXpwoZxv9vhyMLgWpLTirASUES5PqslTZXKs"
        }
    };

    const selectedPanel = panelConfigs[panel];

    try {
        const response = await axios.post(`${selectedPanel.url}/api/application/servers`, {
            name: name,
            user: 1, // Pastikan ID User 1 ada di kedua panel
            egg: 15, // Sesuaikan ID Egg di panelmu
            docker_image: "ghcr.io/pterodactyl/yolks:nodejs_18",
            startup: "node index.js",
            limits: {
                memory: parseInt(ram),
                swap: 0,
                disk: 0,
                io: 500,
                cpu: 0
            },
            feature_limits: { databases: 1, allocations: 1, backups: 1 },
            deploy: { locations: [1], dedicated_ip: false, port_range: [] }
        }, {
            headers: {
                "Authorization": `Bearer ${selectedPanel.ptla}`,
                "Content-Type": "application/json",
                "Accept": "Application/vnd.pterodactyl.v1+json"
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ id: response.data.attributes.id })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                message: error.response?.data?.errors[0]?.detail || "API Failure" 
            })
        };
    }
};
