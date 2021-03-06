var HTTPPollProvider = require('./http_poll')
	, util = require('util');

var Ganglia = function(settings) {
	HTTPPollProvider.apply(this,arguments);
	this.providerName = 'Ganglia';
	this.defaults.pathSuffix = 'graph.php';
};
util.inherits(Ganglia,HTTPPollProvider);
Ganglia.prototype.getGetParameters = function() {
	var params = {}, settings = this.settings;
	if ( settings.query ) {
		params = settings.query;
	} else {
		params.r = 'hour';
		if ( this.settings.cluster ) {
			params.c = this.settings.cluster;
		}
		if ( this.settings.metric ) {
			params.g = this.settings.metric;
		}
	}
	if ( typeof params == 'string' ) {
		params += '&json=1';
	} else {
		params.json = 1;
	}
	return params;
};
Ganglia.prototype.parseData = function( data ) {
	var i, j, item, out = {}, itemData;
	for (i=0;i<data.length;i++) {
		item = data[i];
		itemData = [];
		for (j=0;j<item.datapoints.length-1;j++) { // skip last data point which is likely to be 0
			itemData.push([
				item.datapoints[j][1] * 1000, // timestamps in js are in ms
				item.datapoints[j][0]
			]);
		}
		out[item.ds_name] = itemData;
	}
	return out;
};

module.exports = Ganglia;