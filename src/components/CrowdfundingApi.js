const axios = require('axios');

const baseURL = window.location.href.includes("localhost") ? "http://localhost:8080" : "https://anudeepjami-crowdfunding-api.me";

export async function GetWalletDetails(wallet_address){
    try {
        var response = await axios
            .request({
                baseURL: baseURL,
                method: 'PUT',
                url: "/v1/getwallet",
                data: {
                    wallet_address: wallet_address
                }
            });
        return response.data;
    }
    catch (e) {
        return { message: e.message };
    }
}

export async function UpdateWalletDetails(wallet_details){
    try {
        var response = await axios
            .request({
                baseURL: baseURL,
                method: 'POST',
                url: "/v1/updatewallet",
                data: {
                    wallet_address: wallet_details.wallet_address,
                    email_id: wallet_details.email_id
                }
            });
        return response.data;
    }
    catch (e) {
        return { message: e.message };
    }
}