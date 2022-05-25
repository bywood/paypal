/* eslint-disable consistent-return, new-cap, no-alert, no-console */
/*
paypal.Buttons({
    createOrder: function (data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '50.00'
                }
            }]
        });
    },
    onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
            window.location.href = "approve.html";
        });
    },
    onError: function (err) {
        console.log('Something went wrong', err);
    }
}).render('#paypal-button-container'); // Display payment options on your web page
*/

const cardFields = paypal.CardFields({
    createOrder: function (data, actions) {
        console.log("createOrder:", data);
        return fetch('/api/paypal/order/create/', {
            method: 'post'
        }).then((res) => {
            return res.json();
        }).then((orderData) => {
            console.log("order:", orderData);
            return orderData.id;
        });
    },
    onApprove: function (data, actions) {
        console.log("onApprove:", data);
        const { orderID } = data;
        return fetch(`/api/paypal/order/${orderID}/capture/`, {
            method: 'post'
        }).then((res) => {
            return res.json();
        }).then((orderData) => {
            console.log("Payment approved and captured:", orderData);
        });
    },
    onError: function (err) {
        console.log('Something went wrong', err);
    },
    onChange: function (event) {
        console.log("onChange:", event)
    }
});

cardFields.render('#paypal-button-container'); // Display payment options on your web page

const button = document.getElementById("button");
if (button) {
    button.addEventListener("click", function () {
        cardFields.submit().then(() => {
            console.log("success");
        }).catch((error) => {
            console.log("error:", error)
        });
    });
}
