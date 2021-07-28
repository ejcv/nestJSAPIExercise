// //feature
// class FriendsList {
//     friends = [];

//     addFriend(name) {
//         this.friends.push(name);
//         this.announceFriendship(name);
//     }
    
//     announceFriendship(name) {
//         global.console.log(`${name} is now a friend!`);
//     }

//     removeFriend(name) {
//         const idx = this.friends.indexOf(name);

//         if (idx === -1) {
//             throw new Error('Friend not found!');
//         }

//         this.friends.splice(idx, 1);
//     }
// }

// //test

// describe('FriendsList', ()=> {
    
//     let friendsList;

//     beforeEach(() => {
//         friendsList = new FriendsList();
//     });

//     it('initializes friends list', () => {
//         expect(friendsList.friends.length).toEqual(0);
//     });

//     it('adds a friend to the list', () => {
//         friendsList.addFriend('Ernesto');
//         expect(friendsList.friends.length).toEqual(1);
//     });

//     it('announces friendship', () => {
//         friendsList.announceFriendship = jest.fn();
//         friendsList.addFriend('Ernesto');
//         expect(friendsList.announceFriendship).toHaveBeenCalled();
//     });

//     describe('removeFriend', () => {
//         it('removes a friend from the list', () => {
//             friendsList.addFriend('Ernesto');
//             expect(friendsList.friends[0]).toEqual('Ernesto');
//             friendsList.removeFriend('Ernesto');
//             expect(friendsList.friends[0]).toBeUndefined();
//         });

//         it('throws an error as friend does not exist', () =>{
//             expect(() => friendsList.removeFriend('Ernesto')).toThrow(new Error('Friend not found!'));
//         });
//     });
// });


