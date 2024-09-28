// const { Types } = require('mongoose');
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const Message = require("../utilities/Message");
const Response = require("../utilities/Response");
const config = require("../config");
const { Types } = require("mongoose");
const addressModel = require("../models/address");
const { clearSearch } = require("../utilities/Helper");
const { paginationAggregate } = require("../utilities/pagination");

// const { clearSearch, genRandomNumber } = require("../utilities/Helper");
// const { paginationAggregate } = require('../utilities/pagination');
// const config = require("../config");
// const addressModel = require('../models/address');
// const cartModel = require("../models/cart");
// const orderModel = require("../models/order");

class UserService {
  static async userData(_id) {
    try {
      const response = { data: {}, status: false };
      const docData = await userModel.findOne({ _id: Types.ObjectId(_id) });
      response.data = docData;
      response.status = true;
      console.log(response);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  static async userUpdate(data) {
    try {
      const response = { data: {}, status: false };

      // Fetch user data by ID
      const docData = await userModel.findOne({
        _id: Types.ObjectId(data._id),
      });

      if (docData) {
        // Update user details
        docData.name = data.name;
        docData.profile_picture = data.profile_picture; // Changed this to use correct field for profile picture
        docData.email = data.email;

        // Fetch and update address data if it exists
        const addressData =
          (await addressModel.findOne({
            userId: Types.ObjectId(data._id),
          })) || new addressModel();

        console.log(addressData);
        if (addressData) {
          addressData.address_line_1 =
            data.address_line_1 || addressData?.address_line_1; // Assuming this field is correct
          addressData.pinCode = data.pinCode || addressData?.pinCode;
          addressData.city = data.city || addressData?.city;
          addressData.state = data.state || addressData?.state;
          addressData.country = data.country || addressData?.country;
          addressData.userId = data._id || addressData?.userId;

          await addressData.save();
        }

        await docData.save();
        response.status = true;
      }

      return response;
    } catch (e) {
      throw e; // Return the error to be handled by calling method
    }
  }

  static async profileUpadte(data) {
    const response = { data: {}, status: false };

    // Fetch user data by ID
    const docData = await userModel.findOne({
      _id: Types.ObjectId(data._id),
    });

    if (docData) {
      // Update user details
      docData.name = data.name;
      docData.profile_picture = data.profile_picture;
      docData.email = data.email;
      docData.isNumber_verified = data.isNumber_verified
      docData.mobile_no = data.mobile_no
      docData.status = data.status
      await docData.save();
      response.status = true;

      return response;

    }
  }

  static async sendOtp(data) {
    try {
      const response = { data: {}, status: false };
      let docData = await userModel.findOne({
        mobile_no: data.mobile_no,
        isDeleted: false,
      });

      if (!docData) {
        docData = new userModel();
        docData.mobile_no = data.mobile_no;
      }

      await docData.save();

      response.data = docData;
      response.status = true;

      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  static async validateOtp(data) {
    try {
      const response = { data: {}, status: false };

      const docData = await userModel.findOne({ _id: data.userId });

      if (docData) {
        docData.isNumber_verified = true;
        docData.save();

        response.data = {
          user: docData,
          token: this.genJwtToken(docData).data,
        };
        response.status = true;
      }

      return response;
    } catch (e) {
      throw e;
    }
  }

  static genJwtToken(data) {
    try {
      const response = { data: "", status: false };

      response.data = jwt.sign(
        {
          _id: data._id.toString(),
          exp: Math.floor(Date.now() / 1000) + config.jwt.expDuration * 60,
        },
        config.jwt.secretKey
      );

      response.status = true;

      return response;
    } catch (e) {
      throw new Error("Error while generating token" + e.message);
    }
  }

  static async register(data) {
    try {
      const response = { data: {}, message: "", status: false };

      const docData = await userModel.findOne({ email: data.email });
      if (docData) {
        // Handle the case where the user already exists
        response.message = "User already exists";
        throw new Error(response.message);
      }

      let newUser = new userModel();

      newUser.name = data.name;
      newUser.email = data.email;
      newUser.phone = data.phone;
      newUser.password = data.password;

      console.log(docData);
      let result = await newUser.save();

      response.status = true;
      response.data = null;
      return response;
    } catch (e) {
      throw e;
    }
  }

  static async login(data) {
    try {
      const response = { data: {}, message: "", status: false };

      let user = await userModel.findOne({ email: data.email });
      if (!user) {
        response.message = "User not found";
        throw new Error(response.message);
      }
      let isPasswordMatch = await user.isPasswordCorrect(data.password);
      if (!isPasswordMatch) {
        response.message = "Invalid credentials";
        throw new Error(response.message);
      }

      let token = await user.generateAccessToken();
      const { password, ...userWithoutPassword } = user.toObject();

      console.log(token);
      response.status = true;
      response.data = {
        token,
        user: userWithoutPassword,
      };
      return response;
    } catch (e) {
      throw Response.createError("", e);
    }
    ``;
  }

  // static calculateProfileCompletion(user) {
  //     // Define the weight for each essential field
  //     const fieldWeights = {
  //         name: 20,
  //         email: 20,
  //         phone: 20,
  //         dob: 20,
  //         avatar: 20,
  //     };

  //     let totalWeight = 0;
  //     let filledWeight = 0;

  //     // Calculate total and filled weights
  //     for (const field in fieldWeights) {
  //         totalWeight += fieldWeights[field];
  //         if (user[field]) {
  //             filledWeight += fieldWeights[field];
  //         }
  //     }

  //     // Calculate the profile completion percentage
  //     const profileCompletionPercentage = (filledWeight / totalWeight) * 100;

  //     return profileCompletionPercentage;
  // };
  // static async userData(_id) {
  //     try {
  //         const response = { data: {}, status: false };

  //         response.data = (await userModel.aggregate(
  //             [
  //                 { $match: { _id: _id ? Types.ObjectId(_id) : '', } },
  //                 {
  //                     $project: {
  //                         name: 1,
  //                         email: 1,
  //                         phone: 1,
  //                         avatar: 1,
  //                         pinCode: 1,
  //                         address:1,
  //                         gender:1,
  //                         status: 1,
  //                     }
  //                 },
  //             ]
  //         ))?.[0];
  //         // response.data.profileCompletePercent = this.calculateProfileCompletion(response.data);
  //         response.status = true;

  //         return response;
  //     } catch (e) {
  //         throw e;
  //     }
  // }

  // static async userUpdate(data) {
  //     try {
  //         const response = { data: {}, status: false };

  //         const docData = await userModel.findById(data._id);
  //         docData.name = data.name ?? docData.name;
  //         docData.phone = data.phone ?? docData.phone;
  //         docData.email = data.email ?? docData.email;
  //         docData.avatar = data.avatar ?? docData.avatar;
  //         docData.gender = data.gender ?? docData.gender;
  //         docData.address = data.address ?? docData.address;

  //         await docData.save();

  //         response.data = docData;
  //         response.status = true;

  //         return response;
  //     } catch (error) {
  //         throw error;
  //     }
  // }

  // static async detailsUser(_id) {
  //     const response = { data: {}, status: false };
  //     try {
  //         _id = Types.ObjectId(_id);
  //         response.data = await userModel.findOne(_id);
  //         response.status = true;
  //         return response;
  //     } catch (err) {
  //         throw err;
  //     }
  // }

  static async listUser(query = {}) {
    const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
    let response = { data: [], extra: { ...$extra }, status: false };

    try {
      const search = {
        _id: query._id
          ? Array.isArray(query._id)
            ? query._id?.map((v) => Types.ObjectId(v))
            : Types.ObjectId(query._id)
          : "",

        email: query.email ? query.email : "",
        email: query.name ? query.name : "",
        phone: query.phone ? query.phone : "",
        isDeleted: false,
      };
      clearSearch(search);

      const $aggregate = [
        { $match: search },
        { $sort: { _id: -1 } },
        {
          $project: {
            name: 1,
            email: 1,
            mobile_no: 1,
            profile_picture: 1,
            loginStatus: 1,
            isNumber_verified: 1,
            name: 1,
            status: 1,
          },
        },
      ];
      response = await paginationAggregate(userModel, $aggregate, $extra);
      response.status = true;
      return response;
    } catch (err) {
      throw err;
    }
  }
  // static async saveUser(data) {
  //     const _id = data._id;
  //     const response = { data: {}, status: false };

  //     try {
  //         const docData = _id ? await userModel.findById(_id) : new userModel();
  //         docData.phone = data.phone;
  //         docData.name = data.name;
  //         docData.email = data.email;
  //         docData.pinCode = data.pinCode;
  //         docData.avatar = data.avatar;
  //         docData.address = data.address;
  //         docData.gender = data.gender;
  //         docData.status = data.status;

  //         await docData.save();

  //         response.data = docData;
  //         response.status = true;

  //         return response;

  //     } catch (err) {
  //         throw err;
  //     }
  // }

  // static async deleteUser(ids) {
  //     const response = { status: false, ids: [] };
  //     try {
  //         if (Array.isArray(ids)) {
  //             await userModel.updateMany({ _id: { $in: ids } }, { isDeleted: true });
  //         } else if (typeof ids === 'string') {
  //             await userModel.updateOne({ _id: ids }, { isDeleted: true });
  //             response.id = ids
  //         }

  //         response.status = true;
  //         response.ids = ids;

  //         return response;
  //     } catch (err) {
  //         throw err;
  //     }
  // }
  // static async deleteCurrentUser(_id) {
  //     const response = { status: false };
  //     try {
  //         await addressModel.deleteMany({userId:_id})
  //         await cartModel.deleteMany({userId:_id})
  //         await orderModel.deleteMany({userId:_id})
  //         await userModel.updateOne({ _id },{$set: { isDeleted: true,name:"",email:"",gender:'Male',dob:null, }});

  //         response.status = true;

  //         return response;
  //     } catch (err) {
  //         throw err;
  //     }
  // }
}

module.exports = UserService;
