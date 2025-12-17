import { notifications } from "../db/db";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET } from "../config/jwt";
const db = require('../../../db.json');

// Arpit@887887
const users = db.users;

const resolvers = {
    Query: {
        getNotification: async (_: any, { id }: { id: string }) => {
            const notification = await notifications.findById(id);
            return notification;
        },
        getAllNotifications: async (_: any, { limit = 10, skip = 0 }) => {
            const allNotifications = await notifications.find();
            const paginated = allNotifications.slice(skip, skip + limit);
            return {
                getAllNotifications: paginated,
                totalCount: allNotifications.length
            };
        },

    },
    Mutation: {
        login: async (_: any, { username, password }: any) => {
            const user = users.find(u => u.username === username);
            if (!user) throw new Error('User not found');

            const valid = bcrypt.compareSync(password, user.password);
            if (!valid) throw new Error('Incorrect password');

            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            return { token, user };
        },
        createNotificationMut: async (_: any, { input }: any) => {
            const createNotification = new notifications({
                name: input.name,
                description: input.description,
            });
            createNotification.id = '' + createNotification._id;
            await createNotification.save();
            return createNotification;
        },
        updateNotificationMut: async (_: any, { input }: any) => {
            const updateNotification = await notifications.findOneAndUpdate(
                { _id: input.id },
                input,
                { new: true }
            );
            return updateNotification;
        },
        deleteNotificationMut: async (_: any, { id }: { id: string }) => {
            const getval = await notifications.findById(id);
            if (getval) {
                await notifications.findOneAndDelete({ _id: id });
                return "Deleted Successfully";
            } else {
                return "Id not found";
            }
        }
    }
};

export default resolvers;
