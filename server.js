const mongoose = require ('mongoose');
const Schema = mongoose.Schema; // Pobieram główny konstruktor modelu mongoose

mongoose.Promise = global.Promise;


mongoose.connect('mongodb://localhost/nodeappdatabase', {
    useNewUrlParser: true
});
 

//Tworzę schemat dla aplikacji
const userSchema = new Schema({
    name: String,
    username: { type: String, required : true, unique: true},
    password: { type: String, required: true },
    admin: Boolean,
    created_at: Date,
    updated_at:Date
});

//Tworzę metody dla modelu Mongoose
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

//Tworzę model na podstawie schematu
const User = mongoose.model('User', userSchema);

//Operacje CRUD z Mongoose. Znalezienie wszystkich rekordów w bazie
User.find({}, function(err, res){
    if (err) throw err;
    console.log('Actual database records are' + res)
})
// to samo co wyzej tylko ES6 Promise
const query = User.find({});
const promise = query.exec();
promise.then(function(records){
    console.log('Actual database records are ' + records);
});
promise.catch(function(reason) {
    console.log('Something went wrong:', reason);
});

//Znaleziesnie wybranych rekordów w bazie. (pasujących do zapytania)
User.find({ username: 'Alpha_wolf'}).exec(function(err, res){
    if (err) throw err;
    console.log('Record you are looking for is ' + res);
});

//Aktualizowanie dokumentów. Tutaj hasła.
User.find({ username: 'Alpha_wolf'}, function(err, user){
    if (err) throw err;
    console.log('Old password is ' + user[0].password);
    user[0].password = 'newPassword';
    console.log('New password is ' + user[0].password);

    user[0].save(function(err) {
        if (err) throw err;
        console.log('Użytkownik ' + user[0].name + ' został pomyślnie zaktualizowany');
    })
});

//Usuwanie dokumentów
User.find({ username: 'Mark_pain_gain'}, function(err, user) {
    if (err) throw err;
    user = user[0];
    user.remove(function(err) {
        if (err) throw err;

        console.log('User successfully deleted');
    });
});
/* Wersja skrócona za pomocą wbudowanej metody która robi to samo (del user)
User.findOneAndRemove({ username: 'Benny_the_man' }, function(err) {
    if (err) throw err;

    console.log('User deleted!');
});
 */


/*
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

kamil.save(function(err){
    if (err) throw err;

    console.log('User zapisany pomyślnie');
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

alpha.save(function(err) {
    if (err) throw err;

    console.log('User ' + alpha.name + ' zapisany pomyślnie');
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

mark.save(function(err) {
    if (err) throw err;

    console.log('Uzytkownik ' + mark.name +  ' zapisany pomyslnie');
});
*/
