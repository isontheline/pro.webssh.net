(function() {
    let currency = '{{{ CURRENCY : USD : EUR : GBP : CHF : JPY }}}'
    let r = $http.get('https://api.coinbase.com/v2/prices/BTC-' + currency + '/spot')
    if (!r || !r.ok) {
        return null;
    }
    let price = parseFloat(JSON.parse(r.body).data.amount)
    return {
        label: Math.round(price).toLocaleString('en-US') + ' ' + currency,
        icon: 'bitcoinsign.circle',
        value: price // exact number for the sparkline
    };
})();
