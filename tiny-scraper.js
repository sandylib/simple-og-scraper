
const axios = require('axios');
const EventEmitter = require('events');
const getMeta = require("lets-get-meta")



class TinyScraper extends EventEmitter {
	constructor(url, count){
		super ();
		this.url = url || '';
		this.count = count;
		if(!this.valid(this.url)) {
			this.emit('error', 'in valid')
			process.exit()
		}else {
		
			this.fetchInfo(this.url, this.count)
		}

	}
	
	valid(url) {
		const l = new URL(url)
		return l.pathname.length !== '/' && url !== undefined
	}

	fetchInfo = async (url ,count) => {
		try {
			
			const data = await axios(url);
			if(count) this.emit('timeout', 'time out' );
			this.emit('scrapeStarted', url);
			let result = {};
			if(data) {
				 const metas = getMeta(data.data);
			    result = {title: metas['og:title'], description: metas['og:description'], image: metas['og:image']};
			}
			this.emit('scrapeSuccess', result);
			
		} catch (error) {
			this.emit('error', error)
		}
	}

}

module.exports = TinyScraper;


