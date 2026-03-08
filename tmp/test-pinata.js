const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function test() {
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MTRlMjY0Ny00ZGU5LTRjZTItYTA5Ny00N2EzMGYyNjNjNjciLCJlbWFpbCI6Im1heXVya2FydGhpY2syMDA2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI0MmE1MDI1YmZjNzliNmI5ZTEwZiIsInNjb3BlZEtleVNlY3JldCI6IjdkYWY5N2IyZmU5ODE3MGQ1NDY1ZDY2MjZkYjhjZjRjNWYwZmZkNzM3NzYwMGFkYjE1ZjllM2U1MTdjNDM2ZTciLCJleHAiOjE4MDM5NzI1Nzh9.q-DW4DWAJOg7rtOfZ6jXWUkvWgm8h9nkr9svYsSyttA';

    try {
        const formData = new FormData();
        formData.append('file', Buffer.from('hello world'), {
            filename: 'test.txt',
            contentType: 'text/plain'
        });

        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${jwt}`
            }
        });

        console.log('Success:', res.data);
    } catch (e) {
        console.error('Error:', e.response ? e.response.data : e.message);
    }
}

test();
