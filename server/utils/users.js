class Users{

    constructor(){
        this.users = [];
    }

    addUser(id, name, room){
        let user = { id, name, room };
        this.users.push(user);
        return user;
    }

    getUserList(room){
        const users = this.users.filter((user) => { return user.room === room });
        const users_name = users.map((user) => { return user.name });
        return users_name;
    }

    getUser(id){
        return this.users.filter((user) => 
            user.id === id
        )[0];
    }

    removeUser(id){
        const user = this.getUser(id);
        if(user){
            this.users = this.users.filter((user) => user.id != id);
        }
        return user;
    }
}

module.exports = Users;