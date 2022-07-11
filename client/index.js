/* eslint-disable consistent-return, new-cap, no-alert, no-console */

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

(function () {

    const cardFields = paypal.CardFields({
        style: {
            "input": {
                "color": "blue",
                "box-shadow": "10px 10px 10px black"
            },
            "input.invalid": {
                "color": "purple"
            },
        },
        //style: {
        //    "@im\port url(\"https://www.example.com/path/to/css\");/*": {}
        //},
        createOrder: function (data, actions) {
            console.log("createOrder:", data);
            return fetch('/api/paypal/orders/create/', {
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
            return fetch(`/api/paypal/orders/${orderID}/capture/`, {
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
        //onChange: function (event) {
            //console.log("onChange:", event);
        //}
    });

    cardFields.render('#paypal-card-field-container'); // Display payment options on your web page

    const button = document.getElementById("pay-now-button");
    if (button) {
        button.addEventListener("click", function () {
            cardFields.submit().then(() => {
                console.log("success");
            }).catch((error) => {
                console.log("error:", error)
            });
        });
    }

})();

let cardFields = null;
(function () {

    const cardNameContainer = document.getElementById('card-name-field-container');
    const cardNumberContainer = document.getElementById('card-number-field-container');
    const cardCvvContainer = document.getElementById('card-cvv-field-container');
    const cardExpiryContainer = document.getElementById('card-expiry-field-container');
    const cardPostalCodeContainer = document.getElementById('card-postal-code-container');
    const button = document.getElementById('submit-button');

    cardFields = paypal.CardFields({

        createOrder: (data, actions) => {

            // Create the order on your server and return the order id

            return fetch('/api/paypal/order/create/', {
                method: 'post'
            }).then((res) => {
                return res.json();
            }).then((orderData) => {
                return orderData.id;
            });

        },
        onApprove: (data, actions) => {
            const { orderID } = data;

            // Capture the order on your server with `orderID`

            return fetch(`/api/paypal/order/${orderID}/capture/`, {
                method: 'post'
            }).then((res) => {
                return res.json();
            }).then((orderData) => {

                console.log("Payment approved and captured: ", orderData);

                // Handle successful transaction

            }).catch((error) => {
                
                // Handle error

            });
        },
    });

    const customStyles = {
        //height: "60px",
        padding: "10px",
        fontSize: "18px",
        fontFamily: '"Open Sans", sans-serif',
        transition: "all 0.5s ease-out",
        "input.invalid": {
            color: "red",
        },
    };

    // Optional cardholder name field
    cardFields.NameField({
        style: {
            "input": {
                "color": "green",
                "box-shadow": "10px 10px 10px black"
            },
            "input.invalid": {
                "color": "darkgreen"
            },
        },
        onChange: ({isValid, errors}) => {
            console.log('onchange name: ', isValid, errors);
        }
    }).render(cardNameContainer);

    cardFields.NumberField({
        style: {
            "input": {
                "color": "orange",
                "box-shadow": "10px 10px 10px black"
            },
            "input.invalid": {
                "color": "darkorange"
            },
        },
        onChange: ({isValid, errors}) => {
            console.log('onchange number: ', isValid, errors);
        }
    }).render(cardNumberContainer);

    cardFields.CVVField({
        style: {
            "input": {
                "color": "green",
                "box-shadow": "10px 10px 10px black"
            },
            "input.invalid": {
                "color": "darkgreen"
            },
        },
        onChange: ({isValid, errors}) => {
            console.log('onchange cvv: ', isValid, errors);
        }
    }).render(cardCvvContainer);

    cardFields.ExpiryField({
        style: {
            "input": {
                "color": "orange",
                "box-shadow": "10px 10px 10px black"
            },
            "input.invalid": {
                "color": "darkorange"
            },
        },
        onChange: ({isValid, errors}) => {
            console.log('onchange expiry: ', isValid, errors);
        }
    }).render(cardExpiryContainer);

    cardFields.PostalCodeField({
        style: {
            "input": {
                "color": "green",
                "box-shadow": "10px 10px 10px black"
            },
            "input.invalid": {
                "color": "darkgreen"
            },
        },
        minLength: 5,
        maxLength: 8,
        onChange: ({isValid, errors}) => {
            console.log('onchange postal code: ', isValid, errors);
        }
    }).render(cardPostalCodeContainer);

    button.addEventListener('click', () => {
        console.log('click');
        cardFields.submit().then(() => {

            // Success

        }).catch((error) => {

            // Handle error
            console.error(error);

        });
    });

})();

