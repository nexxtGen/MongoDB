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
