import React, { useEffect, useState, useContext } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Cart from "src/components/Cart";
import { urlGetParam } from "src/utils";
import { Button, Typography, Grid } from "@material-ui/core";
import QRCode from "qrcode";
import {
  HOME_PAGE,
  PAYMENT_STATUS,
  PRICE_FRACTION_DIGITS,
} from "src/constants";
import { AlertContext } from "src/contexts/AlertContext";
import "src/css/Receipt.css";
import "src/css/animation.css";
import { CartItem } from "src/interfaces";
import Page from "src/pages/Page";
import Header from "src/components/Header";
import CartSummary from "src/components/CartSummary";
import {
  GST_PERCENTAGE,
  priceSumArray,
  priceGetGST,
  priceSum,
  priceMul,
} from "src/priceLibrary";
import { microapps, isWeb } from "src/config";
declare const window: any;

const Receipt: React.FC<RouteComponentProps> = ({ history }) => {
  const orderId = urlGetParam("id");
  const { contents } = (history.location.state as any) || [];
  const [paymentStatus, setPaymentStatus] = useState<PAYMENT_STATUS>(
    PAYMENT_STATUS.AWAITING
  );
  const { setOpen, setAlertSeverity, setAlertMessage } = useContext(
    AlertContext
  );
  const qrCodeDiv: React.RefObject<HTMLInputElement> = React.createRef();
  const [viewQr, setViewQr] = useState(false);

  useEffect(() => {
    if (paymentStatus === PAYMENT_STATUS.SUCCESS) {
      confirm();
      generateQR();
    }
  }, [paymentStatus]);

  const makeFakeOrder = (contents: CartItem[]) => {
    const cartSubtotal = priceSumArray(
      contents && contents.length
        ? contents.map((cartItem: CartItem) =>
            priceMul(cartItem.item.price, cartItem.quantity)
          )
        : []
    );
    const curDay: number = new Date().getDay();
    const curMonth: number = new Date().getMonth();
    const curNow: number = Date.now();
    const curDateString = `order on: ${curDay}/${curMonth}`;
    const curOrderId = `paymentTemp-${curNow}`;
    const cartGST = priceGetGST(cartSubtotal);
    const cartTotal = priceSum(cartSubtotal, cartGST);
    const orderTemplate = {
      title: "ScanAndGo: Fairprice Purchase",
      subtitle: curDateString,
      imageUrl: "https://placekitten.com/200/200",

      items: contents.map((cartItem: CartItem) => ({
        title: cartItem.item.name,
        quantity: cartItem.quantity,
        price: {
          currency: "SGD",
          value: cartItem.item.price.toFixed(PRICE_FRACTION_DIGITS),
        },
      })),

      total: {
        currency: "SGD",
        value: cartTotal.toFixed(PRICE_FRACTION_DIGITS),
      },

      status: {
        type: "COMPLETED",
        label: "Your Groceries are ready to go!",
      },

      actions: [
        {
          label: "CONTINUE",
          url: "https://microapps.google.com/1971992074819089602",
        },
      ],

      orderId: curOrderId,
    };
    if (!isWeb) {
      microapps.createOrder(orderTemplate);
    } else {
      console.log("Attempting Order:");
      console.log(orderTemplate);
    }
  };

  const makePayment = () => {
    verify();
    // TODO (#50): Replace timeout mock with actual payflow
    setTimeout(() => {
      setPaymentStatus(PAYMENT_STATUS.SUCCESS);
      makeFakeOrder(contents);
    }, 3000);
  };

  const verify = () => {
    setViewQr(true);
    setPaymentStatus(PAYMENT_STATUS.SUBMITTED);
  };

  const confirm = () => {
    setAlertSeverity("success");
    setAlertMessage(`Order ${orderId} Confimed!`);
    setOpen(true);
  };

  const generateQR = () => {
    const text = `$Order ID: ${orderId}`;

    const divHeight = parseInt(
      window.getComputedStyle(qrCodeDiv.current)!.getPropertyValue("height"),
      10
    );
    const divWidth = parseInt(
      window.getComputedStyle(qrCodeDiv.current)!.getPropertyValue("width"),
      10
    );
    const width = Math.min(divHeight, divWidth);
    QRCode.toCanvas(
      document.getElementById("canvas"),
      text,
      { width: width },
      (err) => {
        if (err) console.error(err);
      }
    );
  };

  const returnToHome = () => {
    history.push({
      pathname: HOME_PAGE,
    });
  };

  const changeView = () => {
    if (paymentStatus === PAYMENT_STATUS.AWAITING) {
      return;
    }
    setViewQr(!viewQr);
  };

  return (
    <Page
      header={
        <Header
          title={
            <Typography variant="h4">
              {paymentStatus === PAYMENT_STATUS.SUCCESS
                ? "Receipt"
                : "Order Summary"}
            </Typography>
          }
        />
      }
      content={
        <div className="receipt-content">
          {!viewQr && (
            <div className="order">
              <Typography variant="h6">Order details</Typography>
              <div className="details" onClick={changeView}>
                {contents && (
                  <Cart contents={contents} collapse={true} showMedia={false} />
                )}
                <CartSummary cartItems={contents}></CartSummary>
              </div>
            </div>
          )}
          {paymentStatus === PAYMENT_STATUS.SUBMITTED && (
            <div className="payment">
              <Typography
                variant="h5"
                align="center"
                className={"trailing-dots"}
              >
                Verifying payment, please wait
              </Typography>
            </div>
          )}
          {paymentStatus === PAYMENT_STATUS.SUCCESS && (
            <div
              className="qrCode"
              onClick={changeView}
              style={{ display: viewQr ? "flex" : "none" }}
              hidden={!viewQr}
              ref={qrCodeDiv}
            >
              <canvas id="canvas" />
              <Typography align="center" color="textSecondary">
                Please show this to the cashier for verification.
              </Typography>
              <Typography align="center" color="textSecondary">
                Tap to see order details.
              </Typography>
            </div>
          )}
        </div>
      }
      footer={
        <Button
          onClick={
            paymentStatus === PAYMENT_STATUS.AWAITING
              ? makePayment
              : returnToHome
          }
          className="button"
          variant="contained"
          color="primary"
          fullWidth={true}
        >
          {paymentStatus === PAYMENT_STATUS.AWAITING
            ? "Confirm Checkout"
            : "Return to home"}
        </Button>
      }
    />
  );
};

export default withRouter(Receipt);
