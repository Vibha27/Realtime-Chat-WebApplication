// creating helper function for managing users
const users = [];

// for adding user
const addUser = ({id,name,room})=>{
    // removing white space and converting in lowercase from user i/p
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // if there an existing user that user is trying to login with
    const existingUser = users.find((user) => user.room === room && user.name === name) ;
    // if existingUser return true
    if(existingUser){
        return { error: "user name already taken" };
        
    }
    // else adding in users array
    const user = { id,name,room };
    users.push(user);
    return { user }
}

// for removing user
const removeUser = (id)=>{
    // checking if user is there
    const index = users.findIndex((user)=> user.id === id);
    if(index != -1){
        // removing user and return user.name by [0]
        return users.splice(index,1)[0];
    }
}

// get user
const getUser = (id)=> users.find( (user) => user.id === id);

// get users in specfic room by using filter method and return all user of that room
const getUsersInRoom = (room)=> users.filter((user) => user.room === room );


// exporting all modules
module.exports = { addUser, removeUser, getUser, getUsersInRoom };