class UserDTO{
    constructor(user){
        this._id = user._id;
        this.email = user.email;
        this.username = user.username;
    }
}

module.exports = UserDTO;