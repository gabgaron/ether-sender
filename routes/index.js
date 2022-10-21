let express = require('express');
let router = express.Router();

const publicAddress = "0xEcc179a1b25Dad72D022CD830F9d26221fcA8A81";

router.get('/', function(req, res) {
    res.render('index', {
        balance: getBalance(publicAddress),
        error: req.flash('error'),
        success: req.flash('success'),
        address: publicAddress
    });
});

router.post('/', async function (req, res) {
    let ethAmount = req.body.amount;
    let address = req.body.address;

    if (ethAmount === undefined || ethAmount === "") {
        req.flash('error', "The amount to sent must be given.");
        res.redirect("/");
        return;
    }

    if (isNaN(ethAmount)) {
        req.flash('error', "The amount must be numeric.");
        res.redirect("/");
        return;
    }

    if (address === undefined || address === "") {
        req.flash('error', "The recipient address must be given.");
        res.redirect("/");
        return;
    }

    // TODO: Test if the given ETH address is valid for the given network ...

    sendEthereum(address, ethAmount);
    req.flash('success', ethAmount + " ETH sent successfully to " + address
        + ". I may take up to few minutes before the transaction is completed.");
    res.redirect("/");
});

function getBalance(address) {
    // TODO: Retrieve the real ETH balance for a given address
    return parseFloat("0").toFixed(8);
}

function sendEthereum(toAddress, ethAmount) {
    // TODO: Proceed to do the real transfer ...
}

module.exports = router;
