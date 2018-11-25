const mongoose = require ('mongoose');
const Schema = mongoose.Schema; // Pobieram główny konstruktor modelu mongoose

mongoose.connect('mongodb://localhost/nodeappdatabase', {
    useMongoClinet: true
});

//Tworzę schemat dla aplikacji
const userSchema = new Schema({
    name: String,
    username: { type: String, required : true, unique: true},
    password: { type: String, required: true },
    admin: Boolean
});

//Tworzę model na podstawie schematu
const User = mongoose.model('User', userSchema)

//Tworzę metody dla modelu

userSchema.methods.manify = function(next) {
    this.name = this.name + '-boy';

    return next(null, this.name);
};

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


