import React, { Component } from 'react';
import { Container, Row, Col, Table, Button } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import withAuth from '../withAuth/withAuth';
import UserNavbar from '../UserNavbar/UserNavbar';
import DeleteTradeModal from '../DeleteTradeModal/DeleteTradeModal';
import SellTradeModal from './SellTradeModal';
import TradeInfoModal from '../TradeInfoModal/TradeInfoModal';

const TableRow = ({ trade, updateTrades, history }) => {
    const date = moment.utc(trade.date).local().format('MM/D/YYYY');
    const time = moment.utc(trade.date).local().format('h:mm a');
    let ActionButton =
        <div className='d-flex'>
            <SellTradeModal trade={trade} history={history} />
            &ensp;
            <DeleteTradeModal type='entryTrade' tradeId={trade._id} updateTrades={updateTrades} />
        </div>;
    if (trade.sold === true) {
        ActionButton =
            <div className='d-flex'>
                <TradeInfoModal type='exitTrade' oppTradeId={trade.exitTrade} />
                &ensp;
                <DeleteTradeModal type='entryTrade' tradeId={trade._id} updateTrades={updateTrades} />
            </div>;
    };
    return (
        <tr>
            <th scope="row">{date},<br />{time}</th>
            <td>{trade.tradingPair}</td>
            <td>{trade.totalInvestment} {trade.currency}</td>
            <td>{trade.entryPrice} {trade.currency}</td>
            <td>{trade.totalCoins} {trade.coinName}</td>
            <td>{ActionButton}</td>
        </tr >
    );
};

const TableBody = ({ trades, updateTrades, history }) => {
    const tradeRows = trades.map(trade => {
        return <TableRow key={trade._id} trade={trade} updateTrades={updateTrades} history={history} />
    });
    return (
        <tbody>
            {tradeRows}
        </tbody>
    );
};

class EntryTradeLogPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            entryTrades: []
        };
    };

    componentDidMount = () => {
        this.getEntryTrades();
    };

    getEntryTrades = () => {
        axios.get(`/entryTrade/userTrades/${this.props.user.id}`).then(res => {
            this.setState({
                entryTrades: res.data
            });
        }).catch(err => {
            console.log(err);
        });
    };

    render = () => {
        return (
            <div>
                <UserNavbar history={this.props.history} />
                <br />
                <div>
                    <Container>
                        <Row>
                            <Col xs={10} className='section-solid-white text-white mx-auto'>
                                <h3 className='text-center'>
                                    Entry Trades
                                </h3>
                                <hr className='ln-white' />
                                <Table dark striped>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Trading Pair</th>
                                            <th>Total Investment</th>
                                            <th>Entry Price</th>
                                            <th>Total Coins</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <TableBody
                                        trades={this.state.entryTrades}
                                        updateTrades={this.getEntryTrades}
                                        history={this.props.history}
                                    />
                                </Table>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    };

};

export default withAuth(EntryTradeLogPage);
