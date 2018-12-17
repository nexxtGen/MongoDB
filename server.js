const mongoose = require ('mongoose');
const Schema = mongoose.Schema; // Pobieram główny konstruktor modelu mongoose


//Add client info. test
var express = require('express');
var app = express();

app.get('/', (req, res) => res.send('This app is working!!!'));

var port = process.env.port || 3000;

app.listen(port);
//------

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://nexxtGen:password1@ds117334.mlab.com:17334/database-1', {
    useNewUrlParser: true
}); 

//Tworzę schemat dla aplikacji (new user Schema)
const userSchema = new Schema({
    name: String,
    username: { type: String, required : true, unique: true},
    password: { type: String, required: true },
    admin: Boolean,
    created_at: Date,
    updated_at:Date
});

//Tmetody dla schema Mongoose
userSchema.methods.manify = function(next) {
    this.name = this.name + '-men';

    return next(null, this.name);
};

//Metody pre-save
userSchema.pre('save', function(next){
    //pobranie aktualnego czasu
    const currentDate = new Date();

    //zmiana pola na aktualny czas
    this.updated_at = currentDate;

    if (!this.created_at) {
        this.created_at = currentDate;
    }
    // next() jest funkcją która przechodzi do następnego hooka do
    // wykonania przed lub po requeście
    next();
})

//Tworzę model na podstawie schematuuserSchema (model based on userSchema)
const User = mongoose.model('User', userSchema);

// Create instances of user object
const kamil = new User({
    name: 'Kamil',
    username: 'coincidence',
    password: 'password'
});

//wywołanie metody
kamil.manify(function(err, name){
    if (err) throw err;
    console.log('Twoje nowe imię to: ' + name);
});

//Tworzę więcej userów
const alpha = new User({
    name: 'Alpha',
    username: 'Alpha_wolf',
    password: 'password'
});

alpha.manify(function(err, name){
    if (err) throw err;
    console.log('Twoje nowe imię to: ' + name);
});

const mark = new User({
    name: 'Mark',
    username: 'Mark_pain_gain',
    password: 'password'
});

mark.manify(function(err, name) {
    if (err) throw err;
    console.log('Twoje nowe imię to: ' + name);
});

//Operacje CRUD z Mongoose.
const findAllUsers = function() {
    return User.find({}, function(err, res){
        if (err) throw err;
        console.log('Actual database records are' + res)
    });
}

const findSpecificRecord = function() {
    //Znaleziesnie wybranych rekordów w bazie. (pasujących do zapytania)
    return User.find({ username: 'Alpha_wolf'}, function(err, res){
        if (err) throw err;
        console.log('Record you are looking for is ' + res);
    });    
}

const updateUserPassword = function() {
    //zmiana hasła wybranego usera
    return User.findOne({ username: 'Alpha_wolf'})
        .then(function(user) {
            console.log('Old password is ' + user.password);
            console.log('Name ' + user.name);
            user.password = 'newPassword';
            console.log('New password is' + user.password);
            return user.save(function(err) {
                if (err) throw err;

                console.log('Użytkownik ' + user.name + ' został poprawnie zaktualizowany');
            })
        })
}

const updateUsername = function() {
    // zmiana nazwy użytkownika
    return User.findOneAndUpdate({ username: 'Mark_pain_gain' }, { username: 'Mark_pain_gain' }, { new: true }, function(err, user) {
        if (err) throw err;

        console.log('Nazwa uzytkownika po aktualizacji to ' + user.username);
    })
}

const findMarkAndDelete = function() {
    // Znalezienie specyficznego usera i jego usunięcie
    return User.findOne({ username: 'Mark_pain_gain' })
        .then(function(user) {
            return user.remove(function() {
                console.log('User successfully deleted');
            });
        })
}

const findKennyAndDelete = function() {
    // Znalezienie specyficznego usera i jego usunięcie
    return User.findOne({ username: 'coincidence' })
        .then(function(user) {
            return user.remove(function() {
                console.log('User successfully deleted');
            });
        });
}

const findBennyAndRemove = function() {
    //Znalezienie specyficznego usera i jego usunięciee
    return User.findOneAndRemove({ username: 'Alpha_wolf' })
        .then(function(user) {
            return user.remove(function() {
                console.log('User successfully deleted');
            });
        });
}
/*
findMarkAndDelete();
findKennyAndDelete();
findBennyAndRemove();
*/


Promise.all([kamil.save(), alpha.save(), mark.save()])
    .then(findAllUsers)
    .then(findSpecificRecord)
    .then(updateUserPassword)
    .then(updateUsername)
    .then(findMarkAndDelete)
    .then(findKennyAndDelete)
    .then(findBennyAndRemove)
    .catch(console.log.bind(console))


 