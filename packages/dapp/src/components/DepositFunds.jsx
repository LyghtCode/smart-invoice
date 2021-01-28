import '../sass/depositFunds.scss';

import { BigNumber, Contract, utils } from 'ethers';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { Web3Context } from '../context/Web3Context';
import { ADDRESSES, NATIVE_TOKEN_SYMBOL } from '../utils/constants';
import { getToken, getTxLink } from '../utils/helpers';
import { Loader } from './Loader';

const { WRAPPED_TOKEN } = ADDRESSES;

export const DepositFunds = ({ invoice, deposited }) => {
  const { address, token, amounts } = invoice;
  const [paymentType, setPaymentType] = useState(0);
  const numAmounts = amounts.length;
  const { provider } = useContext(Web3Context);
  const [amount, setAmount] = useState(BigNumber.from(0));
  const [amountInput, setAmountInput] = useState('');
  const tokenData = getToken(token);
  const { decimals, symbol } = tokenData;
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState();
  const deposit = async () => {
    if (!amount || !provider) return;
    try {
      setLoading(true);
      let tx;
      if (paymentType === 1) {
        tx = await provider
          .getSigner()
          .sendTransaction({ to: address, value: amount });
      } else {
        const abi = ['function transfer(address, uint256) public'];
        const tokenContract = new Contract(token, abi, provider.getSigner());
        tx = await tokenContract.transfer(address, amount);
      }
      setTransaction(tx);
      await tx.wait();
      window.location.href = `/invoice/${address}`;
    } catch (depositError) {
      // eslint-disable-next-line
      console.error({ depositError });
    }
    setLoading(false);
  };
  const amountsRef = useRef(null);
  const isWRAPPED = token.toLowerCase() === WRAPPED_TOKEN;

  useEffect(() => {
    if (amountsRef.current) {
      for (let i = 0; i < numAmounts; i += 1) {
        const checkbox = amountsRef.current.children[i];
        checkbox.addEventListener('sl-change', () => {
          if (checkbox.checked) {
            setAmountInput(_input => {
              const amt = _input
                ? utils.parseUnits(_input, decimals)
                : BigNumber.from(0);
              return utils.formatUnits(amt.add(amounts[i]), decimals);
            });
          } else {
            setAmountInput(_input => {
              const amt = _input
                ? utils.parseUnits(_input, decimals)
                : BigNumber.from(0);
              return amt.gt(amounts[i])
                ? utils.formatUnits(amt.sub(amounts[i]), decimals)
                : '0';
            });
          }
        });
      }
    }
  }, [amountsRef, numAmounts, amounts, decimals]);

  useEffect(() => {
    if (amountInput) {
      setAmount(utils.parseUnits(amountInput, decimals));
    }
  }, [amountInput, decimals]);

  let sum = BigNumber.from(0);
  return (
    <div className="deposit-funds">
      <h1> PAY INVOICE </h1>
      <p className="modal-note">
        At a minimum, you’ll need to deposit enough to cover the first project
        payment.
      </p>

      <p className="amount-heading">How much will you be depositing today?</p>
      <div className="amount-details" ref={amountsRef}>
        {amounts.map((a, i) => {
          sum = sum.add(a);
          return (
            <sl-checkbox
              key={i.toString()}
              value={a}
              name={i}
              checked={deposited.gte(sum)}
              disabled={deposited.gte(sum)}
            >
              Payment #{i + 1} &nbsp; &nbsp;
              {utils.formatUnits(a, decimals)} {symbol}
            </sl-checkbox>
          );
        })}
      </div>

      <div className="control has-icons-right">
        <span className="label"> Amount </span>
        <input
          className="input"
          type="number"
          value={amountInput}
          onChange={e => setAmountInput(e.target.value)}
          placeholder="Amount to Deposit"
        />
        {isWRAPPED ? (
          <select
            className="icon is-right"
            onChange={e => setPaymentType(Number(e.target.value))}
            value={paymentType}
          >
            <option value="0">{symbol}</option>
            <option value="1">{NATIVE_TOKEN_SYMBOL}</option>
          </select>
        ) : (
          <span className="icon is-right">{symbol}</span>
        )}
      </div>
      <button type="submit" onClick={deposit}>
        {loading ? <Loader size="20" color="#ffffff" /> : 'Deposit'}
      </button>
      {transaction && (
        <a
          href={getTxLink(transaction.hash)}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Transaction on Explorer
        </a>
      )}
    </div>
  );
};
