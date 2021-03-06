const express = require('express');
const router = express.Router();
const exjwt = require('express-jwt');
const db = require('../models');
const isAuthenticated = exjwt({ secret: process.env.JWT_SECRET });

router.get('/:id', isAuthenticated, (req, res, next) => {
    db.EntryTrade.findById(req.params.id).then(trade => {
        res.status(200).json(trade);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Error occurred',
            error: err
        });
    });
});

router.get('/userTrades/:userId', isAuthenticated, (req, res, next) => {
    const queryProjection = '_id currency totalInvestment coinName tradingPair entryPrice totalCoins sold exitTrade user date'
    db.EntryTrade.find({ user: req.params.userId }).select(queryProjection).then(trades => {
        res.status(200).json(trades);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Error occurred',
            error: err
        });
    });
});

router.post('/', isAuthenticated, (req, res, next) => {
    const entryTrade = req.body;
    targetWallet = req.body.currency.toLowerCase();
    db.EntryTrade.create(entryTrade).then(trade => {
        const options = { useFindAndModify: false, new: true };
        return db.User.findByIdAndUpdate(trade.user, { $push: { entryTrades: trade._id } }, options);
    }).then(user => {
        const updatedTradingFunds = user.tradingWallet[targetWallet].funds - parseFloat(entryTrade.totalInvestment);
        user.tradingWallet[targetWallet].funds = updatedTradingFunds;
        return user.save();
    }).then(() => {
        res.status(201).json({
            message: 'Successfully created new entry trade!',
        });
    }).catch(err => {
        res.status(404).json({
            message: 'Error occurred',
            error: err
        });
    });
});

router.delete('/:id', isAuthenticated, (req, res, next) => {
    db.EntryTrade.findByIdAndDelete(req.params.id).then(trade => {
        const options = { useFindAndModify: false, new: true };
        db.User.findByIdAndUpdate(trade.user, { $pull: { entryTrades: trade._id }, options }).then(user => {
            const targetWallet = trade.currency.toLowerCase();
            const updatedTradingFunds = user.tradingWallet[targetWallet].funds + parseFloat(trade.totalInvestment);
            user.tradingWallet[targetWallet].funds = updatedTradingFunds;
            return user.save();
        });
    }).then(() => {
        res.status(200).json({
            message: 'Successfully deleted entry trade!'
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Error occurred',
            error: err
        });
    });
});

module.exports = router;
