// index.js

const OrangeMoney = require('./OrangeMoney');
const sequelize = require('./config/db');
const Transaction = require('./models/transaction')(sequelize, require('sequelize').DataTypes);

require('dotenv').config();

const config = {
    clientId: process.env.OM_CLIENT_ID,
    clientSecret: process.env.OM_CLIENT_SECRET,
    authToken: process.env.OM_X_AUTH_TOKEN,
    merchantNumber: process.env.OM_MERCHANT_NUMBER,
    pin: process.env.OM_PIN
};

async function main() {
    try {
        // Sync DB
        await sequelize.sync();

        const om = OrangeMoney.getInstance(config);

        // Exemple de paiement
        const result = await om.initPayment(
            100,                        // Montant
            'order1234',             // Order ID
            'Je suis serge Noah je test l\'api OM',        // Description
            '690439748',           // Numéro du client
            'https://webhook.site/0ece9cf9-2232-4d2a-9c3e-14ef0100db09' // URL de notification
        );

        console.log("Réponse du paiement :", result);

        // Enregistrer dans la base
        const tx = await Transaction.create({
            payToken: result.data.payToken,
            orderId: result.data.orderId,
            amount: parseFloat(result.data.amount),
            status: result.data.status,
            description: result.data.description,
            subscriberMsisdn: result.data.subscriberMsisdn,
            txnid: result.data.txnid,
            createTime: result.data.createtime
        });

        console.log("Transaction sauvegardée:", tx.toJSON());

        // Vérifier le statut de maniere periodique jusqu'à ce que le statut soit "SUCCESS" ou "FAILED"
        const checkStatus = async (payToken) => {
            const statusResult = await om.getPaymentStatus(payToken);
            console.log("Statut de la transaction:", statusResult.data.status);

            if (statusResult.data.status === 'SUCCESS' || statusResult.data.status === 'FAILED') {
                return statusResult.data.status;
            } else {
                setTimeout(() => checkStatus(payToken), 10000); // Vérifier toutes les 5 secondes
            }
        };
        await checkStatus(result.data.payToken);
        

    } catch (error) {
    // Gérer les erreurs
    if (error.response) {
            console.error("Erreur de la réponse:", error.response.data);
        } else if (error.request) {
            console.error("Aucune réponse reçue:", error.request);
        } else {
            // Erreur lors de la configuration de la requête, le traceback est affiché
            console.error("Une erreur s'est produite:", error.message);
            console.error("Traceback:", error.stack);
        }
    }
}

main();