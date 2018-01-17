const mongoose = require('mongoose');
const User = require('../../models/user.model');
const Vendor = require('../../models/vendor.model');
const Order = require('../../models/order.model');
const SendOtp = require('sendotp');
const Constants = require('../../helpers/constants');
const sendOtp = new SendOtp(process.env.AUTHKEY_MSG91);
import { GraphQLUpload } from 'apollo-upload-server'

const resolver = {
    Upload: GraphQLUpload,
    Query: {
        /**
         * Orders
         */
        getAllOrders: async (parent, args) => {
            return await Order.find({}, (err, res) => {
                return res;
            });
        },
        getOrder: async (parent, args) => {
            return await Order.findById(args._id);
        },
        getOrdersByUser: async (parent, args) => {
            return await Order.find({ orderBy: args.userId });
        },

        /**
         * Users
         */
        getAllUsers: async (parent, args) => {
            return await User.find({}, (err, res) => {
                return res;
            });
        },
        getUser: async (parent, args) => {
            return await User.findById(args._id);
        }, 
        
        /**
         * Vendors
         */
        getAllVendors: async (parent, args) => {
            return await Vendor.find({}, (err, res) => {
                return res;
            });
        },
        getVendor: async (parent, args) => {
            return await Vendor.findById(args._id);
        }, 

    },
    Mutation: {
        /**
         * Orders
         */
        placeOrder: async (parent, args) => {
            const order = new Order(args);
            return await order.save();
        },
        updateOrder: async (parent, args) => {
            return await Order.findOneAndUpdate({ _id: args._id });
        },
        removeOrder: async (parent, args) => {
            return await Order.findByIdAndRemove({ _id: args._id });
        },
        updateOrderStatus: async (parent, { _id, ...doc }) => {
            await Order.update({ _id }, doc);
            return { _id, ...doc }
        },

        /**
         * Users
         */
        sendOtp: async (parent, args) => {
            var otp = Math.floor(Math.random() * 8999) + 1000;
            await sendOtp.send(args.mobileNumber, Constants.SENDER_ID, otp, (error, data, response) => {
                if (error) {
                    return next(error)
                } else if (data.type === "success") {
                    return true;
                }
            });
        },
        verify:  async (parent, args) => {
            await sendOtp.verify(args.mobileNumber, args.otp, (error, data, response) => {
                if (error) {
                    return next(error)
                } else if (data.type === "success") {
                    return await User.findOneAndUpdate({ mobileNumber: args.mobileNumber })
                }
                else {
                    return { success: false, error: false, message: 'Otp does not verified!' }
                }
            });
        },
        signupUser: async(parent, args) => {
            return await Order.findByIdAndUpdate({ _id: args._id });
        },

        /**
         * Vendors
         */
        signupVendor: async(parent, args) => {
            const vendor = new User(args);
            return await vendor.save();
        },
        updateVendor: async(parent, args) => {
            return await Order.findByIdAndUpdate({ _id: args._id });
        },


    }
}
module.exports = resolver;