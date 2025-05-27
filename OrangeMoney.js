// OrangeMoney.js

const axios = require('axios');
const { Buffer } = require('buffer');

class OrangeMoney {
    constructor(config) {
        this.apiUrl = 'https://api-s1.orange.cm';
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.authToken = config.authToken; // X-AUTH-TOKEN
        this.merchantNumber = config.merchantNumber;
        this.pin = config.pin 

        this.accessToken = null;
        this.tokenExpiry = null;
    }

    static _instance = null;

    static getInstance(config) {
        if (!this._instance || !this._instance.isTokenValid()) {
            this._instance = new OrangeMoney(config);
        }
        return this._instance;
    }

    isTokenValid() {
        return this.accessToken && Date.now() < this.tokenExpiry;
    }

    async getAccessToken() {
        if (this.isTokenValid()) {
            return this.accessToken;
        }

        const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
        const url = `${this.apiUrl}/token`;

        try {
            const response = await axios.post(url, 'grant_type=client_credentials', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`
                },
                httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) // -k équivalent
            });

            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000); // expires_in en secondes
            return this.accessToken;
        } catch (error) {
            console.error("Erreur lors de l'obtention du token:", error);
            throw error;
        }
    }

    async initPayment(amount, orderId, description, subscriberMsisdn, notifUrl) {
        const token = await this.getAccessToken();
        const url = `${this.apiUrl}/omcoreapis/1.0.2/mp/init`;

        try {
            const response = await axios.post(url, {}, {
                headers: {
                    'X-AUTH-TOKEN': this.authToken,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
            });

            const payToken = response.data.data.payToken;
            return await this.makePayment(token, payToken, amount, orderId, description, subscriberMsisdn, notifUrl);
        } catch (error) {
            console.error("Erreur à l'initialisation du paiement:", error.message);
            throw error;
        }
    }

    async makePayment(token, payToken, amount, orderId, description, subscriberMsisdn, notifUrl) {
        const url = `${this.apiUrl}/omcoreapis/1.0.2/mp/pay`;
        const body = {
            notifUrl,
            channelUserMsisdn: this.merchantNumber,
            amount: String(amount),
            subscriberMsisdn,
            pin: this.pin,
            orderId,
            description,
            payToken
        };

        try {
            const response = await axios.post(url, body, {
                headers: {
                    'X-AUTH-TOKEN': this.authToken,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
            });

            return response.data;
        } catch (error) {
            console.error("Erreur lors du paiement:", error.message);
            throw error;
        }
    }

    async checkTransactionStatus(payToken) {
        const token = await this.getAccessToken();
        const url = `${this.apiUrl}/omcoreapis/1.0.2/mp/paymentstatus/${payToken}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'X-AUTH-TOKEN': this.authToken,
                    'Authorization': `Bearer ${token}`
                },
                httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
            });

            return response.data;
        } catch (error) {
            console.error("Erreur lors de la vérification de transaction:", error.message);
            throw error;
        }
    }
}

module.exports = OrangeMoney;