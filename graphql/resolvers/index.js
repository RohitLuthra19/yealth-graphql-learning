const mongoose = require('mongoose');
const Order = require('../../models/order.model');

const resolver = {
    Query: {
        getAllOrders: async (parent, args) => {
            return await Order.find({}, (err, res) => {
                return res;
            });
        },
        getOrder: async (parent, args) => {
            return await Order.findById(args._id);
        },
        getOrdersByUser: async (parent, args) => {
            return await Order.find({orderBy : args.userId});
        }
    },
    Mutation: {
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
        updateOrderStatus: async (parent, args) => {
            return await Order.findOneAndUpdate({ _id: args._id });
        }
    }
}
module.exports = resolver;