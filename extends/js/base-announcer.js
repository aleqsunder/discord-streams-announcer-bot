export default class BaseAnnouncer {
    constructor() {
        this.queue = []
        
        this.checkStream = this.checkStream.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
    }
    
    async checkStream() {}
    
    sendMessage() {}
    
    async runQueue(_client) {}
}
