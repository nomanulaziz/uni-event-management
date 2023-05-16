class EventDetailsDTO{
    constructor(event){
        this._id = event._id;
        this.title = event.title;
        this.content = event.content;
        // this.type = event.type;
        // this.date = event.date;
        // this.time = event.time;
        // this.venue  = event.venue;
        this.image = event.image;
        this.createdAt = event.createdAt;
        this.adminName = event.admin.name;
        this.adminUsername = event.admin.username;
    }
}

module.exports = EventDetailsDTO;