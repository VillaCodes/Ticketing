import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties/attributes
// that are required to create a new user

interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User model has

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

//In mongoose, when we indicate the type of a property, we capitalize it
//Because we're referring to an actual constructor 

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  }, 
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

//pre-save hook for mongoose
//We use function keyword instead of => because mongoose gives you access
//to the user document as 'this'. In an arrow function, this is overwritten to mean
//the context of this file itself.

userSchema.pre('save', async function(done) {
  //even if creating a user for first time, modified will be true
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});
//We will assign our build project to the statics property in Mongoose
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

//model will take in generic type param1, and return generic type param2
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };