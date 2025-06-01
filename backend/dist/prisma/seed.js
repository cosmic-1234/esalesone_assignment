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
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get('https://mocki.io/v1/7fed707e-0db9-4a47-be28-a8bb877a3b24');
        const products = response.data;
        const formattedData = products.map((item) => ({
            title: item.title,
            description: item.description,
            price: item.price,
            image: item.image,
            colors: item.variants.colors,
            sizes: item.variants.sizes,
            inventory: 100, // You can randomize this if needed
        }));
        yield prisma.product.createMany({
            data: formattedData,
            skipDuplicates: true,
        });
        console.log('Products seeded successfully!');
    });
}
main()
    .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
