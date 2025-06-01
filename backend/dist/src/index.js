"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
function determineStatus(cardNumber) {
    if (cardNumber.endsWith('1'))
        return 'approved';
    if (cardNumber.endsWith('2'))
        return 'declined';
    if (cardNumber.endsWith('3'))
        return 'gateway_error';
    return 'approved'; // default fallback
}
app.post('/checkout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userInfo, cartItems } = req.body;
        const orderNumber = 'ORD-' + Date.now();
        const cardLast4 = userInfo.cardNumber.slice(-4);
        const order = yield prisma.order.create({
            data: {
                orderNumber,
                fullName: userInfo.fullName,
                email: userInfo.email,
                phone: userInfo.phone,
                address: userInfo.address,
                city: userInfo.city,
                state: userInfo.state,
                zipCode: userInfo.zipCode,
                cardLast4,
                status: determineStatus(userInfo.cardNumber),
                orderItems: {
                    create: cartItems.map((item) => ({
                        productId: item.id,
                        color: item.color,
                        size: item.size,
                        quantity: item.quantity,
                    })),
                },
            },
        });
        // Update product inventory
        for (const item of cartItems) {
            yield prisma.product.update({
                where: { id: item.id },
                data: { inventory: { decrement: item.quantity } },
            });
        }
        res.status(200).json({ success: true, orderNumber });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}));
app.listen(3000);
