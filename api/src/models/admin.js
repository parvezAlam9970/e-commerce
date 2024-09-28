const { Schema, model, Types } = require('mongoose');
const bcrypt = require('bcryptjs'), SALT_WORK_FACTOR = 10;

const modelSchema = new Schema({
    roleId: {
        type: Types.ObjectId,
        ref: "roles"
    },
    adminRights: {
        type:[String],
        enum:['Product','User','Coupon', 'Sub Admin', 'Profile','Menu','Category','Brand','Attributes','Products','Popular Search','Colors','Size','Size Chart','Size Category','All About Products','Customization','Header Customization','Homepage Customization','Banner Master','BOGO','Single Offer','Orders','Blog Master','Blogs','Authors','Blog Comments','Setting Master','Delivery Area','Application','Contact Us','Settings','News Letter','User Queries','FAQ','Feedbacks']
    },
    type: {
        type: String,
        enum: ['superAdmin', 'subAdmin'],
        default: 'subAdmin'
    },
   
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    pinCode: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

modelSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err)
                return next(err);
            user.password = hash;
            next();
        });
    });
});

module.exports = model('admin', modelSchema);